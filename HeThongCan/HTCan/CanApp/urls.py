from django.urls import path, include
from rest_framework import routers
from . import views

app_name = 'admin'
router = routers.DefaultRouter()
router.register('weight-list', views.PhieuCanView, basename='weight-list')
router.register('scale', views.CanView, basename='scale')
router.register('users', views.UserView, basename='users')


urlpatterns = [
    path('', include(router.urls)),
    path('stats/count-PhieuCan-day/<int:canId>/', views.PhieuCanView.as_view({'get': 'count_PhieuCan'}),name='count-PhieuCan'),
    path('stats/count-PhieuCan-month/<int:canId>/', views.PhieuCanView.as_view({'get': 'count_PhieuCan_by_month'}), name='count-PhieuCan-by-month'),
    path('stats/count-PhieuCan-week/', views.PhieuCanView.as_view({'get': 'count_PhieuCan_by_week'}), name='count_PhieuCan_by_week'),
    path('stats/count-PhieuCan-day-of-week/<int:canId>/', views.PhieuCanView.as_view({'get': 'count_PhieuCan_day_of_week'}), name='count_PhieuCan_day_of_week'),
    path('stats/count-PhieuCan-of-day/<int:year>/<int:month>/<int:day>/', views.PhieuCanView.as_view({'get': 'count_PhieuCan_of_day'}), name='count_PhieuCan_of_day'),
    path('stats/count-PhieuCan-days/<int:time>/', views.PhieuCanView.as_view({'get': 'count_PhieuCan_For_Time'}),name='count_PhieuCan_For_Time'),
    path('stats/count-PhieuCan-Month-Year/<int:year>/<int:month>/', views.PhieuCanView.as_view({'get': 'count_PhieuCan_Month_Year'}),name='count_PhieuCan_Month_Year'),
]