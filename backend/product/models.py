from django.db import models
from order.models import Film

# Create your models here.
class Production(models.Model):
    film = models.ForeignKey(Film, related_name='productions', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    manufacture_date = models.DateTimeField(auto_now_add=True)
    manufacturer = models.CharField(max_length=100, default=None)
    factory = models.CharField(max_length=100, default=None)
    ##
    # product_image = models.ImageField(upload_to='original', null=True) # 이미지 경로
    product_image = models.CharField(max_length=100, default=None) # 이미지 경로
    
    def __str__(self):
        return f"{self.name} ({self.id})"
    