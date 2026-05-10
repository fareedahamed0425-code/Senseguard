import numpy as np
from collections import deque
import time
from models.aim_classifier import MLManager

class SensitivityAgent:
    def __init__(self, window_size=100):
        self.mouse_history = deque(maxlen=window_size)
        self.api_score = 100.0
        self.last_update = time.time()
        self.ml_manager = MLManager()
        self.instability_score = 0.0
        self.accuracy = 100.0
        
    def process_mouse_event(self, data):
        """
        Processes mouse events and updates the Aim Performance Index (API).
        API is based on movement smoothness, velocity variance, and micro-correction frequency.
        """
        self.mouse_history.append(data)
        
        if len(self.mouse_history) < 10:
            return self.api_score

        # Calculate metrics
        velocities = [e['velocity'] for e in self.mouse_history]
        deltas = [(e['dx'], e['dy']) for e in self.mouse_history]
        
        # 1. Smoothness (Velocity Variance)
        velocity_std = np.std(velocities)
        
        # 2. Overshoot Detection (Sharp direction changes)
        overshoots = 0
        for i in range(2, len(deltas)):
            v1 = np.array(deltas[i-1])
            v2 = np.array(deltas[i])
            # Dot product to check for sharp reversals
            if np.linalg.norm(v1) > 5 and np.linalg.norm(v2) > 5:
                angle = np.arccos(np.clip(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)), -1.0, 1.0))
                if angle > np.pi * 0.75: # Reversal > 135 degrees
                    overshoots += 1
        
        # 3. Stability Variance
        # Low API if velocity is erratic or overshoots are frequent
        penalty = (velocity_std * 0.1) + (overshoots * 5.0)
        new_score = max(0, min(100, 100 - penalty))
        
        # Exponential moving average for API
        self.api_score = self.api_score * 0.95 + new_score * 0.05

        # 4. ML Instability Prediction
        if len(self.mouse_history) >= 50:
            # Prepare 10 features for the ML model
            ml_features = [
                np.mean(velocities), 
                velocity_std, 
                np.max(velocities),
                overshoots,
                np.mean([d[0] for d in deltas]),
                np.mean([d[1] for d in deltas]),
                np.std([d[0] for d in deltas]),
                np.std([d[1] for d in deltas]),
                len(self.mouse_history) / (self.mouse_history[-1]['timestamp'] - self.mouse_history[0]['timestamp']),
                np.std(np.diff([e['timestamp'] for e in self.mouse_history])) if len(self.mouse_history) > 1 else 0
            ]
            self.instability_score = self.ml_manager.predict_instability(ml_features)

        # 5. Accuracy Calculation (Precision Score)
        # Based on linearity of movement and lack of micro-jitters
        if len(deltas) >= 5:
            # Calculate distance between start and end
            start_pos = (self.mouse_history[0]['x'], self.mouse_history[0]['y'])
            end_pos = (self.mouse_history[-1]['x'], self.mouse_history[-1]['y'])
            actual_dist = np.sqrt((end_pos[0]-start_pos[0])**2 + (end_pos[1]-start_pos[1])**2)
            
            # Calculate path length
            path_len = sum([np.sqrt(d[0]**2 + d[1]**2) for d in deltas])
            
            if path_len > 0:
                # Linearity: how straight was the movement
                linearity = actual_dist / path_len
                # Jitter: high frequency small movements
                jitter = np.mean([np.sqrt(d[0]**2 + d[1]**2) for d in deltas if np.sqrt(d[0]**2 + d[1]**2) < 2])
                
                accuracy_sample = (linearity * 100) - (jitter * 2)
                self.accuracy = self.accuracy * 0.98 + max(0, min(100, accuracy_sample)) * 0.02
        
        return self.api_score

    def get_recommendation(self):
        if self.api_score < 70:
            return "Sensitivity might be too high. Try lowering it by 5-10% to improve stability."
        elif self.api_score > 95:
            return "Aim is highly stable. Your sensitivity seems optimal."
        return "Aim stability is within normal range."
