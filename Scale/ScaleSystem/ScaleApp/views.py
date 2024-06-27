import calendar

import pytz
from django.shortcuts import render
from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser
from rest_framework.views import Response
from django.http import JsonResponse, HttpResponseRedirect
from datetime import date, timedelta, datetime
from django.db.models import Sum, Count, Q
from django.utils import timezone
from django.db.models.functions import ExtractWeek, TruncDate

from . import serializers
from .models import User, Scale, Weight, Customer, Product


def home(request):
    return render(request, 'layout/home.html')


class ScaleView(viewsets.ViewSet,
                generics.ListAPIView,
                generics.RetrieveAPIView):
    queryset = Scale.objects.all()
    serializer_class = serializers.ScaleSerializer

    # danh sach phieu can cua mot can
    @action(methods=['get'], detail=True)
    def weight_lists(self, request, pk):
        today = datetime.now().date()
        scales = self.get_object().weight_set.all().filter(date_time__date=today)

        return Response(serializers.WeightSerializer(scales, many=True, context={'request': request}).data,
                        status=status.HTTP_200_OK)


class UserView(viewsets.ViewSet,
               generics.CreateAPIView,
               generics.UpdateAPIView,
               generics.ListAPIView):
    queryset = User.objects.filter(is_active=True).all()
    serializer_class = serializers.UserSerializer
    parser_classes = [JSONParser]

    def get_permissions(self):
        if self.action.__eq__('current_user'):
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='current-user', url_name='current-user', detail=False)
    def current_user(self, request):
        return Response(serializers.UserSerializer(request.user).data)

    # danh sach thong tin can cua 1 user
    @action(methods=['get'], detail=True)
    def scales(self, request, pk):
        users = self.get_object().scale_set.all()

        return Response(serializers.ScaleSerializer(users, many=True, context={'request': request}).data,
                        status=status.HTTP_200_OK)


class ProductView(viewsets.ViewSet,
                  generics.ListAPIView,
                  generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = serializers.ProductSerializer


class CustomerView(viewsets.ViewSet,
                   generics.ListAPIView,
                   generics.RetrieveAPIView):
    queryset = Customer.objects.all()
    serializer_class = serializers.CustomerSerializer


class WeightView(viewsets.ViewSet,
                 generics.CreateAPIView,
                 generics.ListAPIView,
                 generics.RetrieveAPIView):
    queryset = Weight.objects.all()
    serializer_class = serializers.WeightSerializer

    # tim kiem theo ten khách hàng hoặc tên sản phẩm
    def get_queryset(self):
        queries = self.queryset

        keyword = self.request.query_params.get("keyword", "")

        if keyword:
            queries = queries.filter(Q(ProdName__icontains=keyword) | Q(CustName__icontains=keyword))

        filter_type = self.request.query_params.get("type", "")

        if filter_type:
            if filter_type == "in":
                queries = queries.filter(Trantype="Nhập hàng")
            elif filter_type == "out":
                queries = queries.filter(Trantype="Xuất hàng")
            # Nếu người dùng không chọn in hoặc out, thì giữ nguyên kết quả từ khóa
            else:
                pass

        return queries

    #  tim kiem theo 1 ngay cu the
    def count_weight_of_day(self, request, year, month, day, type):
        date_weight = datetime(year, month, day).date()

        if type == 1:
            weight_list = Weight.objects.filter(date_time__date=date_weight, Trantype="Nhập hàng").all()
            sum_Netweight = Weight.objects.filter(date_time__date=date_weight, Trantype="Nhập hàng").aggregate(sum=Sum('Netweight'))[ 'sum']
        elif type == 2:
            weight_list = Weight.objects.filter(date_time__date=date_weight, Trantype="Xuất hàng").all()
            sum_Netweight = Weight.objects.filter(date_time__date=date_weight, Trantype="Xuất hàng").aggregate(sum=Sum('Netweight'))['sum']
        else:
            weight_list = Weight.objects.filter(date_time__date=date_weight).all()
            sum_Netweight = Weight.objects.filter(date_time__date=date_weight).aggregate(sum=Sum('Netweight'))['sum']

        if sum_Netweight is None:
            sum_Netweight = 0

        data = {
            "NgayTimKiem": date_weight,
            "TongHang": sum_Netweight,
            "TongSoPhieu": len(weight_list),
            "PhieuCan": []
        }

        for index, weight in enumerate(weight_list, start=1):
            weight_data = {
                "STT": index,
                "key": weight.id,
                "MaPhieu": weight.Ticketnum,
                "TLHang": weight.Netweight,
                "NgayTaoPhieu": weight.date_time,
            }
            data["PhieuCan"].append({"phieuCan": weight_data})

        return JsonResponse(data, safe=False)

    #  thong ke theo thang theo tung can
    def count_weight_by_month(self, request, canId):
        current_year = datetime.now().year
        data = []
        for month in range(1, 13):
            result = Weight.objects.filter(date_time__year=current_year, date_time__month=month,CanId_id=canId).aggregate(count=Count('id'))
            result1 = Weight.objects.filter(date_time__year=current_year, date_time__month=month, CanId_id=canId).aggregate(total_weight=Sum('Netweight'))['total_weight']

            count = result['count'] or 0
            total_weight = result1 or 0
            data.append({'month': month, 'count': count, 'sum': total_weight})

        return JsonResponse(data, safe=False)

    # chi tiet phieu can trong 1 thang
    def weight_detail_month(self, request, month, type, canId):
        current_year = datetime.now().year

        if type == 1:
            weight_list = Weight.objects.filter(date_time__year=current_year, date_time__month=month,Trantype="Nhập hàng", CanId_id=canId)
        elif type == 2:
            weight_list = Weight.objects.filter(date_time__year=current_year, date_time__month=month,Trantype="Xuất hàng", CanId_id=canId)
        else:
            weight_list = Weight.objects.filter(date_time__year=current_year, date_time__month=month, CanId_id=canId)

        data = {
            "ThangTimKiem": month,
            "PhieuCan": []
        }

        for index, weight in enumerate(weight_list, start=1):
            weight_data = {
                "STT": index,
                "key": weight.id,
                "MaPhieu": weight.Ticketnum,
                "TLHang": weight.Netweight,
                "NgayTaoPhieu": weight.date_time,
            }
            data["PhieuCan"].append({"phieuCan": weight_data})

        return JsonResponse(data, safe=False)

    def weight_detail_week(self, request, year, month, day, type, canId):
        date_weight = datetime(year, month, day).date()

        if type == 1:
            weight_list = Weight.objects.filter(date_time__date=date_weight, CanId_id=canId, Trantype="Nhập hàng").all()
        elif type == 2:
            weight_list = Weight.objects.filter(date_time__date=date_weight, CanId_id=canId, Trantype="Xuất hàng").all()
        else:
            weight_list = Weight.objects.filter(date_time__date=date_weight, CanId_id=canId).all()

        data = {
            "PhieuCan": []
        }

        for index, weight in enumerate(weight_list, start=1):
            weight_data = {
                "STT": index,
                "key": weight.id,
                "MaPhieu": weight.Ticketnum,
                "TLHang": weight.Netweight,
                "NgayTaoPhieu":weight.date_time,
                "LoaiPhieu": weight.Trantype
            }
            data["PhieuCan"].append({"phieuCan": weight_data})

        return JsonResponse(data, safe=False)

    #  truy van du lieu so phieu tung ngay trong tuan ( thu 2, thu 3,...) cua tung can
    def count_weight_day_of_week(self, request, canId, num):
        # Tính ngày đầu tuần (thứ 2)
        today = datetime.now().date()

        if num == 0:
            start_of_week = today - timedelta(days=today.weekday()) + timedelta(weeks=0)
        else:
            start_of_week = today - timedelta(days=today.weekday()) + timedelta(weeks=-num)

        # Tạo danh sách chứa tất cả các ngày trong tuần
        all_days = [start_of_week + timedelta(days=i) for i in range(7)]

        # Truy vấn tổng số phiếu từng ngày từ thứ 2 đến chủ nhật trong tuần
        result = Weight.objects.filter(date_time__gte=start_of_week, CanId_id=canId).values('date_time__date').annotate(count=Count('id'))
        result1 = Weight.objects.filter(date_time__gte=start_of_week, CanId_id=canId).values('date_time__date').annotate(total_weight=Sum('Netweight'))

        # Tạo một từ điển để lưu trữ số phiếu theo ngày
        count_by_date = {item['date_time__date']: item['count'] for item in result}
        sum_by_date = {item['date_time__date']: item['total_weight'] for item in result1}

        # Chuẩn bị dữ liệu để truyền vào template
        data = []
        for day in all_days:
            ngay = day
            count = count_by_date.get(day, 0)
            total_weight = sum_by_date.get(day, 0)
            data.append({'ngay': ngay, 'count': count, 'total_weight': total_weight})

        return JsonResponse(data, safe=False)

    # tim kiem cac phieu can theo nam thang
    def count_weight_Month_Year(self, request, year, month, type):
        start_date = datetime(year, month, 1)

        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)
        end_date -= timedelta(days=1)

        if type == 1:
            weight_list = Weight.objects.filter(date_time__gte=start_date, date_time__lt=end_date, Trantype="Nhập hàng")
            sum_weight = Weight.objects.filter(date_time__year=year, date_time__month=month, Trantype="Nhập hàng").aggregate(total_weight=Sum('Netweight'))['total_weight']
        elif type == 2:
            weight_list = Weight.objects.filter(date_time__gte=start_date, date_time__lt=end_date, Trantype="Xuất hàng")
            sum_weight = Weight.objects.filter(date_time__year=year, date_time__month=month, Trantype="Xuất hàng").aggregate(total_weight=Sum('Netweight'))['total_weight']
        else:
            weight_list = Weight.objects.filter(date_time__gte=start_date, date_time__lt=end_date)
            sum_weight = Weight.objects.filter(date_time__year=year, date_time__month=month).aggregate(total_weight=Sum('Netweight'))['total_weight']

        TongHang = sum_weight or 0

        data = {
            "ThangTimKiem": month,
            "TongHang": TongHang,
            "TongSoPhieu": len(weight_list),
            "PhieuCan": []
        }

        for index, weight in enumerate(weight_list, start=1):
            weight_data = {
                "STT": index,
                "key": weight.id,
                "MaPhieu": weight.Ticketnum,
                "TLHang": weight.Netweight,
                "NgayTaoPhieu": weight.date_time,
            }
            data["PhieuCan"].append({"phieuCan": weight_data})

        return JsonResponse(data, safe=False)

    # tim kiem cac phieu can tu ngay den ngay hien tai
    def count_weight_For_Time(self, request, time, type):
        today = datetime.now().date()
        start_date = today - timedelta(days=time)
        end_date = today

        if type == 1:
            weight_list = Weight.objects.filter(date_time__date__gte=start_date, date_time__date__lte=end_date,
                                                Trantype="Nhập hàng").all()
            sum_TLHang = Weight.objects.filter(date_time__date__gte=start_date, date_time__date__lte=end_date,
                                               Trantype="Nhập hàng").aggregate(sum=Sum('Netweight'))['sum']
        elif type == 2:
            weight_list = Weight.objects.filter(date_time__date__gte=start_date, date_time__date__lte=end_date,
                                                Trantype="Xuất hàng").all()
            sum_TLHang = Weight.objects.filter(date_time__date__gte=start_date, date_time__date__lte=end_date,
                                               Trantype="Xuất hàng").aggregate(sum=Sum('Netweight'))['sum']
        else:
            weight_list = Weight.objects.filter(date_time__date__gte=start_date, date_time__date__lte=end_date).all()
            sum_TLHang = Weight.objects.filter(date_time__date__gte=start_date, date_time__date__lte=end_date).aggregate(
                sum=Sum('Netweight'))['sum']

        if sum_TLHang is None:
            sum_TLHang = 0

        data = {
            "NgayTimKiem": {
                "start": start_date,
                "end": end_date
            },
            "TongHang": sum_TLHang,
            "TongSoPhieu": len(weight_list),
            "PhieuCan": []
        }

        for index, weight in enumerate(weight_list, start=1):
            weight_data = {
                "STT": index,
                "key": weight.id,
                "MaPhieu": weight.Ticketnum,
                "TLHang": weight.Netweight,
                "NgayTaoPhieu": weight.date_time,
            }
            data["PhieuCan"].append({"phieuCan": weight_data})

        return JsonResponse(data, safe=False)

    # tim kiem theo loai phieu
    def count_weight_category(self, request, num):
        if num == 1:
            weight_list = Weight.objects.filter(Trantype__iexact='Nhập hàng'.title())
            sum_TLHang = Weight.objects.filter(Trantype__iexact='Nhập hàng'.title()).aggregate(sum=Sum('Netweight'))['sum']
            category = 'Nhập hàng'
        else:
            weight_list = Weight.objects.filter(Trantype__iexact='Xuất hàng'.title())
            sum_TLHang = Weight.objects.filter(Trantype__iexact='Xuất hàng'.title()).aggregate(sum=Sum('Netweight'))['sum']
            category = 'Xuất hàng'

        data = {
            "LoaiPhieuCan": category,
            "TongHang": sum_TLHang,
            "TongSoPhieu": len(weight_list),
            "PhieuCan": []
        }

        for index, weight in enumerate(weight_list, start=1):
            weight_data = {
                "STT": index,
                "key": weight.id,
                "MaPhieu": weight.Ticketnum,
                "TLHang": weight.Netweight,
                "NgayTaoPhieu": weight.date_time
            }
            data["PhieuCan"].append({"phieuCan": weight_data})

        return JsonResponse(data, safe=False)

    # tim kiem tu ngay den ngay
    def count_weight_from_time(self, request, yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, type):
        start_date = datetime(yearFrom, monthFrom, dayFrom).date()
        end_date = datetime(yearTo, monthTo, dayTo).date()

        if type == 1:
            weight_list = Weight.objects.filter(date_time__date__gte=start_date, date_time__date__lte=end_date,
                                                Trantype="Nhập hàng").all()
            sum_TLHang = Weight.objects.filter(date_time__date__gte=start_date, date_time__date__lte=end_date,
                                               Trantype="Nhập hàng").aggregate(sum=Sum('Netweight'))['sum']
        elif type == 2:
            weight_list = Weight.objects.filter(date_time__date__gte=start_date, date_time__date__lte=end_date,
                                                Trantype="Xuất hàng").all()
            sum_TLHang = Weight.objects.filter(date_time__date__gte=start_date, date_time__date__lte=end_date,
                                               Trantype="Xuất hàng").aggregate(sum=Sum('Netweight'))['sum']
        else:
            weight_list = Weight.objects.filter(date_time__date__gte=start_date, date_time__date__lte=end_date).all()
            sum_TLHang = Weight.objects.filter(date_time__date__gte=start_date, date_time__date__lte=end_date).aggregate(
                sum=Sum('Netweight'))['sum']

        data = {
            "TuNgay": start_date,
            "DenNgay": end_date,
            "TongSoPhieu": len(weight_list),
            "TongHang": sum_TLHang,
            "PhieuCan": []
        }

        for index, weight in enumerate(weight_list, start=1):
            weight_data = {
                "STT": index,
                "key": weight.id,
                "MaPhieu": weight.Ticketnum,
                "TLHang": weight.Netweight,
                "NgayTaoPhieu": weight.date_time,
            }
            data["PhieuCan"].append({"phieuCan": weight_data})

        return JsonResponse(data, safe=False)
