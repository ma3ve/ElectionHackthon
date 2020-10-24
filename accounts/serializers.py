from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        try:
            user = User.objects.get(username=validated_data.get('username'))

        except User.DoesNotExist:
            if not "first_name" in validated_data:
                raise serializers.ValidationError({
                    'first_name': ['This field is required.']
                })
            if not "last_name" in validated_data:
                raise serializers.ValidationError({
                    'last_name': ['This field is required.']
                })
            user = User(
                username=validated_data['username'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name']
            )
            user.set_password(validated_data['password'])
            user.save()
            return user
