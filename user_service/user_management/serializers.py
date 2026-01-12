from rest_framework import serializers
from user_management.models import *


class JuizUserSerializer(serializers.ModelSerializer):
    user = serializers.IntegerField(source="user.id", read_only=True)

    class Meta:
        model = JuizUser
        fields = ["id", "user", "email", "full_name", "bio", "profile_image", "tel"]


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = "__all__"
        extra_kwargs = {
            "image": {"required": False, "allow_null": True},
        }


class TutorialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tutorial
        fields = "__all__"


class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = "__all__"
