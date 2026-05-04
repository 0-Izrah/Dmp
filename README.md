# Photo Dump & Gallery App

A full-stack web application that allows users to create rooms, manage photo dumps, upload photos, and view them in a gallery format.

## 🚀 Tech Stack

### Frontend
- React (bootstrapped with Vite)
- Standard CSS for styling
- Custom hooks for data fetching (`useDumps`, `usePhotos`, `useRooms`, etc.)

### Backend
- Node.js & Express.js
- MongoDB (Mongoose models for `Room`, `Photo`, `Dump`, `AdminDevice`)
- Cloudinary integration for image hosting and storage

## 📂 Project Structure

- `/frontend` - Contains the React Vite application.
- `/backend` - Contains the Express server, API routes, models, and Cloudinary configuration.

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js and MongoDB installed on your system. You will also need a Cloudinary account for photo uploads.

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with your environment variables (e.g., MongoDB URI, Cloudinary credentials, Auth secrets).
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## ✨ Features
- **Rooms & Dumps:** Organize shared collections by specific rooms or dumps.
- **Photo Upload:** Upload images directly to Cloudinary.
- **Gallery View:** Browse uploaded photos with an integrated Swiper and grid view layout.
- **Management Dashboard:** Manage uploaded dumps, stats, and configurations.
