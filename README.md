ConnectSphere 📸
A full-stack, feature-rich web application inspired by Instagram, built with the MERN stack (MongoDB, Express.js, React, Node.js). This project faithfully replicates Instagram’s core user experience, from its dynamic post feed to its real-time chat functionality using Socket.IO.

✨ Key Features
Authentication & Security: Secure user registration and login system using JWT (JSON Web Tokens) and httpOnly cookies for persistent sessions.

User Profiles: Customizable user profiles with profile pictures, bios, follower/following counts, and a grid of the user's posts.

Social Graph: Users can follow and unfollow other users to create a personalized content feed.

Post Management:

Create, view, and delete posts with images and captions.

Engage with posts by liking/unliking and leaving comments.

Dynamic Home Feed: A central feed that displays posts from followed users in chronological order.

Real-Time Chat:

Built with Socket.IO for instant one-on-one messaging.

Tracks and displays the real-time online/offline status of users.

Conversations are stored in the database and fetched on user selection.

Responsive UI: A modern, clean, and fully responsive user interface built with React and styled with Tailwind CSS.

💻 Technology Stack
Category

Technology

Frontend

React.js, Redux Toolkit (for state management), React Router, Tailwind CSS, Axios

Backend

Node.js, Express.js

Database

MongoDB (with Mongoose for object data modeling)

Real-Time

Socket.IO

Auth

JWT (JSON Web Tokens), bcrypt.js (for password hashing)

Deployment

Configured for a single-server setup where Express serves both the API and the static React build files.

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js (v18 or later recommended)

npm

MongoDB (either local or a cloud instance like MongoDB Atlas)

Installation
Clone the repository:

git clone [https://github.com/your-username/connectsphere.git](https://github.com/your-username/connectsphere.git)
cd connectsphere


Set up the Backend:

Navigate to the backend directory and install dependencies.

cd backend
npm install


Create a .env file in the backend folder and add the following environment variables.

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key


Start the backend server.

npm run dev


The server will be running on http://localhost:8000 (or your configured port).

Set up the Frontend:

Open a new terminal window. Navigate to the frontend directory and install dependencies.

cd frontend
npm install


Start the frontend development server.

npm run dev


The React application will be available at http://localhost:5173.

Available Scripts
Backend:

npm run dev: Starts the server with Nodemon for live reloading.

npm start: Starts the server in production mode.

Frontend:

npm run dev: Starts the Vite development server.

npm run build: Creates a production-ready build of the React app in the dist folder.

📜 License
Distributed under the MIT License. See LICENSE for more information.
