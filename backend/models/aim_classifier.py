import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np

class AimInstabilityNet(nn.Module):
    def __init__(self, input_size=10, hidden_size=32):
        super(AimInstabilityNet, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_size, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        out = self.fc1(x)
        out = self.relu(out)
        out = self.fc2(out)
        out = self.sigmoid(out)
        return out

class MLManager:
    def __init__(self):
        self.model = AimInstabilityNet()
        self.optimizer = optim.Adam(self.model.parameters(), lr=0.001)
        self.criterion = nn.BCELoss()
        self.model.eval() # Set to evaluation mode initially

    def predict_instability(self, features):
        """
        Features should be a list/array of 10 metrics:
        [avg_velocity, std_velocity, max_velocity, overshoot_count, 
         avg_dx, avg_dy, std_dx, std_dy, movement_frequency, time_jitter]
        """
        with torch.no_grad():
            tensor_features = torch.FloatTensor(features).unsqueeze(0)
            prediction = self.model(tensor_features)
            return prediction.item()

    def train_step(self, features, label):
        self.model.train()
        self.optimizer.zero_grad()
        tensor_features = torch.FloatTensor(features).unsqueeze(0)
        tensor_label = torch.FloatTensor([label]).unsqueeze(0)
        
        output = self.model(tensor_features)
        loss = self.criterion(output, tensor_label)
        loss.backward()
        self.optimizer.step()
        self.model.eval()
        return loss.item()

if __name__ == "__main__":
    manager = MLManager()
    # Dummy test
    test_features = [100.0, 20.0, 500.0, 2.0, 10.0, 10.0, 5.0, 5.0, 60.0, 0.01]
    print(f"Instability Prediction: {manager.predict_instability(test_features):.4f}")
