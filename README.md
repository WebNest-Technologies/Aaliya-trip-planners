# Aaliya Trip Planners 🌍✈️

Aaliya Trip Planners is a comprehensive travel and booking management web application built with **Node.js**, **Express**, and **MongoDB**. It features a dynamic public-facing website for booking trip packages and vehicles, alongside a robust admin dashboard for managing enquiries, bookings, and site content.

## 🚀 Features

### **Public User Interface**
*   **Trip Packages**: Browse and book various travel packages (Couple, Family, etc.) with dynamic offer displays.
*   **Vehicle Booking**: Integrated booking system with **Location Validation** (restricted to Dindigul & Madurai).
*   **Dynamic Reviews**: Real-time customer reviews fetched from the database.
*   **Responsive Design**: A premium, mobile-responsive UI built with modern CSS.

### **Admin Dashboard**
*   **Analytics**: Visual charts for Enquiry Growth, Enquiry Types, and Status Distribution.
*   **Enquiry Management**: 
    *   **Advanced Filtering**: Filter enquiries by status, date, and type.
    *   **Excel Export**: Download enquiry data for offline analysis.
*   **Content Management**: Manage Packages, Offers, and Vehicles directly from the panel.
*   **Profile Management**: Update owner details and admin credentials securely.

## 🛠️ Tech Stack

*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Frontend**: HTML5, Vanilla CSS3 (Custom Architecture), JavaScript (ES6+)
*   **Authentication**: JWT (JSON Web Tokens)

## 📂 Project Structure

```text
├── public/              # Static frontend assets (HTML, CSS, Client-side JS)
│   ├── admin/           # Admin dashboard HTML
│   ├── css/             # Stylesheets (admin.css, style.css)
│   └── js/              # Client logic (main.js, admin.js)
├── src/                 # Backend source code
│   ├── config/          # Database configuration
│   ├── controllers/     # Application logic (Admin, Auth, Enquiry, Public)
│   ├── middleware/      # Auth and error handling middleware
│   ├── models/          # Mongoose Schemas (Enquiry, Package, etc.)
│   └── routes/          # API Route definitions
├── seedData.js          # Database seeding script
└── server.js            # Entry point
```

## 🔧 Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/aaliya-trip-planners.git
    cd aaliya-trip-planners
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4.  **Seed the Database** (Optional, for initial data)
    ```bash
    node seedData.js
    ```

5.  **Run the Server**
    ```bash
    npm start
    # or for development
    npm run dev
    ```

6.  **Access the App**
    *   Public Site: `http://localhost:3000`
    *   Admin Panel: `http://localhost:3000/admin/dashboard.html`

## 📝 API Documentation

The backend exposes several RESTful endpoints:

*   **Public**: `/api/public` (Fetch packages, reviews)
*   **Admin**: `/api/admin` (Manage bookings, content)
*   **Auth**: `/api/auth` (Login, Register)
*   **Enquiry**: `/api/enquiry` (Submit and manage enquiries)

## 🤝 Contributing

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---
*Maintained by Aaliya Trip Planners Dev Team*
