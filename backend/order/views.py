from rest_framework import status
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.response import Response
from .serializers import FilmSerializer
from .models import Film
import json

class FilmViewSet(viewsets.ModelViewSet):
    queryset = Film.objects.all()
    serializer_class = FilmSerializer


class OrderCreateAPIView(APIView):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        
        Film(
            film_type = data['type'], 
            specification = data['spec'], 
            order = data['customer'],
        ).save()

        return Response(data, status=status.HTTP_201_CREATED)
