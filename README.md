<h1 align="center">🌍 Wanderlust - Travel Explorer App</h1>

<p align="center">
  <i>A full-stack travel destination app built to explore, review, and share your travel experiences.</i><br>
  <br>
  🌐 Live URL: <a href="[](https://wanderlust-5-qnnb.onrender.com/listings)">Click here to visit</a> <br>
  📦 GitHub Repo: <a href="https://github.com/golugovaskar/WANDERLUST">WANDERLUST</a>
</p>

---

## ✨ Features

- 🧭 Search and explore popular travel destinations
- 📝 Add reviews, comments, and photos
- 🗺️ Integrated with Google Maps API for geo-locations
- 🔐 Secure user authentication and authorization
- 📸 Image uploads with Cloudinary
- 📄 Fully responsive frontend using HTML, CSS, and JS

---

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Responsive UI with custom styling

### Backend
- Node.js, Express.js
- MongoDB Atlas for database
- Mongoose ODM

### Other Integrations
- Google Maps API
- Render (for deployment)

---

## 📁 Folder Structure
WANDERLUST/
│
├── Public/ # Static assets (HTML, CSS, JS)
│ ├── CSS/
│ ├── JS/
│ └── images/
│
├── models/ # Mongoose models (User, Post, etc.)
├── routes/ # Express routes
├── controllers/ # Route logic
├── uploads/ # Uploaded images
├── app.js # Entry point
└── .env # Environment variables



---

## 🚀 Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB Atlas URI
- Google Maps API key

### Installation

```bash
git clone https://github.com/golugovaskar/WANDERLUST
cd WANDERLUST
npm install
Setup Environment Variables
Create a .env file in the root directory and add:

###Setup Environment Variables
Create a .env file in the root directory and add:

MONGODB_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MAP_API_KEY=your_google_maps_key

