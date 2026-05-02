# Team Task Manager

This project is a full stack web application built to manage team projects and tasks in a simple and organized way. It allows users to create projects assign tasks and track progress with proper role based access.

---

## About the project

The goal of this application is to help teams manage their work efficiently. Users can sign up log in create projects add team members and assign tasks. Each task can be tracked based on its status so everyone knows what is pending in progress or completed.

---

## Features

Authentication
Users can create an account and log in securely

Project management
Create projects and manage team members

Task management
Create tasks assign them to users and update status

Dashboard
View all tasks their status and overdue items

Role based access
Admin can manage everything
Members can work on assigned tasks

---

## Tech stack

Frontend
React
Axios
CSS

Backend
Node js
Express

Database
MongoDB

---

## Folder structure

backend contains server routes controllers and database connection

frontend contains UI components pages and API integration

---

## How to run locally

Clone the repository

Install dependencies

Run backend

Run frontend

Make sure to add environment variables like mongo uri jwt secret and api url

---

## Deployment

The project is deployed using Railway

Backend is hosted and connected to MongoDB Atlas

Frontend is deployed and connected to backend using environment variables

---

## API example

Signup
POST /api/auth/signup

Login
POST /api/auth/login

Projects
GET POST /api/projects

Tasks
GET POST PUT /api/tasks

---

## Author

Suraj Mishra

---

## Note

This project was built as part of a full stack assignment focusing on real world application structure API design and deployment.
