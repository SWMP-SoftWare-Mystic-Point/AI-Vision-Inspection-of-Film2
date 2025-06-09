from django.urls import path
from .views import ProductionLoadAPIView, PredictView

urlpatterns = [
    path('production_load/', ProductionLoadAPIView.as_view(), name='production-load'),
    path('predict/', PredictView.as_view(), name='predict'),    
]
