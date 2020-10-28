from rest_framework import serializers
from .models import Election, Candidate
from rest_framework.fields import CurrentUserDefault


class ElectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Election
        fields = '__all__'

    def create(self, validated_date):
        return Election.objects.create(**validated_date)

    def update(self, instance, validated_data):
        instance.start = validated_data.get("start", instance.start)
        instance.description = validated_data.get(
            "description",
            instance.description
        )
        instance.image = validated_data.get("image", instance.image)
        instance.save()
        return instance


class CandidateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Candidate
        fields = '__all__'

    def create(self, validated_date):
        return Election.objects.create(**validated_date)
