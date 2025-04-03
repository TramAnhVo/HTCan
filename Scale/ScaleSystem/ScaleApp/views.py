from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import JSONParser
from rest_framework.views import Response
from django.http import JsonResponse, HttpResponseRedirect
from datetime import date, timedelta, datetime
from django.db.models import Sum, Count, Case, When, F, Q

from . import serializers
from .models import User, Scale, Weight, Image
from django.shortcuts import render


def home(request):
    return render(request, 'layout/home.html')


class ImageView(viewsets.ViewSet,
                generics.ListAPIView):
    queryset = Image.objects.all()
    serializer_class = serializers.ImageSerializer


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

    # kiem tra ten dang nhap
    def check_username(self, request):
        username = request.data.get('username')
        if User.objects.filter(username=username).exists():
            return Response({'exists': True}, status=status.HTTP_200_OK)
        return Response({'exists': False}, status=status.HTTP_200_OK)


class WeightView(viewsets.ViewSet,
                 generics.CreateAPIView,
                 generics.UpdateAPIView,
                 # generics.DestroyAPIView,
                 generics.ListAPIView,
                 generics.RetrieveAPIView):
    queryset = Weight.objects.all()
    serializer_class = serializers.WeightSerializer

    def create(self, request, *args, **kwargs):
        ticket_num = request.data.get('Ticketnum')
        date_in = request.data.get('Date_in')  # Lấy giá trị ngày tháng từ request
        date_out = request.data.get('Date_out')
        tim_in = request.data.get('time_in')
        tim_out = request.data.get('time_out')

        if not ticket_num:
            return Response({"error": "Mã phiếu bị rỗng!"}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra và tạo mới nếu chưa có, đồng thời thiết lập giá trị mặc định
        ticket, created = Weight.objects.get_or_create(
            Ticketnum=ticket_num,
            defaults={
                "Date_in": date_in,
                "Date_out": date_out,
                "time_in": tim_in,
                "time_out":tim_out}  # Chỉ thiết lập nếu bản ghi được tạo mới
        )

        serializer = self.get_serializer(ticket, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def weight_user(self, request, canId):
        weight_list = Weight.objects.filter(CanId_id=canId).all()
        serializer = serializers.WeightSerializer(weight_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    #  tim kiem theo 1 ngay cu the
    def count_weight_of_day(self, request, year, month, day, canId):
        date_weight = datetime(year, month, day).date()

        weight_list = Weight.objects.filter(date_time__date=date_weight, CanId_id=canId).all()

        data = []
        for weight in weight_list:
            data.append({
                "key": weight.id,
                "Ticketnum": weight.Ticketnum,
                "Docnum": weight.Docnum,
                "Truckno": weight.Truckno,
                "Date_in": weight.Date_in,
                "Date_out": weight.Date_out,

                "Firstweight": weight.Firstweight,
                "Secondweight": weight.Secondweight,
                "Netweight": weight.Netweight,
                "Trantype": weight.Trantype,

                "ProdCode": weight.ProdCode,
                "ProdName": weight.ProdName,
                "CustCode": weight.CustCode,
                "CustName": weight.CustName,

                "time_in": weight.time_in,
                "time_out": weight.time_out,
                "date_time": weight.date_time,
                "TenCan": weight.TenCan,
                "Note": weight.Note
            })

        return JsonResponse(data, safe=False)

    #  thong ke theo thang theo tung can
    def count_weight_by_month(self, request, canId):
        current_year = datetime.now().year
        data = []
        for month in range(1, 13):
            count = Weight.objects.filter(date_time__year=current_year, date_time__month=month, CanId_id=canId).all()
            sum = Weight.objects.filter(date_time__year=current_year, date_time__month=month, CanId_id=canId).aggregate(
                total_weight=Sum('Netweight'))['total_weight']

            if sum is None: sum = 0

            data.append({
                'month': month,
                'count': len(count),
                'sum': sum
            })

        return JsonResponse(data, safe=False)

    # chi tiet phieu can trong 1 thang
    def weight_detail_month(self, request, month, canId):
        current_year = datetime.now().year
        weight_list = Weight.objects.filter(date_time__year=current_year, date_time__month=month, CanId_id=canId)

        data = []
        for index, weight in enumerate(weight_list, start=1):
            weight_data = {
                "STT": index,
                "key": weight.id,
                "Ticketnum": weight.Ticketnum,
                "Docnum": weight.Docnum,
                "Truckno": weight.Truckno,
                "Date_in": weight.Date_in,
                "Date_out": weight.Date_out,

                "Firstweight": weight.Firstweight,
                "Secondweight": weight.Secondweight,
                "Netweight": weight.Netweight,
                "Trantype": weight.Trantype,

                "ProdCode": weight.ProdCode,
                "ProdName": weight.ProdName,
                "CustCode": weight.CustCode,
                "CustName": weight.CustName,

                "time_in": weight.time_in,
                "time_out": weight.time_out,
                "date_time": weight.date_time,
                "TenCan": weight.TenCan,
                "Note": weight.Note
            }
            data.append(weight_data)

        return JsonResponse(data, safe=False)

    # thong ke phieu can theo nam
    def weight_detail_year(self, request, year, canId):
        weight_list = Weight.objects.filter(date_time__year=year, CanId_id=canId)

        data = []
        for index, weight in enumerate(weight_list, start=1):
            weight_data = {
                "STT": index,
                "key": weight.id,
                "Ticketnum": weight.Ticketnum,
                "Docnum": weight.Docnum,
                "Truckno": weight.Truckno,
                "Date_in": weight.Date_in,
                "Date_out": weight.Date_out,

                "Firstweight": weight.Firstweight,
                "Secondweight": weight.Secondweight,
                "Netweight": weight.Netweight,
                "Trantype": weight.Trantype,

                "ProdCode": weight.ProdCode,
                "ProdName": weight.ProdName,
                "CustCode": weight.CustCode,
                "CustName": weight.CustName,

                "time_in": weight.time_in,
                "time_out": weight.time_out,
                "date_time": weight.date_time,
                "TenCan": weight.TenCan,
                "Note": weight.Note
            }
            data.append(weight_data)
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
                "NgayTaoPhieu": weight.date_time,
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
        result = Weight.objects.filter(date_time__gte=start_of_week, CanId_id=canId).values('date_time__date').annotate(
            count=Count('id'))
        result1 = Weight.objects.filter(date_time__gte=start_of_week, CanId_id=canId).values(
            'date_time__date').annotate(total_weight=Sum('Netweight'))

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

    # tim kiem tu ngay den ngay
    def count_weight_from_time(self, request, yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, canId):
        start_date = datetime(yearFrom, monthFrom, dayFrom).date()
        end_date = datetime(yearTo, monthTo, dayTo).date()

        weight_list = Weight.objects.filter(date_time__date__range=(start_date, end_date), CanId_id=canId)

        data = []

        for index, weight in enumerate(weight_list, start=1):
            weight_data = {
                "STT": index,
                "key": weight.id,
                "Ticketnum": weight.Ticketnum,
                "Docnum": weight.Docnum,
                "Truckno": weight.Truckno,
                "Date_in": weight.Date_in,
                "Date_out": weight.Date_out,

                "Firstweight": weight.Firstweight,
                "Secondweight": weight.Secondweight,
                "Netweight": weight.Netweight,
                "Trantype": weight.Trantype,

                "ProdCode": weight.ProdCode,
                "ProdName": weight.ProdName,
                "CustCode": weight.CustCode,
                "CustName": weight.CustName,

                "time_in": weight.time_in,
                "time_out": weight.time_out,
                "date_time": weight.date_time,
                "TenCan": weight.TenCan,
                "Note": weight.Note
            }
            data.append(weight_data)

        return JsonResponse(data, safe=False)

    # bao cao thong ke tong quat theo thang
    def general_month(self, request, month, canId):
        current_year = datetime.now().year
        count_weight = \
            Weight.objects.filter(date_time__year=current_year, date_time__month=month, CanId_id=canId).aggregate(
                count_weight=Count('Ticketnum'))['count_weight']
        total_weight = \
            Weight.objects.filter(date_time__year=current_year, date_time__month=month, CanId_id=canId).aggregate(
                total_weight=Sum('Netweight'))['total_weight']

        count_in_weight = Weight.objects.filter(date_time__year=current_year, date_time__month=month,
                                                CanId_id=canId, Trantype='Nhập hàng').aggregate(
            count_in_weight=Count('Ticketnum'))['count_in_weight']

        total_in = Weight.objects.filter(date_time__year=current_year, date_time__month=month, CanId_id=canId,
                                         Trantype='Nhập hàng').aggregate(total_in=Sum('Netweight'))['total_in']

        count_out_weight = Weight.objects.filter(date_time__year=current_year, date_time__month=month,
                                                 CanId_id=canId, Trantype='Xuất hàng').aggregate(
            count_out_weight=Count('Ticketnum'))['count_out_weight']

        total_out = Weight.objects.filter(date_time__year=current_year, date_time__month=month, CanId_id=canId,
                                          Trantype='Xuất hàng').aggregate(total_out=Sum('Netweight'))['total_out']

        report_data = {
            "Month": month,
            "CountWeight": count_weight,
            "TotalWeight": total_weight,
            "CountIn": count_in_weight,
            "TotalIn": total_in,
            "CountOut": count_out_weight,
            "TotalOut": total_out,
            "days": []
        }

        weights = Weight.objects.filter(date_time__month=month, CanId_id=canId).values(
            "Date_in",
            "CustCode",
            "CustName",
            "ProdCode",
            "ProdName",
            "Netweight",
            "Trantype"
        ).order_by("Date_in")

        current_date = None
        current_day = None

        for weight in weights:
            date = weight["Date_in"]
            cust_code = weight["CustCode"]
            cust_name = weight["CustName"]
            prod_code = weight["ProdCode"]
            prod_name = weight["ProdName"]
            total_weight = weight["Netweight"]
            total_records = 1
            total_import = 1 if weight["Trantype"] == "Nhập hàng" else 0
            total_import_weight = total_weight if weight["Trantype"] == "Nhập hàng" else 0
            total_export = 1 if weight["Trantype"] == "Xuất hàng" else 0
            total_export_weight = total_weight if weight["Trantype"] == "Xuất hàng" else 0

            if current_date != date:
                current_date = date

                total_records_day = Weight.objects.filter(Date_in=date.strftime('%Y-%m-%d'), CanId_id=canId).aggregate(
                    total_records_day=Count("*"))
                total_weight_day = Weight.objects.filter(Date_in=date.strftime('%Y-%m-%d'), CanId_id=canId).aggregate(
                    total_weight_day=Sum("Netweight"))

                count_in_day = Weight.objects.filter(Date_in=date.strftime('%Y-%m-%d'), CanId_id=canId,
                                                     Trantype='Nhập hàng').aggregate(count_in_day=Count("*"))
                count_out_day = Weight.objects.filter(Date_in=date.strftime('%Y-%m-%d'), CanId_id=canId,
                                                      Trantype='Xuất hàng').aggregate(count_out_day=Count("*"))

                total_in = Weight.objects.filter(Date_in=date.strftime('%Y-%m-%d'), CanId_id=canId,
                                                 Trantype='Nhập hàng').aggregate(total_in=Sum("Netweight"))
                total_out = Weight.objects.filter(Date_in=date.strftime('%Y-%m-%d'), CanId_id=canId,
                                                  Trantype='Xuất hàng').aggregate(total_out=Sum("Netweight"))

                current_day = {
                    "code": date.strftime('%Y-%m-%d'),
                    "total": total_weight_day["total_weight_day"],
                    "count": total_records_day["total_records_day"],
                    "phieuNhap": count_in_day["count_in_day"],
                    "phieuXuat": count_out_day["count_out_day"],
                    "totalOut": total_out["total_out"],
                    "totalIn": total_in["total_in"],
                    "customerGroups": []
                }
                report_data["days"].append(current_day)

            customerGroups_found = False
            for customerGroups in current_day["customerGroups"]:
                if customerGroups["CustCode"] == cust_code:
                    customerGroups["count"] += total_records
                    customerGroups["sum"] += total_weight
                    customerGroups["phieuNhap"] += total_import
                    customerGroups["phieuXuat"] += total_export
                    customerGroups["totalIn"] += total_import_weight
                    customerGroups["totalOut"] += total_export_weight
                    customerGroups_found = True
                    break

            if not customerGroups_found:
                customerGroups = {
                    "CustCode": cust_code,
                    "name": cust_name,
                    "count": total_records,
                    "sum": total_weight,
                    "phieuNhap": total_import,
                    "phieuXuat": total_export,
                    "totalIn": total_import_weight,
                    "totalOut": total_export_weight,
                    "productGroups": []
                }
                current_day["customerGroups"].append(customerGroups)

            productGroups_found = False
            for productGroups in customerGroups["productGroups"]:
                if productGroups["ProdCode"] == prod_code:
                    productGroups["sum"] += total_weight
                    productGroups["count"] += total_records
                    productGroups["phieuNhap"] += total_import
                    productGroups["totalIn"] += total_import_weight
                    productGroups["phieuXuat"] += total_export
                    productGroups["totalOut"] += total_export_weight
                    productGroups_found = True
                    break

            if not productGroups_found:
                productGroups = {
                    "ProdCode": prod_code,
                    "name": prod_name,
                    "sum": total_weight,
                    "count": total_records,
                    "phieuNhap": total_import,
                    "totalIn": total_import_weight,
                    "phieuXuat": total_export,
                    "totalOut": total_export_weight
                }
                customerGroups["productGroups"].append(productGroups)

        return JsonResponse(report_data)

    # bao cao thong ke tong quat theo tuan
    def general_week(self, request, canId):
        data = []
        # Lấy ngày bắt đầu và kết thúc của tuần hiện tại
        today = datetime.now()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)

        count_weight = Weight.objects.filter(Date_in__gte=start_of_week.date(), Date_in__lte=end_of_week.date(),
                                             CanId_id=canId).aggregate(count_weight=Count('Ticketnum'))['count_weight']

        total_weight = Weight.objects.filter(Date_in__gte=start_of_week.date(), Date_in__lte=end_of_week.date(),
                                             CanId_id=canId).aggregate(total_weight=Sum('Netweight'))['total_weight']

        count_out = Weight.objects.filter(Date_in__gte=start_of_week.date(), Date_in__lte=end_of_week.date(),
                                          CanId_id=canId, Trantype='Xuất hàng').aggregate(count_out=Count('Ticketnum'))[
            'count_out']
        total_out = Weight.objects.filter(Date_in__gte=start_of_week.date(), Date_in__lte=end_of_week.date(),
                                          CanId_id=canId, Trantype='Xuất hàng').aggregate(total_out=Sum('Netweight'))[
            'total_out']

        count_in = Weight.objects.filter(Date_in__gte=start_of_week.date(), Date_in__lte=end_of_week.date(),
                                         CanId_id=canId, Trantype='Nhập hàng').aggregate(count_in=Count('Ticketnum'))[
            'count_in']
        total_in = Weight.objects.filter(Date_in__gte=start_of_week.date(), Date_in__lte=end_of_week.date(),
                                         CanId_id=canId, Trantype='Nhập hàng').aggregate(total_in=Sum('Netweight'))[
            'total_in']

        report_data = {
            "from": start_of_week.date(),
            "end": end_of_week.date(),
            "CountWeight": count_weight,
            "TotalWeight": total_weight,
            "count_out": count_out,
            'total_out': total_out,
            "count_in": count_in,
            "total_in": total_in,
            "days": []
        }

        weights = Weight.objects.filter(Date_in__gte=start_of_week.date(), Date_in__lte=end_of_week.date(),
                                        CanId_id=canId) \
            .values(
            "Date_in",
            "CustCode",
            "CustName",
            "ProdCode",
            "ProdName",
            "Netweight",
            "Trantype"
        ).order_by("Date_in")

        current_date = None
        current_day = None

        for weight in weights:
            date = weight["Date_in"]
            cust_code = weight["CustCode"]
            cust_name = weight["CustName"]
            prod_code = weight["ProdCode"]
            prod_name = weight["ProdName"]
            total_weight = weight["Netweight"]
            total_records = 1

            total_import = 1 if weight["Trantype"] == "Nhập hàng" else 0
            total_import_weight = total_weight if weight["Trantype"] == "Nhập hàng" else 0

            total_export = 1 if weight["Trantype"] == "Xuất hàng" else 0
            total_export_weight = total_weight if weight["Trantype"] == "Xuất hàng" else 0

            if current_date != date:
                current_date = date

                total_records_day = Weight.objects.filter(Date_in=date.strftime('%Y-%m-%d'), CanId_id=canId).aggregate(
                    total_records_day=Count("*"))

                total_weight_day = Weight.objects.filter(Date_in=date.strftime('%Y-%m-%d'), CanId_id=canId).aggregate(
                    total_weight_day=Sum("Netweight"))

                count_in_day = Weight.objects.filter(Date_in=date.strftime('%Y-%m-%d'), CanId_id=canId,
                                                     Trantype='Nhập hàng').aggregate(count_in_day=Count("*"))

                count_out_day = Weight.objects.filter(Date_in=date.strftime('%Y-%m-%d'), CanId_id=canId,
                                                      Trantype='Xuất hàng').aggregate(count_out_day=Count("*"))

                current_day = {
                    "Date": date.strftime('%Y-%m-%d'),
                    "total_day": total_weight_day["total_weight_day"],
                    "count_day": total_records_day["total_records_day"],
                    "count_in": count_in_day["count_in_day"],
                    "count_out": count_out_day["count_out_day"],
                    "customers": []
                }
                report_data["days"].append(current_day)

            customer_found = False
            for customer in current_day["customers"]:
                if customer["CustCode"] == cust_code:
                    customer["count"] += total_records
                    customer["sum"] += total_weight
                    customer["count_in"] += total_import
                    customer["count_out"] += total_export
                    customer_found = True
                    break

            if not customer_found:
                customer = {
                    "CustCode": cust_code,
                    "CustName": cust_name,
                    "count": total_records,
                    "sum": total_weight,
                    "count_in": total_import,
                    "count_out": total_export,
                    "products": []
                }
                current_day["customers"].append(customer)

            product_found = False
            for product in customer["products"]:
                if product["ProdCode"] == prod_code:
                    product["total_weight"] += total_weight
                    product["total_records"] += total_records
                    product["total_import"] += total_import
                    product["total_import_weight"] += total_import_weight
                    product["total_export"] += total_export
                    product["total_export_weight"] += total_export_weight
                    product_found = True
                    break

            if not product_found:
                product = {
                    "ProdCode": prod_code,
                    "ProdName": prod_name,
                    "total_weight": total_weight,
                    "total_records": total_records,
                    "total_import": total_import,
                    "total_import_weight": total_import_weight,
                    "total_export": total_export,
                    "total_export_weight": total_export_weight
                }
                customer["products"].append(product)

        return JsonResponse(report_data)

    # bao cao thong ke tu ngay den ngay
    def general_from_date(self, request, yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, canId):
        data = []
        start_of_week = datetime(yearFrom, monthFrom, dayFrom)
        end_of_week = datetime(yearTo, monthTo, dayTo)

        count_weight = Weight.objects.filter(Date_in__gte=start_of_week.date(), Date_in__lte=end_of_week.date(),
                                             CanId_id=canId).aggregate(count_weight=Count('Ticketnum'))['count_weight']

        total_weight = Weight.objects.filter(Date_in__gte=start_of_week.date(), Date_in__lte=end_of_week.date(),
                                             CanId_id=canId).aggregate(total_weight=Sum('Netweight'))['total_weight']

        count_out = Weight.objects.filter(Date_in__gte=start_of_week.date(), Date_in__lte=end_of_week.date(),
                                          CanId_id=canId, Trantype='Xuất hàng').aggregate(count_out=Count('Ticketnum'))[
            'count_out']
        total_out = Weight.objects.filter(Date_in__gte=start_of_week.date(), Date_in__lte=end_of_week.date(),
                                          CanId_id=canId, Trantype='Xuất hàng').aggregate(total_out=Sum('Netweight'))[
            'total_out']

        count_in = Weight.objects.filter(Date_in__gte=start_of_week.date(), Date_in__lte=end_of_week.date(),
                                         CanId_id=canId, Trantype='Nhập hàng').aggregate(count_in=Count('Ticketnum'))[
            'count_in']
        total_in = Weight.objects.filter(Date_in__gte=start_of_week.date(), Date_in__lte=end_of_week.date(),
                                         CanId_id=canId, Trantype='Nhập hàng').aggregate(total_in=Sum('Netweight'))[
            'total_in']

        report_data = {
            "from": start_of_week.date(),
            "end": end_of_week.date(),
            "CountWeight": count_weight,
            "TotalWeight": total_weight,
            "count_out": count_out,
            'total_out': total_out,
            "count_in": count_in,
            "total_in": total_in,
            "days": []
        }

        weights = Weight.objects.filter(Date_in__gte=start_of_week.date(), Date_in__lte=end_of_week.date(),
                                        CanId_id=canId) \
            .values(
            "Date_in",
            "CustCode",
            "CustName",
            "ProdCode",
            "ProdName",
            "Netweight",
            "Trantype"
        ).order_by("Date_in")

        current_date = None
        current_day = None

        for weight in weights:
            date = weight["Date_in"]
            cust_code = weight["CustCode"]
            cust_name = weight["CustName"]
            prod_code = weight["ProdCode"]
            prod_name = weight["ProdName"]
            total_weight = weight["Netweight"]
            total_records = 1

            total_import = 1 if weight["Trantype"] == "Nhập hàng" else 0
            total_import_weight = total_weight if weight["Trantype"] == "Nhập hàng" else 0

            total_export = 1 if weight["Trantype"] == "Xuất hàng" else 0
            total_export_weight = total_weight if weight["Trantype"] == "Xuất hàng" else 0

            if current_date != date:
                current_date = date

                total_records_day = Weight.objects.filter(Date_in=date.strftime('%Y-%m-%d'), CanId_id=canId).aggregate(
                    total_records_day=Count("*"))

                total_weight_day = Weight.objects.filter(Date_in=date.strftime('%Y-%m-%d'), CanId_id=canId).aggregate(
                    total_weight_day=Sum("Netweight"))

                count_in_day = Weight.objects.filter(Date_in=date.strftime('%Y-%m-%d'), CanId_id=canId,
                                                     Trantype='Nhập hàng').aggregate(count_in_day=Count("*"))

                count_out_day = Weight.objects.filter(Date_in=date.strftime('%Y-%m-%d'), CanId_id=canId,
                                                      Trantype='Xuất hàng').aggregate(count_out_day=Count("*"))

                current_day = {
                    "code": date.strftime('%Y-%m-%d'),
                    "total_day": total_weight_day["total_weight_day"],
                    "count_day": total_records_day["total_records_day"],
                    "count_in": count_in_day["count_in_day"],
                    "count_out": count_out_day["count_out_day"],
                    "customers": []
                }
                report_data["days"].append(current_day)

            customer_found = False
            for customer in current_day["customers"]:
                if customer["CustCode"] == cust_code:
                    customer["count"] += total_records
                    customer["sum"] += total_weight
                    customer["count_in"] += total_import
                    customer["count_out"] += total_export
                    customer["total_in"] += total_import_weight
                    customer["total_out"] += total_export_weight
                    customer_found = True
                    break

            if not customer_found:
                customer = {
                    "CustCode": cust_code,
                    "CustName": cust_name,
                    "count": total_records,
                    "sum": total_weight,
                    "count_in": total_import,
                    "total_in": total_import_weight,
                    "count_out": total_export,
                    "total_out": total_export_weight,
                    "products": []
                }
                current_day["customers"].append(customer)

            product_found = False
            for product in customer["products"]:
                if product["ProdCode"] == prod_code:
                    product["total_weight"] += total_weight
                    product["total_records"] += total_records
                    product["total_import"] += total_import
                    product["total_import_weight"] += total_import_weight
                    product["total_export"] += total_export
                    product["total_export_weight"] += total_export_weight
                    product_found = True
                    break

            if not product_found:
                product = {
                    "ProdCode": prod_code,
                    "ProdName": prod_name,
                    "total_weight": total_weight,
                    "total_records": total_records,
                    "total_import": total_import,
                    "total_import_weight": total_import_weight,
                    "total_export": total_export,
                    "total_export_weight": total_export_weight
                }
                customer["products"].append(product)

        return JsonResponse(report_data)

    # bao cao thong ke theo ngay (sap xep theo tu nhom khach hang => nhom san pham)
    def general_day(self, request, year, month, day, canId):
        date_weight = datetime(year, month, day).date()

        count_weight = Weight.objects.filter(date_time__date=date_weight, CanId_id=canId).aggregate(
            count_weight=Count('Ticketnum'))['count_weight']

        total_weight = Weight.objects.filter(date_time__date=date_weight, CanId_id=canId).aggregate(
            total_weight=Sum('Netweight'))['total_weight']

        count_weight_out = \
        Weight.objects.filter(date_time__date=date_weight, CanId_id=canId, Trantype='Xuất hàng').aggregate(
            count_weight_out=Count('Ticketnum'))['count_weight_out']

        total_weight_out = \
        Weight.objects.filter(date_time__date=date_weight, CanId_id=canId, Trantype='Xuất hàng').aggregate(
            total_weight_out=Sum('Netweight'))['total_weight_out']

        count_weight_in = \
        Weight.objects.filter(date_time__date=date_weight, CanId_id=canId, Trantype='Nhập hàng').aggregate(
            count_weight_in=Count('Ticketnum'))['count_weight_in']

        total_weight_in = \
        Weight.objects.filter(date_time__date=date_weight, CanId_id=canId, Trantype='Nhập hàng').aggregate(
            total_weight_in=Sum('Netweight'))['total_weight_in']

        weights = Weight.objects.filter(date_time__date=date_weight, CanId_id=canId).values(
            "CustCode",
            "CustName",
            "ProdCode",
            "ProdName",
            "Netweight",
            "Trantype"
        ).order_by("CustCode", "ProdCode")

        # Gom nhóm và tính tổng các mã khách hàng giống nhau
        customer_data_list = []
        customer_dict = {}
        for weight in weights:
            cust_code = weight["CustCode"]
            cust_name = weight["CustName"]
            prod_code = weight["ProdCode"]
            prod_name = weight["ProdName"]
            net_weight = weight["Netweight"]
            trantype = weight["Trantype"]

            if cust_code in customer_dict:
                customer_data = customer_dict[cust_code]
            else:
                customer_data = {
                    "CustomerCode": cust_code,
                    "CustomerName": cust_name,
                    "TotalWeight": 0,
                    "TotalItems": 0,
                    "TotalOut": 0,
                    "CountOut": 0,
                    "TotalIn": 0,
                    "CountIn": 0,
                    "Products": []
                }
                customer_dict[cust_code] = customer_data
                customer_data_list.append(customer_data)

            customer_data["TotalWeight"] += net_weight
            customer_data["TotalItems"] += 1

            product_index = next((i for i, p in enumerate(customer_data["Products"]) if p["ProductCode"] == prod_code),
                                 None)
            if product_index is not None:
                customer_data["Products"][product_index]["TotalWeight"] += net_weight
                customer_data["Products"][product_index]["TotalItems"] += 1
            else:
                customer_data["Products"].append({
                    "ProductCode": prod_code,
                    "ProductName": prod_name,
                    "TotalWeight": net_weight,
                    "TotalItems": 1,
                    "TotalOut": 0,
                    "CountOut": 0,
                    "TotalIn": 0,
                    "CountIn": 0
                })

            if trantype == "Xuất hàng":
                customer_data["TotalOut"] += net_weight
                customer_data["CountOut"] += 1

                for product in customer_data["Products"]:
                    if product["ProductCode"] == prod_code:
                        product["CountOut"] += 1
                        product["TotalOut"] += net_weight
                        break
            elif trantype == "Nhập hàng":
                customer_data["TotalIn"] += net_weight
                customer_data["CountIn"] += 1

                for product in customer_data["Products"]:
                    if product["ProductCode"] == prod_code:
                        product["CountIn"] += 1
                        product["TotalIn"] += net_weight
                        break

        report_data = {
            "created_day": date_weight,
            "CountWeight": count_weight,
            "TotalWeight": total_weight,
            "count_out": count_weight_out,
            'total_out': total_weight_out,
            "count_in": count_weight_in,
            "total_in": total_weight_in,
            "customer": customer_data_list
        }

        return JsonResponse(report_data)

    # tim kiem phieu can theo ma khach hang
    def get_customer_weight(self, request, custCode, year, month, day, canId):
        date_weight = datetime(year, month, day).date()
        try:
            weight_tickets = Weight.objects.filter(date_time__date=date_weight, CanId_id=canId, CustCode=custCode)
            data = [
                {
                    'STT': index + 1,
                    "id": ticket.id,
                    'Ticketnum': ticket.Ticketnum,
                    "Docnum": ticket.Docnum,
                    "Truckno": ticket.Truckno,
                    "Date_in": ticket.Date_in,
                    "Date_out": ticket.Date_out,

                    "Firstweight": ticket.Firstweight,
                    "Secondweight": ticket.Secondweight,
                    'Netweight': ticket.Netweight,
                    "Trantype": ticket.Trantype,

                    'CustCode': ticket.CustCode,
                    'CustName': ticket.CustName,
                    'ProdCode': ticket.ProdCode,
                    'ProdName': ticket.ProdName,

                    "time_in": ticket.time_in,
                    "time_out": ticket.time_out,
                    'date_time': ticket.date_time,
                    'TenCan': ticket.TenCan,
                    "Note": ticket.Note,
                }
                for index, ticket in enumerate(weight_tickets)
            ]
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    # tim kiem phieu can theo ma hang hoa
    def get_product_weight(self, request, prodCode, year, month, day, canId):
        date_weight = datetime(year, month, day).date()
        try:
            weight_tickets = Weight.objects.filter(date_time__date=date_weight, CanId_id=canId, ProdCode=prodCode)
            data = [
                {
                    'STT': index + 1,
                    "id": ticket.id,
                    'Ticketnum': ticket.Ticketnum,
                    "Docnum": ticket.Docnum,
                    "Truckno": ticket.Truckno,
                    "Date_in": ticket.Date_in,
                    "Date_out": ticket.Date_out,

                    "Firstweight": ticket.Firstweight,
                    "Secondweight": ticket.Secondweight,
                    'Netweight': ticket.Netweight,
                    "Trantype": ticket.Trantype,

                    'CustCode': ticket.CustCode,
                    'CustName': ticket.CustName,
                    'ProdCode': ticket.ProdCode,
                    'ProdName': ticket.ProdName,

                    "time_in": ticket.time_in,
                    "time_out": ticket.time_out,
                    'date_time': ticket.date_time,
                    'TenCan': ticket.TenCan,
                    "Note": ticket.Note,
                }
                for index, ticket in enumerate(weight_tickets)
            ]
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
