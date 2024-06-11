from django.urls import path, include
from rest_framework import routers
from . import views
from .admin import admin_site

app_name = 'admin'
router = routers.DefaultRouter()
router.register('users', views.UserView, basename='users')
router.register('scales', views.ScaleView, basename='scales')
router.register('customers', views.CustomerView, basename='customers')
router.register('products', views.ProductView, basename='products')
router.register('weights', views.WeightView, basename='weights')

urlpatterns = [
    path('', views.home, name='index'),
    path('admin/', admin_site.urls, name='home'),
    path('', include(router.urls)),
]