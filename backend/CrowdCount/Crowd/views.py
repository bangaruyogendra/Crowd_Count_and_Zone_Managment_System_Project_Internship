from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login
from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView
from django.core.files.storage import default_storage
from ultralytics import YOLO
from django.http import FileResponse
import cv2,os,tempfile,time
import numpy as np
from pathlib import Path
from django.utils import timezone
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from PIL import Image
import io

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
        
        login(request, user)
        
        request.session['login_time'] = timezone.now().isoformat()
        
        return Response({
            
        'message': 'User Logon Successful',
        
        'username': username,
        
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
    users = User.objects.filter(is_active=True).values()
    # user = users.username
    # email = users.email
    # status = users.is_active
    return Response({"users":users},status=status.HTTP_200_OK)

@api_view(['GET'])
def profile(request):
    
    
    return Response({"message":"Profile Details"},status=status.HTTP_200_OK)


class VideoUploadView(APIView):
    def post(self, request, *args, **kwargs):
        video_file = request.FILES.get("video_file")
        if not video_file:
            return Response({"error": "No video uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        # Save uploaded video temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_file:
            for chunk in video_file.chunks():
                temp_file.write(chunk)
            input_path = temp_file.name

        # Load YOLO model
        model = YOLO("yolov8n.pt")

        # Use stream=True for frame-by-frame
        results = model.predict(source=input_path, stream=True, verbose=False)

        total_people = 0
        frame_num = 0
        frame_limit = 5

        # Loop through results and stop after frame_limit
        for r in results:
            frame_num += 1
            if frame_num > frame_limit:
                break

            for box in r.boxes:
                if int(box.cls[0]) == 0:
                    total_people += 1

    
        time.sleep(1)

        
        try:
            os.remove(input_path)
        except PermissionError:
            print(f" Skipping file delete; still in use: {input_path}")

        # Return JSON response
        return Response(
            {
                "total_people": total_people,
                "frames_processed": frame_num,
                "message": f"People counted from first {frame_limit} frames successfully"
            },
            status=status.HTTP_200_OK
        )
        
        
        
@csrf_exempt
def detect(request):
    if request.method == "POST":
        image_file = request.FILES.get("image")
        if not image_file:
            return JsonResponse({"error": "No image provided"}, status=400)

        # Simulate AI detection (e.g. YOLOv8)
        people_count = 3  # For demo, hardcoded

        # Save image or modify it before sending back
        img = Image.open(image_file)
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG")
        buffer.seek(0)

        response = HttpResponse(buffer.getvalue(), content_type="image/jpeg")
        response["peoplecount"] = people_count
        return response

    return JsonResponse({"error": "Invalid request"}, status=400)




