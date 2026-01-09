# Event Tracker

A modern event management platform that enables users to discover, create, and manage events with integrated ticketing, payments, and notifications.

🌐 **Live Demo:** [https://event-tracker-frontend-l8ve.onrender.com/](https://event-tracker-frontend-l8ve.onrender.com/)

## 🚀 Features

- **Event Discovery** - Search events by category, location, and date
- **Event Management** - Create and manage events with admin dashboard
- **Ticketing System** - Secure ticket booking with Razorpay integration
- **User Profiles** - Personalized experience with event history
- **Notifications** - Email notifications for bookings and updates
- **Ticket Resale** - Resell tickets through the platform
- **Interactive Maps** - Event location visualization

## 🛠️ Tech Stack

**Frontend:** React.js, Tailwind CSS, Vite  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Payment:** Razorpay  
**Authentication:** Firebase Auth  
**Email:** Brevo (SMTP)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Firebase project with Authentication enabled
- Razorpay account
- Brevo account for email services

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd event_tracker
```

### 2. Backend Setup

```bash
cd Backend/Categories
npm install
```

Create a `config.env` file in `Backend/Categories/data/` directory with the following variables:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_email
SMTP_PASS=your_brevo_password
BREVO_API_KEY=your_brevo_api_key
SMTP_SECURE=false
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PROJECT_ID=your_firebase_project_id
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Configure Firebase in `Frontend/src/Component/firebase.js` with your Firebase credentials.

Start the development server:
```bash
npm run dev
```

## 📁 Project Structure

```
event_tracker/
├── Backend/
│   └── Categories/
│       ├── Controllers/
│       ├── Models/
│       ├── Routes/
│       ├── Middleware/
│       ├── Config/
│       ├── data/
│       │   └── config.env (create this file)
│       └── server.js
└── Frontend/
    └── src/
        ├── Component/
        ├── Pages/
        ├── services/
        └── Style/
```

## 🔑 Environment Variables

All required environment variables are listed above in the **Backend Setup** section. Ensure you have:

- **MongoDB URI** - Database connection string
- **Razorpay Keys** - Payment gateway credentials
- **Brevo/SMTP** - Email service credentials
- **Firebase** - Authentication credentials

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

**Rijans Patoliya**  
Email: rijans.patoliya.cg@gmail.com  
LinkedIn: [rijans-patoliya](https://www.linkedin.com/in/rijans-patoliya/)

---

⭐ If you find this project helpful, please give it a star!
