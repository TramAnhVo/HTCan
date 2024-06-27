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
    path('api/', include(router.urls)),

    path('stats/count-weight-month/<int:canId>/', views.WeightView.as_view({'get': 'count_weight_by_month'}),name='count_weight_by_month'),
    path('stats/weight-detail-month/<int:month>/<int:type>/<int:canId>', views.WeightView.as_view({'get': 'weight_detail_month'}),name='weight_detail_month'),
    path('stats/count-weight-day-of-week/<int:canId>/<int:num>',views.WeightView.as_view({'get': 'count_weight_day_of_week'}), name='count_weight_day_of_week'),
    path('stats/weight-detail-week/<int:year>/<int:month>/<int:day>/<int:type>/<int:canId>',views.WeightView.as_view({'get': 'weight_detail_week'}), name='weight_detail_week'),

    path('stats/count-weight-of-day/<int:year>/<int:month>/<int:day>/<int:type>/', views.WeightView.as_view({'get': 'count_weight_of_day'}), name='count_weight_of_day'),
    path('stats/count-weight-Month-Year/<int:year>/<int:month>/<int:type>/',views.WeightView.as_view({'get': 'count_weight_Month_Year'}), name='count_weight_Month_Year'),
    path('stats/count-weight-days/<int:time>/<int:type>/', views.WeightView.as_view({'get': 'count_weight_For_Time'}),name='count_weight_For_Time'),
    path('stats/count-weight-category/<int:num>/', views.WeightView.as_view({'get':'count_weight_category'}), name='count_weight_category'),
    path('stats/count-weight-from-time/<int:yearFrom>/<int:monthFrom>/<int:dayFrom>/<int:yearTo>/<int:monthTo>/<int:dayTo>/<int:type>/', views.WeightView.as_view({'get':'count_weight_from_time'}), name='count_weight_from_time')
]