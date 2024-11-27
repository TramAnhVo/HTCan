import cloudinary
import pytz
from django.utils.html import mark_safe
from django.contrib import admin
from django.utils.timezone import localtime, make_aware, get_current_timezone
from pytz import timezone
from django.http import HttpResponse
import openpyxl
from django import forms
from django.utils.translation import gettext_lazy as _
from datetime import datetime

from . import dao
from .models import User, Weight, Scale, Image


class CanDienTuAdmin(admin.AdminSite):
    site_header = 'HỆ THỐNG CÂN ĐIỆN TỬ'
    site_title = "HỆ THỐNG CÂN ĐIỆN TỬ"
    index_title = "HỆ THỐNG CÂN ĐIỆN TỬ"


admin_site = CanDienTuAdmin(name='myapp')


class UserAdmin(admin.ModelAdmin):
    search_fields = ['username']
    list_display = ['username', 'first_name',  'company','phone', 'NgayTao', 'is_active', 'is_staff', 'state']
    actions = ['activate_selected_accounts', 'lock_selected_accounts']
    list_per_page = 20

    def NgayTao(self, obj):
        vn_tz = timezone('Asia/Ho_Chi_Minh')
        vn_time = localtime(obj.date_joined).astimezone(vn_tz)
        return vn_time.strftime('%d-%m-%Y %H:%M:%S')

    def activate_selected_accounts(self, request, queryset):
        for user in queryset:
            dao.activate_or_lock_user(user.id, True)
        self.message_user(request, "Selected accounts have been activated successfully.")

    activate_selected_accounts.short_description = "Activate selected accounts"

    def lock_selected_accounts(self, request, queryset):
        for user in queryset:
            dao.activate_or_lock_user(user.id, False)
        self.message_user(request, "Selected accounts have been locked successfully.")

    lock_selected_accounts.short_description = "Lock selected accounts"

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user


class WeightUserFilter(admin.SimpleListFilter):
    title = _('User')  # Tiêu đề của bộ lọc
    parameter_name = '_user'  # Tham số truy vấn được sử dụng trong URL

    def lookups(self, request, model_admin):
        users = User.objects.filter(is_superuser = 0).all()  # Lấy danh sách tất cả người dùng
        return [(user.id, user.username) for user in users]

    def queryset(self, request, queryset):
        if self.value():
            user_id = self.value()
            return queryset.filter(CanId__UserId=user_id)


class WeightAdmin(admin.ModelAdmin):
    list_display = ['Ticketnum', 'Truckno', 'DateIn', 'DateOut', 'ProdName', 'CustName', 'Firstweight',
                    'Secondweight', 'Netweight', 'Trantype', 'TimeIn', 'TimeOut', 'CanId' ]
    list_filter = ['date_time', 'Trantype']
    search_fields = ['ProdName', 'CustName']
    readonly_fields = ['Netweight', 'DateIn', 'DateOut', 'TimeIn', 'TimeOut', 'NgayTao']
    list_per_page = 50
    change_list_template = [
        'admin/weight_change_list.html',
    ]

    def get_list_filter(self, request):
        # Nếu người dùng là superuser, thêm WeightUserFilter vào list_filter
        filters = list(super().get_list_filter(request))

        if request.user.is_superuser:
            filters.append(WeightUserFilter)

        # Lọc CanId cho user staff
        if request.user.is_staff and not request.user.is_superuser:
            can_ids = Scale.objects.filter(UserId_id=request.user.id)  # Lấy CanId mà user đã đăng ký
            filters.append(('CanId', admin.RelatedOnlyFieldListFilter))  # Chỉ hiển thị CanId đã đăng ký
        else:
            can_ids = Scale.objects.all()
            filters.append(('CanId'))

        return filters

    def get_queryset(self, request):
        qs = super().get_queryset(request)

        user_id = request.GET.get('_user')
        if user_id:
            scales_for_user = Scale.objects.filter(UserId=user_id)
            qs = qs.filter(CanId__in=scales_for_user)

        can_id = request.GET.get('CanId__id__exact')
        if can_id:
            qs = qs.filter(CanId_id=can_id)

        trantype = request.GET.get('Trantype')
        if trantype:
            qs = qs.filter(Trantype=trantype)

        date_time_gte = request.GET.get('date_time__gte')
        date_time_lt = request.GET.get('date_time__lt')
        if date_time_gte and date_time_lt:
            qs = qs.filter(date_time__gte=date_time_gte, date_time__lt=date_time_lt)

        # Lọc dữ liệu dựa trên người dùng staff và quyền truy cập
        if not request.user.is_superuser:
            # Lọc dữ liệu cân dựa trên quyền được cấp
            if request.user.has_perm('ScaleApp.view_weight'):
                # Lấy danh sách cân mà người dùng đã đăng ký
                can_ids = Scale.objects.filter(UserId=request.user).values_list('id', flat=True)

                # Lọc dữ liệu cân dựa trên danh sách cân mà người dùng đã đăng ký
                qs = qs.filter(CanId__in=can_ids)

        return qs

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "CanId" and not request.user.is_superuser:
            # Giới hạn lựa chọn cho trường CanId dựa trên người dùng
            kwargs["queryset"] = Scale.objects.filter(UserId=request.user)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def get_urls(self):
        urls = super().get_urls()
        from django.urls import path
        my_urls = [
            path('export-to-excel/', self.export_to_excel, name='export_to_excel'),
        ]
        return my_urls + urls

    #  xuat file excel
    def export_to_excel(self, request):
        # Lấy dữ liệu từ model Weight
        queryset = self.get_queryset(request)

        # Kiểm tra xem queryset có dữ liệu hay không
        if not queryset.exists():
            return HttpResponse("Không có dữ liệu để xuất.", status=204)

        # Tạo workbook và worksheet Excel
        workbook = openpyxl.Workbook()
        worksheet = workbook.active

        # Thêm dữ liệu vào worksheet
        worksheet.append(['Mã phiếu cân', 'Chứng từ', 'Số xe', 'Ngày vào', 'Ngày ra', 'Giờ vào', 'Giờ ra',
                          'Trọng lượng lần 1', 'Trọng lượng lần 2', 'Trọng lượng thực', 'Loại phiếu',
                          'Mã sản phẩm', 'Tên sản phẩm', 'Mã khách hàng', 'Tên khách hàng', 'Ngày tạo phiếu',
                          'Tên cân','Ghi chú',])

        # Định nghĩa múi giờ Việt Nam
        vietnam_tz = pytz.timezone('Asia/Ho_Chi_Minh')

        for obj in queryset:
            # Loại bỏ thông tin về múi giờ (timezone) từ các đối tượng datetime
            date_in = obj.Date_in.strftime('%d-%m-%Y')
            date_out = obj.Date_out.strftime('%d-%m-%Y')
            time_in = obj.time_in.strftime('%H:%M:%S')
            time_out = obj.time_out.strftime('%H:%M:%S')

            # Chuyển đổi date_time về giờ Việt Nam
            if obj.date_time.tzinfo is None:  # Nếu datetime không có thông tin múi giờ
                obj.date_time = pytz.utc.localize(obj.date_time)  # Giả sử nó là UTC
            date_time_vn = obj.date_time.astimezone(vietnam_tz).strftime('%d-%m-%Y %H:%M:%S')

            # Thực hiện truy vấn để lấy thông tin tên cân từ idCan
            can_id = obj.CanId
            scale_name = can_id.ScaleName if can_id else ''  # Đảm bảo xử lý trường hợp obj.CanId không tồn tại

            worksheet.append([obj.Ticketnum, obj.Docnum, obj.Truckno, date_in, date_out,
                              time_in, time_out, obj.Firstweight,
                              obj.Secondweight, obj.Netweight, obj.Trantype, obj.ProdCode, obj.ProdName, obj.CustCode,
                              obj.CustName, date_time_vn, scale_name, obj.Note])

        # Tạo file Excel và trả về response
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=weights.xlsx'
        workbook.save(response)
        return response

    def DateIn(self, obj):
        return obj.Date_in.strftime('%d-%m-%Y')

    def DateOut(self, obj):
        return obj.Date_out.strftime('%d-%m-%Y')

    def NgayTao(self, obj):
        vn_tz = timezone('Asia/Ho_Chi_Minh')
        vn_time = localtime(obj.date_time).astimezone(vn_tz)
        return vn_time.strftime('%d-%m-%Y %H:%M:%S')

    def TimeOut(self, obj):
        if obj.time_out:
            time_out_aware = make_aware(obj.time_out, timezone=get_current_timezone())
            return time_out_aware.strftime('%H:%M:%S')

    def TimeIn(self, obj):
        if obj.time_in:
            time_out_aware = make_aware(obj.time_in, timezone=get_current_timezone())
            return time_out_aware.strftime('%H:%M:%S')


class ScaleAdmin(admin.ModelAdmin):
    list_display = ['id','ScaleName', 'Created_Date', 'UserId', 'State']
    list_filter = ['CreatDay']

    def Created_Date(self, obj):
        vn_tz = timezone('Asia/Ho_Chi_Minh')
        vn_time = localtime(obj.CreatDay).astimezone(vn_tz)
        return vn_time.strftime('%d-%m-%Y %H:%M:%S')


class ImageAdminForm(forms.ModelForm):
    class Meta:
        model = Image
        fields = ['image']

    def save(self, commit=True):
        instance = super().save(commit=False)

        if commit:
            instance.save()

        # Tải hình lên Cloudinary và lưu URL vào image_url
        if instance.image:  # Kiểm tra nếu có hình ảnh
            upload_result = cloudinary.uploader.upload(instance.image,secure=True)  # Sử dụng secure=True để đảm bảo sử dụng HTTPS
            # Lấy URL sử dụng giao thức HTTPS
            instance.image_url = upload_result['secure_url'] if 'secure_url' in upload_result else upload_result['url']
            instance.save()

        return instance


class ImageAdmin(admin.ModelAdmin):
    form = ImageAdminForm
    list_display = ['image', 'Created_Date', 'img', 'image_url']
    readonly_fields = ['img']

    def img(self, image):
        if image and image.image:
            return mark_safe(
                '<img src="{url}" width="180" />'.format(url=image.image.url)
            )
        return ""

    def Created_Date(self, obj):
        vn_tz = timezone('Asia/Ho_Chi_Minh')
        vn_time = localtime(obj.CreatDay).astimezone(vn_tz)
        return vn_time.strftime('%d-%m-%Y %H:%M:%S')


admin_site.register(Weight, WeightAdmin)
admin_site.register(User, UserAdmin)
admin_site.register(Scale, ScaleAdmin)
admin_site.register(Image, ImageAdmin)