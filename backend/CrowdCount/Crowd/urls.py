from django.urls import path
from . import views
from .views import DetectPeopleView
from .views import VideoUploadView,profile
from .views import ForgotPasswordView, ResetPasswordView


urlpatterns = [
    path('',views.home,name = 'home'),
    path('api/register/', views.register_user, name='register'),
    path('api/login/', views.login_user, name='login'),
    path('detect/', DetectPeopleView.as_view(), name='detect'),
    path('userDetails/',views.user_details,name = 'user_details'),
    path("api/upload/", VideoUploadView.as_view(), name="upload"),
    path("profile/",profile,name="profile"),
    path('detectValues/', views.detect, name='detect'),
    path("api/password-reset/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("api/reset-password/<uidb64>/<token>/", ResetPasswordView.as_view(), name="reset-password"),

    
     
]