"""
URL configuration for user_service project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from user_management.views import *
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r"recipes", RecipeViewSet)
router.register(r"tutorials", TutorialViewSet)
router.register(r"blogs", BlogViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/register", register),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/profile/<int:pk>/", UserProfileDetail.as_view(), name="user-profile"),
    path("api/", include(router.urls)),
    # Recipe, tutorial, and blog endpoints
    path("api/recipes/add", add_recipe, name="add_recipe"),
    path("api/tutorials/add", add_tutorial, name="add_tutorial"),
    path("api/blogs/add", add_blog, name="add_blog"),
    # Authentication check endpoint
    path("api/auth/check", check_auth, name="check_auth"),
    path(
        "api/recipes/<int:pk>",
        RecipeDetailAPIView.as_view(),
        name="recipe-detail",
    ),
    path(
        "api/tutorials/<int:tutorial_id>",
        TutorialDetailAPIView.as_view(),
        name="tutorial-detail",
    ),
    path("api/blogs/<int:blog_id>", BlogDetailAPIView.as_view(), name="blog-detail"),
    path("api/profile/user/<int:user_id>/", get_user_profile, name="get_user_profile"),
    path(
        "api/profile/edit/<int:profile_id>/",
        update_user_profile,
        name="update_user_profile",
    ),
    # delete endpoints
    path("api/delete/recipe/<int:pk>/", delete_recipe),
    path("api/delete/tutorial/<int:pk>/", delete_tutorial),
    path("api/delete/blog/<int:pk>/", delete_blog),
    path("api/edit/recipe/<int:pk>/", edit_recipe, name="edit_recipe"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
