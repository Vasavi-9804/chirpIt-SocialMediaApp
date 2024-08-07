# chirpIt

## Overview

chirpIt is a backend application built using Node.js and Express. It supports user authentication, CRUD operations, and various other features.

## Features

- User authentication (JWT)
- CRUD operations for  posts, comments, users profiles
- Following and unfollowing users
- Liking and unliking posts
- Error handling
- Input validation
- Secure password storage

## Tech Stack

- Node.js
- Express
- MongoDB (with Mongoose)
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing
- Joi for input validation

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```
2. Install Node.js and other dependencies
   ```sh
   npm install
   npm install nodemon --save-dev nodemon
   npm install express
   npm install jsonwebtoken
   npm install bcrypt
   npm install multer
   ```
3. Create a .env file in the root directory and add the following environment variables:
   ```sh
   PORT = 3000
   ACCESS_TOKEN_SECRET=accesstokensecret
   REFRESH_TOKEN_SECRET=refreshtokensecret
   ```
4. Update the scripts section in your package.json to include nodemon:
   ```sh
   "scripts": {
    "start": "nodemon  server.js",
    "start-auth": "nodemon  authServer.js"
    }
5. Start the sever:
   ```sh
    node server.js
    node authServer.js
    npm rum start
    npm run start-auth //in seperate terminals
6. Use postman to send requests to the server and receive responses from the server
