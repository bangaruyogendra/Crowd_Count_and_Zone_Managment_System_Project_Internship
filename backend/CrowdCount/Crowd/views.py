from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView


from ultralytics import YOLO
import cv2
import numpy as np

model = YOLO('yolov8n.pt')


@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if User.objects.filter(username = username).exists():
        return Response({'error':'username already exists'},status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username,email =email,password =password)


    return Response({"message":"User Created Sucessfully",'username': user.username
    }, status=status.HTTP_201_CREATED)
    
@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        return Response({
        'message': 'User Logon Successful'
    }, status=status.HTTP_201_CREATED)
        
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
class DetectPeopleView(APIView):
    def post(self,request):
        file = request.FILES.get('image')
        if not file:
            return Response({"error":"No file Found"},status=status.HTTP_400_BAD_REQUEST)
        
        # frombuffer method useful for convert image files into raw pixel file
        np_img = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        
        results = model(img)
        
        peopleCount = 0
        for box in results[0].boxes:
            if int(box.cls[0]) == 0:
                peopleCount+=1
        
        #bounded image             
        annotated_img = results[0].plot()
        
        # encoding and converting into raw bytes
        _, buffer = cv2.imencode('.jpg', annotated_img)
        image_bytes = buffer.tobytes()
        
        response1 = HttpResponse(
           image_bytes,
           content_type="image/jpeg",
           headers={"PeopleCount": str(peopleCount),
                   "Access-Control-Expose-Headers": "PeopleCount"} 
        )
    
        return response1
    
@api_view(['GET'])  
def home(request):
    return Response({"message":"Welcome to CrowdCount Project"})

@api_view(['GET'])
def user_details(request):
    return Response({"message":"All User Details"})
