from cloudinary.models import CloudinaryField
from django.db import models
from django.contrib.auth.models import AbstractUser
import cloudinary
from django.utils import timezone


class User(AbstractUser):
    phone = models.CharField(max_length=10, null=True)
    company = models.CharField(max_length=255, null=True)
    state = models.BooleanField(default=False)
    avatar = models.CharField(null=True, max_length=1000)

    def save(self, *args, **kwargs):
        if self.pk:  # Kiểm tra xem đối tượng đã tồn tại trong cơ sở dữ liệu hay chưa
            original_user = User.objects.get(pk=self.pk)  # Lấy đối tượng User gốc từ cơ sở dữ liệu
            if self.password != original_user.password:  # Kiểm tra xem mật khẩu đã thay đổi hay chưa
                if not self.password.startswith('pbkdf2_'):  # Kiểm tra xem mật khẩu đã được mã hóa trước đó chưa
                    self.set_password(self.password)  # Mã hóa mật khẩu mới
        else:  # Đối tượng mới được tạo
            self.set_password(self.password)  # Mã hóa mật khẩu mới
        super().save(*args, **kwargs)  # Gọi phương thức lưu trữ của lớp cha

    # def save_avatar(self, *args, **kwargs):
    #     # Kiểm tra xem có tệp tin hình ảnh mới được tải lên hay không
    #     if self.avatar and 'cloudinary.com' not in self.avatar:
    #         # Tải lên hình ảnh lên Cloudinary
    #         response = cloudinary.uploader.upload(self.avatar)
    #         # Lưu đường dẫn hình ảnh trả về từ Cloudinary vào trường avatar
    #         self.avatar = response['url']
    #     super().save(*args, **kwargs)


class ThongTinCan(models.Model):
    TenCan = models.CharField(max_length=255, null=False)
    NgayTao = models.DateField(auto_now_add=True, null=True)
    TrangThai = models.BooleanField(default=True)

    UserId = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.TenCan

    class Meta:
        ordering = ['-id']


class PhieuCan(models.Model):
    MaPhieu = models.CharField(max_length=255, null=False)
    TLTong = models.IntegerField(null=False)
    TLBi = models.IntegerField(null=False)
    TLHang = models.IntegerField(null=True, editable=False)

    NgayTao = models.DateTimeField(null=True, auto_now_add=True)
    TrangThai = models.BooleanField(default=True)

    CanId = models.ForeignKey(ThongTinCan, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.MaPhieu

    def save(self, *args, **kwargs):
        # Tính toán giá trị cho trường TLHang
        self.TLHang = self.TLTong - self.TLBi

        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-id']
