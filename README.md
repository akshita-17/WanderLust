# NookAway– Your nook, anywhere in the world.

NookAway is a full-stack web application inspired by Airbnb that allows users to create, explore, and manage property listings. Users can sign up, log in, add new listings, edit or delete their listings, and leave reviews on properties. The project demonstrates core backend development concepts including authentication, CRUD operations, and database relationships.

## Features

- User authentication (Signup / Login / Logout)
- Add new property listings
- Edit and delete listings
- Review and rating system
- Authorization for listing and review owners
- Flash messages and form validation
- Full CRUD operations for listings and reviews

## Tech Stack

- Node.js
- Express.js
- MongoDB
- EJS
- Express Router
- connect-flash
- Bootstrap
- Passport.js
- Mongoose
- Joi

## Project Structure

models/ – Mongoose schemas for database models (User, Listing, Review)

routes/ – Express route handlers for listings, reviews, and authentication

views/ – EJS templates used to render dynamic frontend pages

public/ – Static assets such as CSS, JavaScript, and images

utils/ – Utility functions such as error handling and async wrappers

init/ – Initial scripts used to seed or initialize the database

app.js – Main application file where Express server and routes are configured

middleware.js – Custom middleware for authentication and authorization

schema.js – Joi validation schemas for request validation


## Future Improvements

- Image upload for listings
- Map integration for property locations
- Improved UI design
- Search and filter functionality
- Deployment on cloud platforms

## Status

Project currently under development.