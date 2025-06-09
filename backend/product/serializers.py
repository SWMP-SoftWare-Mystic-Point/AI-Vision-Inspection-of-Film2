from rest_framework import serializers
from .models import Production
from inspection.serializers import InspectionSerializer

# class ProductionSerializer(serializers.ModelSerializer):
#     inspection = InspectionSerializer(required=False)

#     class Meta:
#         model = Production
#         fields = '__all__'

#     def create(self, validated_data):
#         insp_data = validated_data.pop('inspection', None)
#         prod = Production.objects.create(**validated_data)
#         '''
#         if insp_data:
#             InspectionSerializer().create({**insp_data, 'production': prod})
#         '''
#         return prod

class ProductionSerializer(serializers.HyperlinkedModelSerializer):
    # film = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    film_image = serializers.ImageField(source='product_image')
    class Meta:
        model = Production
        fields = ['url', 'id', 'film', 'film_image']