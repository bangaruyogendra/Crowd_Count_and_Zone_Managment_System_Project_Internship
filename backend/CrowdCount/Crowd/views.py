from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


# Create your views here.
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if User.objects.filter(username = username).exists():
        return Response({'error':'username already exists'},status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username,email =email,password =password)
    return Response({'message':'user successfully created'},status = status.HTTP_201_CREATED)
    
@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user is not None:
        return Response({'message': 'Login successful', 'username': user.username})
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    
    
def home(request):
    template = loader.get_template("home.html")
    return HttpResponse(template.render())
