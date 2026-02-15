# Raze AI 🤖

Raze AI is a powerful, multi-model AI chatbot platform designed for a seamless and interactive user experience. It features a modern, responsive frontend and a robust backend integration (coming soon).

## 🚀 Project Status
- **Frontend**: Fully functional static site. Optimized for independent deployment with mocked/placeholder API support.
- **Backend & Database**: Structure initialized and ready for deployment. Full integration and database persistence are planned for the next phase.

## 🛠️ Planned Architecture
The project is designed with a clear separation of concerns:
- **Frontend**: React + Vite + Tailwind CSS (Deployed on Vercel)
- **Backend**: Node.js / Spring Boot API (Deployed on Render)
- **Database**: PostgreSQL / MongoDB (Managed cloud instance)

## 🌐 Single Public URL Strategy (Planned)
To ensure a professional user experience:
1. **Frontend Deployment**: Hosted on Vercel.
2. **Backend Deployment**: Hosted on Render.
3. **Environment Security**: The frontend communicates with the backend via the `VITE_API_URL` environment variable.
4. **Visibility**: Users interact only with the frontend URL. The backend API URL remains hidden from public navigation, ensuring a clean and secure setup.

## 💻 Local Development

### Prerequisites
- Node.js (v18+)
- npm

### Running the Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (optional):
   ```env
   VITE_API_URL=http://localhost:8090
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Running the Backend (Coming Soon)
The backend is a Java/Gradle project located in the `backend` directory. 
To build the project:
```bash
cd backend
./gradlew build
```

## 🌿 Branch Strategy
- `main`: Stable releases.
- `dev`: Active development and integration.
- `feature/*`: New features and upcoming improvements.

---
Built with ❤️ by [Raseeth Anwer](https://github.com/RaseethAnwer)
