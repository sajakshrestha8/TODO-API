# TODO-API
This repository contains a fully functional API for managing a to-do application, enabling users to perform CRUD (Create, Read, Update, Delete) operations on their tasks. It also includes user authentication for secure access to user-specific tasks.

## Features
Task Management: Create, retrieve, update, and delete tasks.
User Authentication: Secure endpoints using JWT-based authentication.
Error Handling: Comprehensive error responses for invalid requests and unauthorized actions.
Database Integration: Persistent storage of tasks using MySQL.

## Technologies Used
Backend: Node.js with Express.js framework.
Database: MySQL for data storage.
Authentication: JSON Web Tokens (JWT) for securing API endpoints.

## Installation 
1. Clone the Repository:
   ```bash
   git clone https://github.com/sajakshrestha8/TODO-API.git

2. Navigate to the Project Directory:
   ```bash
   cd TODO-API

3. Install Dependencies:
   ```bash
   npm install

4. Set Up MySQL Database:
   <ul>Create a new MySQL database.</ul>
   <ul>Update the database configuration in your .env file as shown below.</ul>

5. Set Up Environment Variables:
   Create a .env file in the root directory and add the following variables:
   ```bash
    PORT=8000
    DB_HOST=your_mysql_host
    DB_USER=your_mysql_username
    DB_PASSWORD=your_mysql_password
    DB_NAME=your_mysql_database_name
    JWT_SECRET=your_jwt_secret_key

6. Start the Server
   ```bash
   npm run server

## API Endpoints
POST /api/register: Register a new user.
POST /api/login: Authenticate a user and receive a token.
GET /api/viewusertask: Retrieve all tasks for the authenticated user.
GET /api/viewalltask: Retrieve all tasks that are for expired.
POST /api/addtask: Add a new task.
PUT /api/updatetask: Update an existing task.
DELETE /api/deletetask: Delete a task.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.
