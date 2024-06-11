import calendar

import pytz
from django.shortcuts import render
from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser
from rest_framework.views import Response
from django.http import JsonResponse, HttpResponseRedirect
from datetime import date, timedelta, datetime
from django.db.models import Sum, Count
from django.utils import timezone
from django.db.models.functions import ExtractWeek, TruncDate

from . import serializers
from .models import User, Scale, Weight, Customer, Product


def home(request):
    return render(request, 'layout/home.html')


class ScaleView(viewsets.ViewSet,
              generics.ListAPIView,
              generics.RetrieveAPIView):
    queryset = Scale.objects.all()
    serializer_class = serializers.ScaleSerializer

    # danh sach phieu can cua mot can
    @action(methods=['get'], detail=True)
    def weight_lists(self, request, pk):
        today = datetime.now().date()
        scales = self.get_object().weight_set.all().filter(date_time__date=today)
        print(scales)

        return Response(serializers.WeightSerializer(scales, many=True, context={'request': request}).data,
                        status=status.HTTP_200_OK)


class UserView(viewsets.ViewSet,
               generics.CreateAPIView,
               generics.UpdateAPIView,
               generics.ListAPIView):
    queryset = User.objects.filter(is_active=True).all()
    serializer_class = serializers.UserSerializer
    parser_classes = [JSONParser]

    def get_permissions(self):
        if self.action.__eq__('current_user'):
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='current-user', url_name='current-user', detail=False)
    def current_user(self, request):
        return Response(serializers.UserSerializer(request.user).data)

    # danh sach thong tin can cua 1 user
    @action(methods=['get'], detail=True)
    def scales(self, request, pk):
        users = self.get_object().scale_set.all()

        return Response(serializers.ScaleSerializer(users, many=True, context={'request': request}).data,
                        status=status.HTTP_200_OK)


class ProductView(viewsets.ViewSet,
                  generics.ListAPIView,
                  generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = serializers.ProductSerializer


class CustomerView(viewsets.ViewSet,
                  generics.ListAPIView,
                  generics.RetrieveAPIView):
    queryset = Customer.objects.all()
    serializer_class = serializers.CustomerSerializer


class WeightView(viewsets.ViewSet,
                  generics.ListAPIView,
                  generics.RetrieveAPIView):
    queryset = Weight.objects.all()
    serializer_class = serializers.WeightSerializer