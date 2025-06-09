from django.urls import path, include
from .views import OrderCreateAPIView
from rest_framework import routers
from .views import FilmViewSet

router = routers.DefaultRouter()
router.register(r'films', FilmViewSet)

urlpatterns = [
    # React 측 코드가 이 엔드포인트로 POST 합니다.
    path('', include(router.urls), name='films'),
    path('film_order/', OrderCreateAPIView.as_view(), name='order-create'),
]
