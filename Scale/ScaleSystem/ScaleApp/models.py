from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    phone = models.CharField(max_length=10, null=True)
    company = models.CharField(max_length=255, null=True)
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


class Product(models.Model):
    ProdCode = models.CharField(max_length=255, null=False)
    Prodname = models.CharField(max_length=255, null=False)
    CreatDay = models.DateTimeField(null=True, auto_now_add=True)
    State = models.BooleanField(default=True)

    def __str__(self):
        return self.ProdCode

    class Meta:
        ordering = ['-id']


class Customer(models.Model):
    Custcode = models.CharField(max_length=255, null=False)
    Custname = models.CharField(max_length=255, null=False)
    CreatDay = models.DateTimeField(null=True, auto_now_add=True)
    State = models.BooleanField(default=True)

    def __str__(self):
        return self.Custcode

    class Meta:
        ordering = ['-id']


class Scale(models.Model):
    ScaleName = models.CharField(max_length=255, null=False)
    CreatDay = models.DateTimeField(null=True, auto_now_add=True)
    State = models.BooleanField(default=True)

    UserId = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.ScaleName

    class Meta:
        ordering = ['-id']


class Weight(models.Model):
    Ticketnum = models.CharField(null=False, max_length=255)
    Docnum = models.CharField(null=False, max_length=30)
    Truckno = models.CharField(max_length=15, null=False)

    Date_in = models.DateField(auto_now_add=True, null=False)
    Date_out = models.DateField(auto_now=True, null=False)

    Firstweight = models.IntegerField(null=False)
    Secondweight = models.IntegerField(null=False)
    Netweight = models.IntegerField(null=False)

    Note = models.CharField(max_length=255, null=True, blank=True)
    Trantype = models.CharField(max_length=255, null=False)

    ProdName = models.CharField(max_length=255, null=True)
    CustName = models.CharField(max_length=255, null=True)
    Prodcode = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    Custcode = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True)

    time_in = models.TimeField(auto_now_add=True)
    time_out = models.TimeField(auto_now=True)
    date_time = models.DateTimeField(null=True, auto_now_add=True)

    CanId = models.ForeignKey(Scale, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.Ticketnum

    class Meta:
        ordering = ['-id']

    def save(self, *args, **kwargs):
        self.Netweight = abs(self.Firstweight - self.Secondweight)
        self.CustName = self.Custcode.Custname
        self.ProdName = self.Prodcode.Prodname
        super().save(*args, **kwargs)
