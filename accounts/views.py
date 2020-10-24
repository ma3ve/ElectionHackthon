from django.shortcuts import render
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view


@api_view(['POST'])
def register(request):
    userSerializer = UserSerializer(data=request.data)
    if userSerializer.is_valid(raise_exception=True):
        user = userSerializer.create(userSerializer.validated_data)
    token = RefreshToken.for_user(user)
    response = {}
    response['access'] = str(token.access_token)
    response['refresh'] = str(token)
    return Response(response)
