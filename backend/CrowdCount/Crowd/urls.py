from django.urls import path
from . import views
from .views import DetectPeopleView
from .views import VideoUploadView,profile


urlpatterns = [
    path('',views.home,name = 'home'),
    path('api/register/', views.register_user, name='register'),
    path('api/login/', views.login_user, name='login'),
    path('detect/', DetectPeopleView.as_view(), name='detect'),
    path('userDetails/',views.user_details,name = 'user_details'),
    path("api/upload/", VideoUploadView.as_view(), name="upload"),
    path("profile/",profile,name="profile"),
]