
```md
# 🌊 FlowAI – Trend Analysis & Insights Platform

FlowAI is a **full-stack web application** designed to analyze trends, generate insights, and help users make data-driven decisions.  
The platform uses **React for the frontend**, **Node.js & Express for the backend**, **MongoDB for data storage**, and **Auth0 for secure authentication**.

---

## Features

- Trend discovery and analytics
- Secure authentication using Auth0
- MongoDB for scalable data storage
- Clean frontend–backend separation
- API-ready architecture (Google Trends, X API, Gemini, etc.)
- Responsive and modern UI
- Production-ready project structure

---

##  Tech Stack

### Frontend
- React 18
- Vite
- JavaScript (ES6+)
- CSS / Tailwind CSS
- Auth0 React SDK

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Auth0 (JWT validation & user identity)
- REST APIs

### Database
- MongoDB Atlas (Cloud Database)

---

## 📂 Project Structure

```bash
FlowAI/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── server.js
│   ├── package.json
│   └── .env
│
└── README.md

````

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/FlowAI.git
cd FlowAI
````

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

### 3️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

---

## 🔐 Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_API_BASE_URL=http://localhost:5000
```

---

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=your-mongodb-connection-string
AUTH0_DOMAIN=your-auth0-domain
AUTH0_AUDIENCE=your-api-audience
```

⚠️ **Do not commit `.env` files to GitHub**

---

## 🔑 Authentication (Auth0)

FlowAI uses **Auth0** for authentication and authorization.

### Required Auth0 Settings

Add the following URLs in Auth0 Dashboard:

**Allowed Callback URLs**

```
http://localhost:5173
https://your-production-domain.com
```

**Allowed Logout URLs**

```
http://localhost:5173
https://your-production-domain.com
```

**Allowed Web Origins**

```
http://localhost:5173
https://your-production-domain.com
```

---

## 🗄️ Database (MongoDB)

* MongoDB Atlas is used for cloud database hosting
* Mongoose handles schema and data modeling
* Auth0 user ID is used to associate data with users

---

## Deployment

### Frontend

* Netlify

### Backend

* Render
* AWS / Azure / DigitalOcean

---

## Future Enhancements

* Google Trends integration
* X (Twitter) analytics
* AI-powered insights using Gemini
* Subscription & payment system
* Advanced dashboards
* Role-based access control

---

##  Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

##  Author

**FlowAI Team**
Built for scalable analytics, learning, and real-world applications.



## Images


<img width="1440" height="763" alt="Screenshot 2026-01-30 at 07 27 53" src="https://github.com/user-attachments/assets/0952e9de-8852-4acd-ab01-8d0f9e3ffa2a" />
<img width="1440" height="741" alt="Screenshot 2026-01-30 at 07 28 06" src="https://github.com/user-attachments/assets/2694fa6d-20e4-4933-b591-155b7ed1de8f" />
<img width="796" height="754" alt="Screenshot 2026-01-30 at 07 28 20" src="https://github.com/user-attachments/assets/f1e98146-11ee-4a1b-80cd-f8caa3754503" />
<img width="1440" height="724" alt="Screenshot 2026-01-30 at 07 28 41" src="https://github.com/user-attachments/assets/05c2b627-5003-4e47-8a09-dda137f5cb97" />
<img width="1440" height="769" alt="Screenshot 2026-01-30 at 07 28 57" src="https://github.com/user-attachments/assets/884d65f4-d27c-44aa-8e70-d2682c4f0f18" />
<img width="1440" height="775" alt="Screenshot 2026-01-30 at 07 29 13" src="https://github.com/user-attachments/assets/8572befe-cd35-45bb-80b0-3144cd241004" />
<img width="1440" height="744" alt="Screenshot 2026-01-30 at 07 29 27" src="https://github.com/user-attachments/assets/bbfb02dc-af5e-4e37-b53c-db55c0a43e9c" />
<img width="1440" height="772" alt="Screenshot 2026-01-30 at 07 29 34" src="https://github.com/user-attachments/assets/1fdc08e2-caf0-40ac-ace1-6a7d56cfae1d" />
<img width="1440" height="773" alt="Screenshot 2026-01-30 at 07 29 43" src="https://github.com/user-attachments/assets/17947554-b46b-41e7-8caf-0ca20cbde037" />
<img width="1440" height="767" alt="Screenshot 2026-01-30 at 07 29 55" src="https://github.com/user-attachments/assets/71584772-1983-4497-a498-d556a07ed98d" />
<img width="1440" height="660" alt="Screenshot 2026-01-30 at 07 30 05" src="https://github.com/user-attachments/assets/a002cf64-3930-4507-bf9a-2dfe56278500" />
<img width="1440" height="773" alt="Screenshot 2026-01-30 at 07 30 13" src="https://github.com/user-attachments/assets/c9426372-f9dc-4e2c-aab8-64269b0d3a80" />
<img width="1440" height="779" alt="Screenshot 2026-01-30 at 07 30 34" src="https://github.com/user-attachments/assets/7017736b-3e96-49fb-8e2f-5182ce6a4a28" />
<img width="1440" height="725" alt="Screenshot 2026-01-30 at 07 30 45" src="https://github.com/user-attachments/assets/9a6f0cf0-1ef2-47cf-9b8d-1d4b8c07f2fb" />











