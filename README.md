
# 📄 Log Analyzer
 
A modern web-based tool for analyzing log files with multi-file support, drag & drop, session history, and a clean responsive UI.

 
---
 
### 🚀 Overview
 
Log Analyzer is a full-stack application designed to analyze log files quickly and efficiently.
Users can upload multiple files, drag & drop them, or paste text directly into the analyzer.
Each analysis can be saved as a session and later viewed through the built-in session history panel.
 
The goal of the project is to offer a clean, modern and highly user-friendly log analysis tool usable both locally and publicly.
 
 
---
 
## ✨ Features
 
### 🔍 Log Analysis
 
Parses plain text logs dynamically
 
Clean and structured outputs
 
Supports large files
 
One table per file for better readability
 
 
### 📂 File Upload
 
Drag & drop zone
 
Multi-file selection
 
File list preview
 
Works with .log, .txt, and any plain text format
 
 
### 📝 Text Input Mode
 
Paste raw log text directly
 
Analyze instantly
 
 
### 💾 Session History
 
Automatic session saving
 
View all past sessions
 
Uses JPA & H2 database
 
 
### 🎨 Modern UI
 
Responsive English-based interface
 
Left side: session history
 
Center: input + analysis
 
Right or below: uploaded file list
 
Smooth and visually clean layout
 

---
 
### 🏗️ Project Structure
 ```
backend/
├── controller/
│    └── LogController.java
├── model/
│    ├── LogEntry.java
│    └── AnalysisSession.java
├── parser/
│    └── LogParser.java
├── repository/
│    └── AnalysisSessionRepository.java
└── LogAnalyzerApplication.java
  ```
   ```
frontend/
├── index.html
├── styles
│    └──style.css
└── js
        └──script.js
  ```
 
---
 
### 🛠️ Technologies Used
 
#### Backend
 
Java 21
 
Spring Boot 3.4
 
Spring Web
 
Spring Data JPA
 
Jakarta Persistence
 
H2 Database
 
#### Frontend
 
HTML5
 
Modern CSS
 
Vanilla JavaScript
 
Drag & Drop API

---
 
### 🔌 API Endpoints
 
Method Endpoint Description
 
POST /logs/analyze-text Analyze pasted text
POST /logs/analyze-file Analyze uploaded file
POST /logs/save-session Save an analysis session
GET /logs/sessions Retrieve all saved sessions
 
 
 
---
 
# 🏁 Running the Project
 
### ▶️ Backend (Spring Boot)
 
cd backend
mvn spring-boot:run
 
Runs on:
👉 http://localhost:8081
 
### ▶️ Frontend
 
Just open the file:
 
frontend/index.html
 
(Optional) Use a live server for best results.
 
 
---
 
### 🔮 Future Improvements
 
Dark/Light mode
 
Searching inside parsed logs
 
Export analysis as CSV / PDF
 
User authentication
 
File type filters
 
AI-assisted log suggestions
 
Full admin dashboard
 
 
 
---
 
### 📜 License
 
This project is released under the MIT License — free for commercial and personal use.
 
 
---
 
### 🤝 Contributing
 
Pull requests and feature suggestions are welcome!
 
 
---
 
### 🧠 Author
 
Giovanni Angileri  [kontakt](https://giovyangy.github.io/Lebenlauf/index.html#kontakt) 
