from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Election(models.Model):
    address = models.CharField(max_length=50, unique=True)
    admin = models.ForeignKey(to=User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    start = models.DateTimeField()
    end = models.DateTimeField()
    created = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=300)
    image = models.ImageField(upload_to='election', blank=True, null=True)


class Candidate(models.Model):
    address = models.CharField(max_length=50)
    election = models.ForeignKey(to=Election, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='candidate', blank=True, null=True)
    name = models.CharField(max_length=50)
    created = models.DateTimeField(auto_now_add=True)
