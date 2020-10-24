from django.contrib import admin
from django.urls import path
from .views import register
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', register),
    path('login/', TokenObtainPairView.as_view()),
]
