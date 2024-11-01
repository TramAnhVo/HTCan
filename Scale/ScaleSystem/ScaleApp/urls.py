from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('users', views.UserView, basename='users')
router.register('scales', views.ScaleView, basename='scales')
router.register('weights', views.WeightView, basename='weights')
router.register('images', views.ImageView, basename='images')

urlpatterns = [
    path('', views.home, name='home'),
    path('api/', include(router.urls)),
    # kiem tra ten dang nhap + ma phieu can
    path('check-username/', views.UserView.as_view({'post': 'check_username'}), name='check_username'),

    # phieu can
    path('weight_user/<int:canId>/', views.WeightView.as_view({'get': 'weight_user'}),name='weight_user'),
    path('stats/count-weight-month/<int:canId>/', views.WeightView.as_view({'get': 'count_weight_by_month'}),name='count_weight_by_month'),
    path('stats/weight-detail-month/<int:month>/<int:canId>', views.WeightView.as_view({'get': 'weight_detail_month'}),name='weight_detail_month'),
    path('stats/count-weight-day-of-week/<int:canId>/<int:num>',views.WeightView.as_view({'get': 'count_weight_day_of_week'}), name='count_weight_day_of_week'),
    path('stats/weight-detail-week/<int:year>/<int:month>/<int:day>/<int:type>/<int:canId>',views.WeightView.as_view({'get': 'weight_detail_week'}), name='weight_detail_week'),

    path('stats/count-weight-of-day/<int:year>/<int:month>/<int:day>/<int:canId>/', views.WeightView.as_view({'get': 'count_weight_of_day'}), name='count_weight_of_day'),
    path('stats/weight-detail-year/<int:year>/<int:canId>/',views.WeightView.as_view({'get': 'weight_detail_year'}), name='weight_detail_year'),
    path('stats/count-weight-from-time/<int:yearFrom>/<int:monthFrom>/<int:dayFrom>/<int:yearTo>/<int:monthTo>/<int:dayTo>/<int:canId>', views.WeightView.as_view({'get':'count_weight_from_time'}), name='count_weight_from_time'),

    # thống kê tổng quát
    path('stats/general-month/<int:month>/<int:canId>', views.WeightView.as_view({'get':'general_month'}), name='general_month'),
    path('stats/general-week/<int:canId>', views.WeightView.as_view({'get':'general_week'}), name='general_week'),
    path('stats/general-from-day/<int:yearFrom>/<int:monthFrom>/<int:dayFrom>/<int:yearTo>/<int:monthTo>/<int:dayTo>/<int:canId>', views.WeightView.as_view({'get':'general_from_date'}), name='general_from_date'),
    path('stats/general-day/<int:year>/<int:month>/<int:day>/<int:canId>', views.WeightView.as_view({'get':'general_day'}), name='general_day'),

    # tìm kiếm theo mã KH/ SP
    path('stats/get-customer-weight/<int:year>/<int:month>/<int:day>/<int:canId>/<str:custCode>', views.WeightView.as_view({'get':'get_customer_weight'}), name='get_customer_weight'),
    path('stats/get-product-weight/<int:year>/<int:month>/<int:day>/<int:canId>/<str:prodCode>', views.WeightView.as_view({'get':'get_product_weight'}), name='get_product_weight'),
]