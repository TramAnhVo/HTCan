from django.urls import path, include
from rest_framework import routers
from . import views


router = routers.DefaultRouter()
router.register('PhieuCans', views.PhieuCanView, basename='PhieuCans')
router.register('Cans', views.CanView, basename='Cans')
router.register('users', views.UserView, basename='users')


urlpatterns = [
    path('', include(router.urls))
]