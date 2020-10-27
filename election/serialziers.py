from rest_framework import serializers
from .models import Election, Candidate


class ElectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = '__all__'

    def create(self, validated_date):
        return Election(**validated_date)


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = '__all__'

    def create(self, validated_date):
        return Election(**validated_date)
