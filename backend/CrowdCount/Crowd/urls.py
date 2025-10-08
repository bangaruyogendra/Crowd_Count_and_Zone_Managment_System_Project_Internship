from django.urls import path
from . import views

urlpatterns = [
    path('',views.home,name = 'home'),
    path('api/register/', views.register_user, name='register'),
    path('api/login/', views.login_user, name='login'),
    
]