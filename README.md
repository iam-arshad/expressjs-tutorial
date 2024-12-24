
## Express.js Tutorial

Welcome to the Express.js Tutorial repository! This project is designed to help you understand the fundamentals of building a web application using Node.js and Express.js.

## Live Demo

The application has been deployed on Railway and can be accessed at:  
[https://expressjs-tutorial-production.up.railway.app/](https://expressjs-tutorial-production.up.railway.app/)

## Features

-   **User Authentication**: Implements Google OAuth for secure user login.
-   **EJS Rendering**: Utilizes EJS (Embedded JavaScript) as the templating engine, allowing dynamic HTML rendering and easy data passing between server and views.
-   **JWT (JSON Web Tokens)**: Employs JWT for stateless authentication, ensuring secure transmission of user information.
-   **Sessions and Cookies**: Manages user sessions and cookies for maintaining user state across requests.
-   **RESTful API Endpoints**: Provides a structured way to interact with the application through standard HTTP methods.
-   **MongoDB Integration**: Connects to MongoDB for data storage, enabling persistent data management.
-   **Testing**: Includes tests to ensure the reliability and correctness of the application functionality.

## Prerequisites

To run this application locally, you need to have the following environment variables set up in a `.env` file located in the root directory of the project:

-   `GOOGLE_CLIENT_ID`: Your Google Client ID
-   `GOOGLE_CLIENT_SECRET`: Your Google Client Secret
-   `ACCESS_TOKEN_SECRET`: A secret key for signing access tokens
-   `REFRESH_TOKEN_SECRET`: A secret key for signing refresh tokens
-   `MONGODB_CONNECTION_STRING`: The connection string for your MongoDB database

## Installation

1.  Clone the repository:
    
    bash
    
    `git clone https://github.com/iam-arshad/expressjs-tutorial.git` 
    
2.  Navigate into the project directory:
    
    bash
    
    `cd expressjs-tutorial` 
    
3.  Install the required dependencies:
    
    bash
    
    `npm  install` 
    
4.  Create a `.env` file in the root directory and add your environment variables as mentioned above.

## Running the Application

To start the application, run:

bash

`npm start` 

The application will be available at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you have suggestions or improvements.

## License

This project is licensed under the MIT License.  Thank you for checking out this Express.js Tutorial! Happy coding!