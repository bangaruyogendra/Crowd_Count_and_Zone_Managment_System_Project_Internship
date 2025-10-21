import base64
import json
import cv2
import numpy as np
from channels.generic.websocket import AsyncWebsocketConsumer
from ultralytics import YOLO

# Here Load YOLO model once globally
model = YOLO('yolov8n.pt')

class VideoStream(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        print("WebSocket connected")

    async def disconnect(self, close_code):
        print("WebSocket disconnected")

    async def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            return
        
        #text_data will be like {"frame": "data:image/jpeg;base64,/9j/4AAQSk..."}
        data_to_dict = json.loads(text_data)
        
        
        frame_b64 = data_to_dict.get("frame")
        # frame_b64 = "data:image/jpeg;base64,/9j/4AAQSk..."

    
        img_bytes = base64.b64decode(frame_b64.split(",")[1])
        # after decoding frame this output will be like this /9j/4AAQSk... and convert into some bytes
        
        img_np_to_1D = np.frombuffer(img_bytes, np.uint8)
        # frame bytes will converted to something like this [255, 216, 255, ..., 217]
        
        frame_3d = cv2.imdecode(img_np_to_1D, cv2.IMREAD_COLOR)
        #this will convert 1D to 3D NumPy array (height × width × 3 color channels) -> [12, 45, 78]

        # Run YOLO detection
        results = model(frame_3d, verbose=False)
        detections = []
        
        # this results should be like this [ [100.0, 50.0,.......0,],[],[] ]
        for result in results[0].boxes.data.tolist():
            x1, y1, x2, y2, score, class_id = result
            label = model.names[int(class_id)]
            if label == "person":
                detections.append({
                    "bbox": [x1, y1, x2, y2],
                    "confidence": float(score)
                })

        await self.send(json.dumps({
            "people_count": len(detections),
            "detections": detections
        }))
