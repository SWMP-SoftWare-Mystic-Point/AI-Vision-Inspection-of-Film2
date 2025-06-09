from django.db import models

# Create your models here.
class Film(models.Model):
    film_type = models.CharField(max_length=100)
    specification = models.CharField(max_length=100, default=None) # 규격
    order = models.CharField(max_length=100, default=None)

    def __str__(self):
        return f"{self.film_type} ({self.id})"