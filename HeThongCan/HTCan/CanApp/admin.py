from cloudinary.forms import CloudinaryFileField
from django.utils.html import mark_safe
from django import forms
from django.contrib import admin
from .models import PhieuCan, ThongTinCan, User


class CanDienTuAdmin(admin.AdminSite):
    site_header = 'HỆ THỐNG CÂN ĐIỆN TỬ'


admin_site = CanDienTuAdmin(name='myapp')


class PhieuCanAdmin(admin.ModelAdmin):
    list_display = ['MaPhieu', 'TLTong', 'TLBi', 'TLHang', 'NgayTao', 'TrangThai']
    list_filter = ['NgayTao']
    search_fields = ['MaPhieu']


class Can(admin.ModelAdmin):
    list_display = ['TenCan', 'NgayTao', 'TrangThai']
    search_fields = ['TenCan']


class YourModelAdminForm(forms.ModelForm):
    avatar = CloudinaryFileField()

    class Meta:
        model = User
        fields = '__all__'

    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.avatar = self.cleaned_data['avatar'].url
        if commit:
            instance.save()
        return instance


class UserAdmin(admin.ModelAdmin):
    form = YourModelAdminForm

    search_fields = ['username']
    list_display = ['username', 'phone', 'date_joined', 'is_active', 'is_staff']
    readonly_fields = ['Avatar_View']

    def Avatar_View(self, user):
        if user:
            return mark_safe(
                '<img src="{url}" width="200" />'.format(url=user.avatar)
            )


admin_site.register(PhieuCan, PhieuCanAdmin)
admin_site.register(ThongTinCan, Can)
admin_site.register(User, UserAdmin)