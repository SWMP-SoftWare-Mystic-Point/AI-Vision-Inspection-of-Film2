from rest_framework import serializers
from .models import Inspection, InspectionImage, InspectionResult, DetailedInspectionResult



class DetailedInspectionResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetailedInspectionResult
        fields = '__all__'


class InspectionResultSerializer(serializers.ModelSerializer):
    details = DetailedInspectionResultSerializer(many=True)

    class Meta:
        model = InspectionResult
        fields = '__all__'

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        result = InspectionResult.objects.create(**validated_data)
        '''
        for d in details_data:
            DetailedInspectionResult.objects.create(inspection_result=result, **d)
        '''
        return result


class InspectionImageSerializer(serializers.ModelSerializer):
    result = InspectionResultSerializer()

    class Meta:
        model = InspectionImage
        fields = '__all__'

    def create(self, validated_data):
        result_data = validated_data.pop('result')
        img = InspectionImage.objects.create(**validated_data)
        result = InspectionResultSerializer().create({**result_data, 'inspection_image': img})
        return img


class InspectionSerializer(serializers.ModelSerializer):
    images = InspectionImageSerializer(many=True)

    class Meta:
        model = Inspection
        fields = '__all__'

    def create(self, validated_data):
        images_data = validated_data.pop('images')
        insp = Inspection.objects.create(**validated_data)
        '''
        for img_data in images_data:
            InspectionImageSerializer().create({**img_data, 'inspection': insp})
        '''
        return insp
    
class PredictSerailizer(serializers.Serializer):
    image = serializers.ImageField()