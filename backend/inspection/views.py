from rest_framework.response import Response
from .serializers import PredictSerailizer
from rest_framework.views import APIView
from product.models import Production
from django.http import JsonResponse
from django.shortcuts import render
from .model_loader import get_model
from rest_framework import status
from django.conf import settings
from order.models import Film
from pathlib import Path
from io import BytesIO
from PIL import Image

import base64, os, torch, json, random



# Create your views here.
class ProductionLoadAPIView(APIView):
    def get(self, request, *args, **kwargs):
        productions = Production.objects.all()
        
        original_hash = '0682C5F2076F099C34CFDD15A9E063849ED437A49677E6FCC5B4198C76575BE5'
        inpected_hash = '5CFC694A09A29773A463D0F3AAA8ED4B3B30EBE70411798535A0C6E9C8E430F4'
        
        data = []
        for production in productions:

            orig_path = os.path.join(
                settings.MEDIA_ROOT, 'original', f"{production.product_image}"
            )
            with open(orig_path, 'rb') as f:
                orig_b64 = base64.b64encode(f.read()).decode('utf-8')

            spec_x, spec_y = production.film.specification.split('x')

            data.append(
                {
                    'id': production.film.id,
                    'type': production.film.film_type,
                    'spec': production.film.specification,
                    # 'original' : f"image/original/{original_hash}",
                    'inspected' : f"image/inspected/{inpected_hash}",
                    'original' : orig_b64,
                    'product_image' : production.product_image,
                    'name': f"{str(production.film.film_type)[-1]}_{spec_x}_{spec_y}_{str(random.randint(10000000, 99999999))}_{production.film.order}",
                    'order': production.film.order,
                }
            )

        return JsonResponse({
            'production': data
        })
    
# class PredictView(APIView):
#     serializer_class = PredictSerailizer

#     def post(self, request, *args, **kwargs):
#         data = json.loads(request.body)

#         image_id = data[0]['id'] #ㅅㅂ

#         '''
#         if not image_id:
#             return Response(
#                 {"detail": "query param 'image_id' is required."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#         '''

#         img_path = Path(settings.MEDIA_ROOT) / 'original' / data[0]['product_image'] # 경로 하드코딩 바꾸기
#         if not img_path.exists():
#             return Response({"detail": "file missing on disk."}, status=404)
        
#         model = get_model()
#         img = Image.open(img_path).convert("RGB")
#         with torch.inference_mode():
#             result = model(img, verbose=False)[0]
#             idx  = int(result.probs.top1) # 가장 높은 확률 클래스 index
#             conf = float(result.probs.top1conf)

#         return Response(
#             {
#                 'image_id' : image_id,
#                 'label' : model.names[int(idx)],
#                 'confidence' : float(conf),
#             },
#             status=status.HTTP_200_OK,
#         )
        

#         return JsonResponse({'data' : product_image})


class PredictView(APIView):
    serializer_class = PredictSerailizer

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        
        # data가 [{ id, product_image }, { id, product_image }, …] 형태라고 가정
        results = []

        model = get_model()
        for item in data:
            image_id = item['id']
            img_path = Path(settings.MEDIA_ROOT) / 'original' / item['product_image']

            if not img_path.exists():
                # 이미지가 없으면 에러 결과 하나만 추가하거나 skip할 수 있음
                results.append({
                    'image_id': image_id,
                    'label': None,
                    'confidence': None,
                    'error': 'file missing'
                })
                continue

            img = Image.open(img_path).convert("RGB")
            with torch.inference_mode():
                result = model(img, verbose=False)[0]
                idx  = int(result.probs.top1)
                conf = float(result.probs.top1conf)

            results.append({
                'image_id': image_id,
                'label': "비정상" if model.names[idx] == 'defect' else '정상',
                'confidence': conf
            })

        return Response(results, status=status.HTTP_200_OK)


# class TestGetView(APIView):



# class TestApiView(APIView):
#     def get(self, request, *args, **kwargs):
    
#     def post(self, request, *args, **kwargs):