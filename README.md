# 🍬 Sugar & Gold – Premium Sweet Shop E-Commerce Platform

A **modern full-stack e-commerce platform** designed to deliver a premium online sweet shop experience.  
**Sugar & Gold** combines a clean, high-end customer interface with a powerful **administrative backend** for seamless **inventory, pricing, and order management**.

This project demonstrates **real-world full-stack engineering**, including authentication, order processing, stock management, and admin-level product control.

---
## Demo 
### 👤 Customer / User Website

Watch demo --> (https://drive.google.com/file/d/14ZQksBYZLGLFKtoj-0Cg3K-iEx_rJbjR/view?usp=sharing)

This demo shows:
- Browsing sweets and gift boxes
- Adding items to cart
- Checkout flow
- Order confirmation with QR code
- Order tracking

---

### 🛠️ Admin Dashboard

Watch demo --> (https://drive.google.com/file/d/1qYyxlhEa8bVAUt0_4dINd2WCE6erSWYW/view?usp=sharing)

This demo shows:
- Admin authentication
- Product management (CRUD)
- Stock management
- Price updates
- Order management dashboard

---


# 🚀 Features

## 🔐 Authentication
- JWT-based authentication for secure user sessions
- Cookie-based session handling
- Mock OTP login flow for a user-friendly login experience
- Separate **customer and admin access control**

---

## 🛠️ Admin Dashboard
A dedicated dashboard for managing the store efficiently.

### Product Management
- Full **CRUD operations** for sweets and gift boxes
- Add, update, or remove products easily

### Dynamic Pricing
- Instantly update product prices
- Manage **discount coupons and offers**

### Order Oversight
- View all customer orders
- Update order status
- Track order lifecycle

---

## 📦 Stock Management
Real-time inventory control to prevent overselling.

- Automatic **stock reduction when an order is placed**
- Supports different units:
  - **KG-based inventory** for sweets
  - **Unit-based inventory** for gift boxes
- Visual alerts for **low stock or out-of-stock items**

---

## 🚚 Order Tracking
Customers can easily track their orders.

- Real-time **order status tracking**
- Order confirmation page
- **Dynamic QR code generation** for pickup verification
- Order lifecycle tracking from **placement → processing → delivery**

---

## ✨ Clean UI
A premium user interface designed for a luxury sweet shop experience.

- Modern UI built with **Tailwind CSS**
- Smooth animations using **Framer Motion**
- Fully **responsive design** (mobile, tablet, desktop)
- Clean and minimal design system

---

# 🛠️ Tech Stack

## Frontend

- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router DOM 7
- **Utilities:** Axios, React QR Code

---

## Backend

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB (Mongoose)
- **Authentication:** JSON Web Token (JWT)
- **Security:** Cookie Parser
- **Environment Management:** Dotenv


--- 

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/sugar-and-gold.git
```

## 2️⃣ Install Dependencies
#### Frontend: 
cd client
npm install
npm run dev
#### Backend:
cd server
npm install
npm run dev


## 3️⃣ Environment Variables

- Create a .env file inside the server folder.

PORT=5000  
MONGO_URI=your_mongodb_connection  
JWT_SECRET=your_jwt_secret  

---

## 🔮 Future Improvements
#### 💳 Payment Integration
- Integrate real-time payment gateways such as:  
Razorpay  
Stripe  

#### 🌐 Production Deployment
Frontend: AWS S3/Vercel   
Backend: Render / AWS Lambda or EC2 / Railway  
Database: MongoDB Atlas  


#### 📧 Email Notifications  
Automated order confirmation emails  
Shipping and delivery notifications  
Integration with SendGrid or Nodemailer  

#### 📊 Analytics Dashboard
Track sales and revenue  
Customer purchase insights  


## 🧠 Learning Outcomes
- Through this project, I implemented:

Full-stack application architecture

REST API development

Secure authentication using JWT

State management in React

Database schema design with MongoDB

Real-time inventory updates

Admin dashboard development

Modern responsive UI design



--- 

👨‍💻 Author

Saumay Gupta

If you like this project, feel free to ⭐ the repository.
