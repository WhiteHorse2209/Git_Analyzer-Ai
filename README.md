# GitAnalyzer AI

GitAnalyzer AI is a high-performance, professional-grade repository analysis tool. It allows developers to clone any GitHub repository and instantly interact with its codebase using advanced **Retrieval-Augmented Generation (RAG)** powered by 100% free AI models.

Created By **SHAIK JAHEER AHMED**

## 🚀 Features

- **Advanced RAG Engine**: Deep repository analysis indexing up to 5,000 code chunks.
- **Expert AI Insights**: Functions as a Senior Codebase Architect, providing implementation details, architectural flows, and functional explanations.
- **100% Free AI**: Integrated with OpenRouter's best free models (Qwen, Gemini, DeepSeek) with automatic fallback.
- **Secure Authentication**: Full Login and Sign-Up system powered by MongoDB and JWT.
- **Analysis History**: Automatically saves your analyzed repositories to your personalized account dashboard.
- **Modern UI**: Clean, responsive, and animated interface built with Next.js 16 and Tailwind CSS 4.
- **Fast Indexing**: Optimized batch processing and smart file filtering for rapid codebase setup.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, Lucide React, React Hot Toast.
- **Backend**: FastAPI (Python), Uvicorn.
- **Database**: MongoDB (User data & history), ChromaDB (Vector database for RAG).
- **AI Engine**: OpenRouter (Free Tier Models).

## 📋 Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **MongoDB** (Running locally or on Atlas)
- **OpenRouter API Key** (Get it free at [openrouter.ai](https://openrouter.ai/))

## ⚙️ Installation & Setup

### 1. Clone the Project
```bash
git clone https://github.com/WhiteHorse2209/Git_Analyzer-Ai.git
cd Git_Analyzer-Ai
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder:
```env
MONGO_URL=mongodb://localhost:27017
DATABASE_NAME=gitanalyzer
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_key
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start the Backend
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

### Start the Frontend
```bash
cd frontend
npm run dev -- --port 3001
```

Access the app at: **[http://localhost:3001](http://localhost:3001)**

## 🤝 Contact

**SHAIK JAHEER AHMED**  
[LinkedIn](https://linkedin.com) | [GitHub](https://github.com/WhiteHorse2209) | [Email](mailto:jaheer@example.com)

---
© 2026 GitAnalyzer AI. Empowering developers with AI-driven insights.
