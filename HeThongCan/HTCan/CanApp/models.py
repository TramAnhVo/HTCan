from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    phone = models.CharField(max_length=10, null=True)
    state = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.pk:  # Kiểm tra xem đối tượng đã tồn tại trong cơ sở dữ liệu hay chưa
            original_user = User.objects.get(pk=self.pk)  # Lấy đối tượng User gốc từ cơ sở dữ liệu

            if self.password != original_user.password:  # Kiểm tra xem mật khẩu đã thay đổi hay chưa
                if not self.password.startswith('pbkdf2_'):  # Kiểm tra xem mật khẩu đã được mã hóa trước đó chưa
                    self.set_password(self.password)  # Mã hóa mật khẩu mới
        else:  # Đối tượng mới được tạo
            self.set_password(self.password)  # Mã hóa mật khẩu mới

        super().save(*args, **kwargs)  # Gọi phương thức lưu trữ của lớp cha


class ThongTinCan(models.Model):
    TenCan = models.CharField(max_length=255, null=False)
    NgayTao = models.DateField(auto_now_add=True, null=True)
    TrangThai = models.BooleanField(default=True)


class PhieuCan(models.Model):
    MaPhieu = models.CharField(max_length=255, null=False)
    TLTong = models.IntegerField(null=False)
    TLBi = models.IntegerField(null=False)
    TLHang = models.IntegerField(null=False)

    NgayTao = models.DateField(auto_now_add=True, null=True)
    TrangThai = models.BooleanField(default=True)

    # TenCan = models.ForeignKey(ThongTinCan,  on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.MaPhieu

