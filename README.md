# SkyGuard AI – Flight Delay Prediction System

## Overview
SkyGuard AI is a machine learning–based system designed to predict potential flight delays using historical flight data and weather conditions. The system analyzes multiple operational and environmental factors to generate delay predictions and provide insights that help users anticipate disruptions in flight schedules.

## Features
- Flight delay prediction using machine learning models  
- Integration of weather data for improved prediction accuracy  
- Real-time prediction interface through a web-based application  
- Explainable AI insights and recommendations  
- Airport risk insights and delay analysis  

## Technologies Used
- **Frontend:** React  
- **Backend:** Python (FastAPI)  
- **Database:** PostgreSQL  
- **Machine Learning:** Scikit-learn, LGBM  
- **Data Sources:** FlightRadar24, Open-Meteo API 


## Project Structure
frontend/        - Web application interface
backend/         - API and backend services
models/          - Trained machine learning models

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/MashiAma/FilghtDelayPredictor.git
cd FilghtDelayPredictor

2. Backend setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

3. Frontend setup
cd frontend
npm install
npm run dev
```

Usage

Start the backend server.

Start the frontend application.

Access the web interface in your browser to generate flight delay predictions.

Project Purpose

This project was developed as part of an undergraduate research project to explore the application of machine learning techniques in predicting flight delays and improving travel planning.

Author

Amashi Costa