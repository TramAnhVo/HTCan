from django.contrib import admin
from .models import PhieuCan, ThongTinCan


class CanDienTuAdmin(admin.AdminSite):
    site_header = 'HỆ THỐNG CÂN ĐIỆN TỬ'


admin_site = CanDienTuAdmin(name='myapp')


class PhieuCanAdmin(admin.ModelAdmin):
    list_display = ['MaPhieu', 'TLTong', 'TLBi', 'TLHang', 'NgayTao', 'TrangThai']
    list_filter = ['NgayTao']
    search_fields = ['MaPhieu']


class Can(admin.ModelAdmin):
    pass
    # list_display = ['TenCan']
    # search_fields = ['TenCan']


admin_site.register(PhieuCan, PhieuCanAdmin)
admin_site.register(ThongTinCan)