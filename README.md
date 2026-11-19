# CIS 3339 Homework 1

A full-stack student and course management application built with Vue 3, Pinia, Express, and MongoDB.

## Features
- Add, search, and delete students
- Prevent duplicate student IDs
- Add, view, and delete courses
- Prevent duplicate course IDs
- Enroll students in courses
- Prevent duplicate enrollments
- View enrolled students by course
- Remove related enrollments when a student or course is deleted

## Requirements
- Node.js and npm
- MongoDB Community Server running locally

## Setup

1. Start your local MongoDB server.
2. Install backend dependencies:

   cd backend
   npm install

3. Install frontend dependencies:

   cd ../vue-app
   npm install

4. Build the frontend:

   npm run build

5. Start the backend:

   cd ../backend
   npm start

6. Open http://localhost:3000

The backend uses the MongoDB connection configured in backend/.env.
