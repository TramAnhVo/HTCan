from rest_framework.serializers import ModelSerializer
from .models import PhieuCan, ThongTinCan, User


class PhieuCanSerializer(ModelSerializer):
    class Meta:
        model = PhieuCan
        fields = '__all__'


class CanSerializer(ModelSerializer):
    class Meta:
        model = ThongTinCan
        fields = '__all__'


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "phone", "avatar"]
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }