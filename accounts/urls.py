from django.contrib import admin
from django.urls import path
from .views import register, verifyToken
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', register),
    path('verify/', verifyToken),
    path('login/', TokenObtainPairView.as_view()),

]
