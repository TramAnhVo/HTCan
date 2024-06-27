from django.utils.html import mark_safe
from django.contrib import admin
from django.utils.timezone import localtime, make_aware, get_current_timezone
from pytz import timezone

from . import dao
from .models import User, Weight, Customer, Product, Scale


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


class WeightAdmin(admin.ModelAdmin):
    list_display = ['Ticketnum', 'Truckno', 'DateIn', 'DateOut', 'ProdName', 'CustName', 'Firstweight',
                    'Secondweight', 'Netweight', 'Trantype', 'TimeIn', 'TimeOut' ]
    list_filter = ['date_time', 'Trantype']
    search_fields = ['ProdName', 'CustName']
    readonly_fields = ['ProdName', 'CustName', 'Netweight', 'DateIn', 'DateOut', 'TimeIn', 'TimeOut' ]
    list_per_page = 20

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


class ProductAdmin(admin.ModelAdmin):
    list_display = ['ProdCode', 'Prodname', 'Created_Date', 'State']
    list_filter = ['CreatDay']
    search_fields = ['Prodname', 'ProdCode']

    def Created_Date(self, obj):
        vn_tz = timezone('Asia/Ho_Chi_Minh')
        vn_time = localtime(obj.CreatDay).astimezone(vn_tz)
        return vn_time.strftime('%d-%m-%Y %H:%M:%S')


class CustomerAdmin(admin.ModelAdmin):
    list_display = ['Custcode', 'Custname', 'Created_Date', 'State']
    list_filter = ['CreatDay']
    search_fields = ['Custcode', 'Custname']

    def Created_Date(self, obj):
        vn_tz = timezone('Asia/Ho_Chi_Minh')
        vn_time = localtime(obj.CreatDay).astimezone(vn_tz)
        return vn_time.strftime('%d-%m-%Y %H:%M:%S')


class ScaleAdmin(admin.ModelAdmin):
    list_display = ['id','ScaleName', 'Created_Date', 'UserId' , 'State']
    list_filter = ['CreatDay']

    def Created_Date(self, obj):
        vn_tz = timezone('Asia/Ho_Chi_Minh')
        vn_time = localtime(obj.CreatDay).astimezone(vn_tz)
        return vn_time.strftime('%d-%m-%Y %H:%M:%S')


admin_site.register(Weight, WeightAdmin)
admin_site.register(Customer, CustomerAdmin)
admin_site.register(Product, ProductAdmin)
admin_site.register(User, UserAdmin)
admin_site.register(Scale, ScaleAdmin)