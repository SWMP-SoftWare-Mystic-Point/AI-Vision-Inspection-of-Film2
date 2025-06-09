from django.db import models
from product.models import Production

# Create your models here.
class Inspection(models.Model):
    production = models.OneToOneField(Production, related_name='inspection', on_delete=models.CASCADE) # 생산 ID
    partition = models.IntegerField(default=1) # 분활 갯수
    camera = models.CharField(max_length=100, default=None) # 카메라
    light = models.CharField(max_length=100, default=None) # 조명

    def __str__(self):
        return f"Inspection #{self.id} of {self.production.name}"
    

class InspectionImage(models.Model):
    inspection = models.ForeignKey(Inspection, related_name='images', on_delete=models.CASCADE)
    inspection_date = models.DateTimeField(auto_now_add=True)
    image_path = models.ImageField(upload_to='inpection')
    image_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.image_name} ({self.id})"


class InspectionResult(models.Model):
    inspection_image = models.OneToOneField(InspectionImage, related_name='result', on_delete=models.CASCADE)
    detail = models.TextField(default=None)
    is_defect = models.BooleanField(default=False)

    def __str__(self):
        return f"Result #{self.id} (Defect: {self.defect_judgment})"


class DetailedInspectionResult(models.Model):
    inspection_result = models.ForeignKey(InspectionResult, related_name='details', on_delete=models.CASCADE)
    defect_type = models.CharField(max_length=100)
    defect_position = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.defect_type} at {self.defect_position}"