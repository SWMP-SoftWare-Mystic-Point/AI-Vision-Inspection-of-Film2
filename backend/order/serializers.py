from rest_framework import serializers
from .models import Film
from product.serializers import ProductionSerializer

class FilmSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Film
        fields = ['url', 'id', 'film_type', 'specification', 'order']
