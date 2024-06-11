from rest_framework.serializers import ModelSerializer
from .models import User, Weight, Customer, Product, Scale


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields  = '__all__'
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class CustomerSerializer(ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class ScaleSerializer(ModelSerializer):
    class Meta:
        model = Scale
        fields = '__all__'


class WeightSerializer(ModelSerializer):
    class Meta:
        model = Weight
        fields = '__all__'