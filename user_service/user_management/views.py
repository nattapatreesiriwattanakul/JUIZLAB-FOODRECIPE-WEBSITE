# from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from django.contrib.auth.models import User
from user_management.models import *
from user_management.serializers import *

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404


@csrf_exempt
def register(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        try:
            new_user = User.objects.create_user(
                username=data["username"],
                email=data["email"],
                password=data["password"],
            )
        except:
            return JsonResponse({"error": "User already used"}, status=400)
        new_user.save()
        data["user"] = new_user.id
        serializer = JuizUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        new_user.delete()
        return JsonResponse({"error": "data not valid"}, status=400)
    return JsonResponse({"error": "method not allowed"}, status=405)


class UserProfileDetail(APIView):
    def get(self, request, pk):
        user = User.objects.get(pk=pk)
        if not user:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        recipes = Recipe.objects.filter(created_by=user)
        blogs = Blog.objects.filter(created_by=user)
        tutorials = Tutorial.objects.filter(created_by=user)

        return Response(
            {
                "user": JuizUserSerializer(user.juizuser).data,
                "recipes": RecipeSerializer(recipes, many=True).data,
                "blogs": BlogSerializer(blogs, many=True).data,
                "tutorials": TutorialSerializer(tutorials, many=True).data,
            }
        )


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all().order_by("-created_at")
    serializer_class = RecipeSerializer


class TutorialViewSet(viewsets.ModelViewSet):
    queryset = Tutorial.objects.all().order_by("-created_at")
    serializer_class = TutorialSerializer


class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all().order_by("-created_at")
    serializer_class = BlogSerializer


@api_view(["GET"])
def check_auth(request):
    if request.user.is_authenticated:
        return Response(
            {
                "authenticated": True,
                "username": request.user.username,
                "user_id": request.user.id,
            }
        )
    else:
        return Response({"authenticated": False}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_recipe(request):
    data = request.data.copy()  # Make a mutable copy of the data
    data["created_by"] = (
        request.user.id
    )  # Add the user ID from the authenticated session
    serializer = RecipeSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_tutorial(request):
    data = request.data.copy()  # Make a mutable copy of the data
    data["created_by"] = (
        request.user.id
    )  # Add the user ID from the authenticated session
    serializer = TutorialSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_blog(request):
    data = request.data.copy()  # Make a mutable copy of the data
    data["created_by"] = (
        request.user.id
    )  # Add the user ID from the authenticated session
    serializer = BlogSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def user_recipes(request, user_id):
    recipes = Recipe.objects.filter(created_by=user_id).order_by("-created_at")
    serializer = RecipeSerializer(recipes, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def user_tutorials(request, user_id):
    tutorials = Tutorial.objects.filter(created_by=user_id).order_by("-created_at")
    serializer = TutorialSerializer(tutorials, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def user_blogs(request, user_id):
    blogs = Blog.objects.filter(created_by=user_id).order_by("-created_at")
    serializer = BlogSerializer(blogs, many=True)
    return Response(serializer.data)


class RecipeDetailAPIView(APIView):
    def get(self, request, pk):
        recipe = get_object_or_404(Recipe, pk=pk)
        serializer = RecipeSerializer(recipe)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TutorialDetailAPIView(APIView):
    def get(self, request, pk):
        tutorial = get_object_or_404(Tutorial, pk=pk)
        serializer = TutorialSerializer(tutorial)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BlogDetailAPIView(APIView):
    def get(self, request, pk):
        blog = get_object_or_404(Blog, pk=pk)
        serializer = BlogSerializer(blog)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_profile(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        profile = user.juizuser
    except (User.DoesNotExist, JuizUser.DoesNotExist):
        return Response({"error": "User not found"}, status=404)

    serializer = JuizUserSerializer(profile)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_user_profile(request, profile_id):
    try:
        profile = JuizUser.objects.get(pk=profile_id)
    except JuizUser.DoesNotExist:
        return Response({"error": "Profile not found"}, status=404)

    if profile.user != request.user:
        return Response({"error": "Unauthorized"}, status=403)

    serializer = JuizUserSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_recipe(request, pk):
    try:
        recipe = Recipe.objects.get(pk=pk, created_by=request.user)
        recipe.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Recipe.DoesNotExist:
        return Response(
            {"error": "Not found or not authorized"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_tutorial(request, pk):
    try:
        tutorial = Tutorial.objects.get(pk=pk, created_by=request.user)
        tutorial.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Tutorial.DoesNotExist:
        return Response(
            {"error": "Not found or not authorized"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_blog(request, pk):
    try:
        blog = Blog.objects.get(pk=pk, created_by=request.user)
        blog.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Blog.DoesNotExist:
        return Response(
            {"error": "Not found or not authorized"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def edit_recipe(request, pk):
    try:
        recipe = Recipe.objects.get(pk=pk, created_by=request.user)
        data = request.data.copy()
        data["created_by"] = request.user.id

        serializer = RecipeSerializer(recipe, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Recipe.DoesNotExist:
        return Response(
            {"error": "Recipe not found or not authorized"},
            status=status.HTTP_404_NOT_FOUND,
        )
