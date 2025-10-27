from django.contrib.auth.models import User
from rest_framework import serializers
from . import models
from .models import Video

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['video_file']
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only =True)
    
    class Meta:
        model = User,
        fields = ['username','email','password']
        
    def create(self,validate_data):
        user = User.objects.create_user(
            username = validate_data['username'],
            email = validate_data['email'],
            password = validate_data['password']
        )
        return user
    
    

        