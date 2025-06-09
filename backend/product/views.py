from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render
from order.models import Film
from order.serializers import FilmSerializer
from django.http import JsonResponse
from django.core import serializers
from django.conf import settings
from rest_framework import viewsets
from .models import Production
from .serializers import ProductionSerializer
from django.core.files.base import ContentFile

import random, os, json, hashlib

def Json(data):
    return json.loads(serializers.serialize('json', [data]))

def Jsons(data):
    return json.loads(serializers.serialize('json', data))

# Create your views here.
class ProductionLoadAPIView(APIView):
    def get(self, request, *args, **kwargs):
        data = {}
        
        films = Film.objects.all()
        
        for film in films:
            spec_x, spec_y = film.specification.split('x')
            
            film_info = {
                'id': film.id,
                'type': film.film_type,
                'spec': film.specification,
                'name': f"{str(film.film_type)[-1]}_{spec_x}_{spec_y}_{str(random.randint(10000000, 99999999))}_{film.order}",
            }

            if film.order in data:
                data[film.order].append(film_info)
            else:
                data[film.order] = [film_info]
                
        return JsonResponse({
            'film': data
        })


class ProductionViewset(viewsets.ModelViewSet):
    queryset = Production.objects.all()
    serializer_class = ProductionSerializer

    # def list(self, request, *args, **kwargs):
    #     if request.method == "GET":
    #         film = self.get_queryset()       
    #         film_serializer = FilmSerializer(film, many=True)

    #         return JsonResponse({
    #             'film': film_serializer.data
    #         })
        
class ProductionAPIView(APIView):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)

        img_dir = os.path.join(settings.MEDIA_ROOT, 'original')

        # 2) 디렉터리 내 파일 중 이미지 확장자만 필터링
        valid_exts = ('.jpg', '.jpeg', '.png', '.gif', '.bmp')
        all_images = [
            fname for fname in os.listdir(img_dir)
            if fname.lower().endswith(valid_exts)
        ]

        # 3) 랜덤으로 하나 선택
        chosen = random.choice(all_images)


        Production(
            film = Film.objects.filter(id = data['number']).get(),
            name = f"{str(random.randint(10000000, 99999999))}_{data['customer']}",
            manufacturer = 'DCU',
            factory = 'DCU_factore',
            product_image = chosen,
        ).save()

        return Response(data, status=status.HTTP_201_CREATED)
