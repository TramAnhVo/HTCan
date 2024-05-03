from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser
from rest_framework.views import Response

from . import serializers
from .models import PhieuCan, ThongTinCan, User


class PhieuCanView(viewsets.ViewSet,
                generics.ListAPIView,
                generics.CreateAPIView,
                generics.UpdateAPIView,
                generics.RetrieveAPIView,
                generics.DestroyAPIView):
    queryset = PhieuCan.objects.all()
    serializer_class = serializers.PhieuCanSerializer

class CanView(viewsets.ViewSet,
                generics.ListAPIView,
                generics.CreateAPIView,
                generics.UpdateAPIView,
                generics.RetrieveAPIView,
                generics.DestroyAPIView):
    queryset = ThongTinCan.objects.all()
    serializer_class = serializers.CanSerializer


class UserView(viewsets.ViewSet,
               generics.ListAPIView,
               generics.CreateAPIView,
               generics.UpdateAPIView):
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