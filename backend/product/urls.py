from django.urls import path, include
from .views import ProductionLoadAPIView, ProductionViewset, ProductionAPIView
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'products', ProductionViewset)

urlpatterns = [
    # React 측 코드가 이 엔드포인트로 POST 합니다.
    path('', include(router.urls), name='products'),
    path('product_load/', ProductionLoadAPIView.as_view(), name='product-load'),
    path('product_complate/', ProductionAPIView.as_view(), name='product-complate'),
    # .as_view({'get': 'list'})
]
