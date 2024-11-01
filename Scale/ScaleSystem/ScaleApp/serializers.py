from rest_framework import status
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from .models import User, Weight, Scale, Image


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class ScaleSerializer(ModelSerializer):

    class Meta:
        model = Scale
        fields = '__all__'


class WeightSerializer(ModelSerializer):

    class Meta:
        model = Weight
        fields = '__all__'


class ImageSerializer(ModelSerializer):

    class Meta:
        model = Image
        fields = '__all__'