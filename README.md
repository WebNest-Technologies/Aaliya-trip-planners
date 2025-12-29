# Aaliya Trip Planners

Aaliya Trip Planners is a full-stack travel booking and enquiry management web application developed to manage tour packages, vehicle bookings, and customer enquiries through a modern public website and a secure admin dashboard.

This project is built for real-world business operations with a focus on performance, usability, and centralized control.

---

## Application Overview

### Public Website

* Browse tour packages (Couple, Family, Group, etc.)
* Submit trip enquiries
* Vehicle booking with location validation
* Dynamic customer reviews
* Fully responsive, mobile-first design

### Admin Dashboard

* Enquiry analytics with visual charts
* Filter enquiries by status, date, and category
* Export enquiry data to Excel
* Manage packages, offers, vehicles, and reviews
* Secure admin authentication using JWT

---

## Technology Stack

* Backend: Node.js, Express.js
* Database: MongoDB (Mongoose)
* Frontend: HTML5, CSS3, JavaScript (ES6)
* Authentication: JSON Web Tokens (JWT)

---

## Project Structure

```text
├── public/
│   ├── admin/           # Admin dashboard UI
│   ├── css/             # Stylesheets
│   └── js/              # Client-side logic
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Authentication & error handling
│   ├── models/          # MongoDB schemas
│   └── routes/          # API routes
├── seedData.js          # Initial data seeding
└── server.js            # Application entry point
```

---

## Installation & Setup (Internal Use)

This section is intended for authorized developers only.

1. Clone the repository

```bash
git clone https://github.com/WebNest-Technologies/Aaliya-trip-planners.git
cd Aaliya-trip-planners
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables
   Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. (Optional) Seed initial data

```bash
node seedData.js
```

5. Start the server

```bash
npm start
```

---

## Access Points

* Public Website: [http://localhost:3000](http://localhost:3000)
* Admin Panel: [http://localhost:3000/admin/dashboard.html](http://localhost:3000/admin/dashboard.html)

---

## Notes

* This repository is private and access-controlled
* Not intended for public contribution
* All changes are managed internally by the development team

---

## Ownership

Client: Aaliya Trip Planners
Developed and Maintained by: We
