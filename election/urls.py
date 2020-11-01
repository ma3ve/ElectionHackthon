from django.urls import path
from .views import create_election, get_election, get_elections, update_election
urlpatterns = [
    path('', get_elections),
    path('create/', create_election),
    path('update/', update_election),
    path('<int:id>/', get_election),
]
