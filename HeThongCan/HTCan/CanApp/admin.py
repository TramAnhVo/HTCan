from cloudinary import CloudinaryImage
from cloudinary.forms import CloudinaryFileField
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils.html import mark_safe
from django import forms
from django.contrib import admin
from django.urls import path
from django.utils.timezone import localtime
from pytz import timezone

from . import dao
from .models import PhieuCan, ThongTinCan, User
from django.template.response import TemplateResponse
from oauth2_provider.models import Application, RefreshToken, IDToken, AccessToken, Grant


class CanDienTuAdmin(admin.AdminSite):
    site_header = 'HỆ THỐNG CÂN ĐIỆN TỬ'
    site_title = "HỆ THỐNG CÂN ĐIỆN TỬ"
    index_title = "HỆ THỐNG CÂN ĐIỆN TỬ"

    def get_urls(self):
        return [
                   path('can-stats/', self.stats_view)
               ] + super().get_urls()

    def stats_view(self, request):
        return TemplateResponse(request, 'admin/chart.html', {
            'stats': dao.count_PhieuCan_by_Can()
        })


admin_site = CanDienTuAdmin(name='myapp')


class PhieuCanAdmin(admin.ModelAdmin):
    list_display = ['MaPhieu', 'TLTong', 'TLBi', 'TLHang', 'NgayTaoPhieu', 'CanId', 'TrangThai']
    list_filter = ['NgayTao', 'CanId']
    search_fields = ['MaPhieu']
    readonly_fields = ['TLHang']
    list_per_page = 20

    def NgayTaoPhieu(self, obj):
        vn_tz = timezone('Asia/Ho_Chi_Minh')
        vn_time = localtime(obj.NgayTao).astimezone(vn_tz)
        return vn_time.strftime('%d-%m-%Y %H:%M:%S')


class Can(admin.ModelAdmin):
    list_display = ['TenCan', 'NgayTao', 'UserId' ,'TrangThai']
    search_fields = ['TenCan']
    list_per_page = 20


class YourModelAdminForm(forms.ModelForm):
    avatar = CloudinaryFileField()

    class Meta:
        model = User
        fields = '__all__'

    # def save(self, commit=True):
    #     instance = super().save(commit=False)
    #     instance.avatar = self.cleaned_data['avatar'].url
    #
    #     if commit:
    #         instance.save()
    #     return instance

    #  lôi khi không upload thì lưu trùng 2 lần
    def save(self, commit=True):
        instance = super().save(commit=False)
        avatar_file_name = self.cleaned_data['avatar']

        if avatar_file_name:
            avatar_url = f"http://res.cloudinary.com/dfhexl1gh/image/upload/{str(avatar_file_name)}"
            instance.avatar = avatar_url
        elif not instance.pk:
            # Xử lý khi không có tải lên tệp và là lần lưu đầu tiên
            instance.avatar = None

        if commit:
            instance.save()
        return instance


class UserAdmin(admin.ModelAdmin):
    form = YourModelAdminForm

    search_fields = ['username']
    list_display = ['username', 'first_name',  'company','phone', 'NgayTao', 'is_active', 'is_staff', 'state']
    readonly_fields = ['Avatar_View']
    actions = ['activate_selected_accounts', 'lock_selected_accounts']
    list_per_page = 20

    def Avatar_View(self, user):
        if user:
            return mark_safe(
                '<img src="{url}" width="200" />'.format(url=user.avatar)
            )

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


class OauthAdmin(admin.ModelAdmin):
    list_display = ['client_id', 'name', 'user_id', 'client_type', 'authorization_grant_type', 'created']


admin_site.register(PhieuCan, PhieuCanAdmin)
admin_site.register(ThongTinCan, Can)
admin_site.register(User, UserAdmin)

# menu chung thuc oauth2
admin_site.register(Application, OauthAdmin)
admin_site.register(AccessToken)
admin_site.register(RefreshToken)
admin_site.register(Grant)
admin_site.register(IDToken)


