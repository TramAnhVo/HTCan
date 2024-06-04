import calendar

import pytz
from django.shortcuts import render
from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser
from rest_framework.views import Response
from django.http import JsonResponse, HttpResponseRedirect
from datetime import date, timedelta, datetime
from django.db.models import Sum, Count
from django.utils import timezone
from django.db.models.functions import ExtractWeek, TruncDate

from . import serializers
from .models import PhieuCan, ThongTinCan, User


class PhieuCanView(viewsets.ViewSet,
                   generics.ListAPIView,
                   generics.RetrieveAPIView):
    queryset = PhieuCan.objects.all()
    serializer_class = serializers.PhieuCanSerializer

    # thong ke ngay hien tai theo tung can
    def count_PhieuCan(seft, request, canId):
        today = timezone.now().astimezone(pytz.timezone('Asia/Ho_Chi_Minh')).date()
        count_PhieuCan = PhieuCan.objects.filter(NgayTao__year=today.year, NgayTao__month=today.month,
                                                 NgayTao__day=today.day, CanId_id=canId).count()

        sum_TLHang = PhieuCan.objects.filter(NgayTao__year=today.year, NgayTao__month=today.month,
                                             NgayTao__day=today.day, CanId_id=canId).aggregate(sum=Sum('TLHang'))['sum']
        data = {'count': count_PhieuCan,
                'TLHang': sum_TLHang}
        return JsonResponse(data)

    #  thong ke theo thang theo tat ca can
    def count_PhieuCan_by_month(self, request, canId):
        current_year = datetime.now().year
        data = []
        for month in range(1, 13):
            result = PhieuCan.objects.filter(NgayTao__year=current_year, NgayTao__month=month, CanId_id=canId).aggregate(
                count=Count('id'))
            result1 = PhieuCan.objects.filter(NgayTao__year=current_year, NgayTao__month=month, CanId_id=canId).aggregate(
                total_weight=Sum('TLHang'))['total_weight']
            result2 = PhieuCan.objects.filter(NgayTao__year=current_year, NgayTao__month=month, CanId_id=canId).aggregate(total=Sum('TLTong'))[
                'total']
            count = result['count'] or 0
            total_weight = result1 or 0
            total = result2 or 0
            data.append({'month': month, 'count': count, 'sum': total_weight, 'total': total})

        return JsonResponse(data, safe=False)

    #  thong ke theo tuan so luong cac phieu can cua tat ca can
    def count_PhieuCan_by_week(self, request):
        # Lấy thời gian hiện tại
        now = timezone.now()

        # Lấy năm hiện tại
        current_year = now.year

        # Tạo danh sách các tháng từ tháng 1 đến tháng 12 của năm hiện tại
        months = []
        for month in range(1, 13):
            # Kiểm tra giá trị tháng có hợp lệ
            if calendar.isleap(current_year) and month == 2:
                days_in_month = 29
            else:
                days_in_month = calendar.monthrange(current_year, month)[1]

            start_of_month = now.replace(year=current_year, month=month, day=1, hour=0, minute=0, second=0,
                                         microsecond=0)
            end_of_month = now.replace(year=current_year, month=month, day=days_in_month, hour=23, minute=59, second=59,
                                       microsecond=999999)
            months.append((start_of_month, end_of_month))

        # Tạo đối tượng data chứa kết quả
        data = {'results': []}

        # Thống kê số lượng phiếu cân trong từng tuần của từng tháng
        for start_date, end_date in months:
            # Tạo danh sách các tuần trong tháng
            weeks = []
            start_week = start_date
            while start_week <= end_date:
                if start_week.weekday() == 0:  # 0 là thứ Hai
                    end_week = start_week + timedelta(days=6)  # Thêm 6 ngày để kết thúc vào Chủ Nhật
                    weeks.append((start_week, end_week))
                start_week += timedelta(days=1)

            # Thực hiện truy vấn để thống kê số lượng phiếu cân trong từng tuần
            results = []
            for start_week, end_week in weeks:
                count = PhieuCan.objects.filter(NgayTao__range=(start_week, end_week)).count()
                results.append((start_week, end_week, count))

            # Thêm kết quả của tháng vào đối tượng data
            data['results'].append({
                'month': start_date.strftime('%Y-%m'),
                'weeks': results
            })

        return JsonResponse(data, safe=False)

    #  truy van du lieu so phieu tung ngay trong tuan ( thu 2, thu 3,...) cua tat ca can
    def count_PhieuCan_day_of_week(self, request, canId):
        # Tính ngày đầu tuần (thứ 2)
        today = datetime.now().date()
        start_of_week = today - timedelta(days=today.weekday())

        # Tạo danh sách chứa tất cả các ngày trong tuần
        all_days = [start_of_week + timedelta(days=i) for i in range(7)]

        # Truy vấn tổng số phiếu từng ngày từ thứ 2 đến chủ nhật trong tuần
        result = PhieuCan.objects.filter(NgayTao__gte=start_of_week, CanId_id=canId).values('NgayTao__date').annotate(count=Count('id'))
        result1 = PhieuCan.objects.filter(NgayTao__gte=start_of_week, CanId_id=canId).values('NgayTao__date').annotate(total_weight=Sum('TLHang'))

        # Tạo một từ điển để lưu trữ số phiếu theo ngày
        count_by_date = {item['NgayTao__date']: item['count'] for item in result}
        sum_by_date = {item['NgayTao__date']: item['total_weight'] for item in result1}

        # Chuẩn bị dữ liệu để truyền vào template
        data = []
        for day in all_days:
            ngay = day
            count = count_by_date.get(day, 0)
            total_weight = sum_by_date.get(day, 0)
            data.append({'ngay': ngay, 'count': count, 'total_weight': total_weight})

        return JsonResponse(data, safe=False)

    #  tim kiem theo 1 ngay cu the
    def count_PhieuCan_of_day(self, request, year, month, day):
        ngay_can = datetime(year, month, day).date()

        phieucan_list = PhieuCan.objects.filter(NgayTao__date=ngay_can).all()

        sum_TLHang = PhieuCan.objects.filter(NgayTao__date=ngay_can).aggregate(sum=Sum('TLHang'))['sum']

        if sum_TLHang is None:
            sum_TLHang = 0

        data = {
            "NgayTimKiem": ngay_can,
            "TongHang": sum_TLHang,
            "TongSoPhieu": len(phieucan_list),
            "PhieuCan": []
        }

        for index, phieucan in enumerate(phieucan_list, start=1):
            phieucan_data = {
                "STT": index,
                "MaPhieu": phieucan.MaPhieu,
                "TLTong": phieucan.TLTong,
                "TLBi": phieucan.TLBi,
                "TLHang": phieucan.TLHang,
                "NgayTao": phieucan.NgayTao,
                "Can": {
                    "name": phieucan.CanId.TenCan,
                }
            }
            data["PhieuCan"].append({"phieuCan": phieucan_data})

        return JsonResponse(data, safe=False)

    # tim kiem theo ten cua phieu can
    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(MaPhieu__icontains=q)

        return queries

    # tim kiem theo thang nao nam nao
    def count_PhieuCan_Month_Year(self, request, year, month):
        start_date = datetime(2024, 5, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)
        end_date -= timedelta(days=1)

        phieucan_list = PhieuCan.objects.filter(NgayTao__gte=start_date, NgayTao__lt=end_date)

        sum_TLHang = PhieuCan.objects.filter(NgayTao__year=year, NgayTao__month=month).aggregate(
                total_weight=Sum('TLHang'))['total_weight']

        TongHang = sum_TLHang or 0

        data = {
            "ThangTimKiem": month,
            "TongHang": TongHang,
            "TongSoPhieu": len(phieucan_list),
            "PhieuCan": []
        }

        for index, phieucan in enumerate(phieucan_list, start=1):
            phieucan_data = {
                "STT": index,
                "MaPhieu": phieucan.MaPhieu,
                "TLTong": phieucan.TLTong,
                "TLBi": phieucan.TLBi,
                "TLHang": phieucan.TLHang,
                "NgayTao": phieucan.NgayTao,
                "Can": {
                    "name": phieucan.CanId.TenCan,
                }
            }
            data["PhieuCan"].append({"phieuCan": phieucan_data})

        return JsonResponse(data, safe=False)

    # tim kiem theo moc thoi gian ( ngay hom qua, 2 ngay truoc,...)
    def count_PhieuCan_For_Time(self, request, time):
        today = datetime.now().date()
        yesterday = today - timedelta(days=time)

        phieucan_list = PhieuCan.objects.filter(NgayTao__date=yesterday).all()
        sum_TLHang = PhieuCan.objects.filter(NgayTao__date=yesterday).aggregate(sum=Sum('TLHang'))['sum']

        if sum_TLHang is None:
            sum_TLHang = 0

        data = {
            "NgayTimKiem":yesterday,
            "TongHang": sum_TLHang,
            "TongSoPhieu": len(phieucan_list),
            "PhieuCan": []
        }

        for index, phieucan in enumerate(phieucan_list, start=1):
            phieucan_data = {
                "STT": index,
                "MaPhieu": phieucan.MaPhieu,
                "TLTong": phieucan.TLTong,
                "TLBi": phieucan.TLBi,
                "TLHang": phieucan.TLHang,
                "NgayTao": phieucan.NgayTao,
                "Can": {
                    "name": phieucan.CanId.TenCan,
                }
            }
            data["PhieuCan"].append({"phieuCan": phieucan_data})

        return JsonResponse(data, safe=False)


class CanView(viewsets.ViewSet,
              generics.ListAPIView,
              generics.RetrieveAPIView):
    queryset = ThongTinCan.objects.all()
    serializer_class = serializers.CanSerializer

    # danh sach phieu can cua mot can
    @action(methods=['get'], detail=True)
    def weight_lists(self, request, pk):
        today = datetime.now().date()
        scales = self.get_object().phieucan_set.all().filter(NgayTao__date=today)

        return Response(serializers.PhieuCanSerializer(scales, many=True, context={'request': request}).data,
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
        users = self.get_object().thongtincan_set.all()

        return Response(serializers.CanSerializer(users, many=True, context={'request': request}).data,
                        status=status.HTTP_200_OK)
