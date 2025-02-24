# Backend

This is the backend service for the project. It is built using Fastify and provides authentication and image analysis functionalities.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Docker](#docker)
- [Contributing](#contributing)

## Installation

1. Clone the repository:

```sh
git clone <repository-url>
cd backend
```
2. Instal the dependencies

## Usage

To start the server in development mode:

```sh
npm run dev
```

To start the server in production mode:

```sh
npm start
```

The server will be running at ```http://localhost:5000```.

## API Endpoints

Authentification

*   **Register**: ```POST /auth/register```
    *   Request Body: ```{ "email": "user@example.com" , "password": "password123" }```
    *   Response: ```{ "message": "Utilisateur inscrit avec succès" }```

*   **Login**: ```GET /auth/login```
    *   Request Body: ```{ "email": "user@example.com" , "password": "password123" }```
    *   Response: ```{ "message": "Connexion réussie", "token": "jwt-token"}```

Image Analysis

*   **Analyze Image**: ```POST /images/analyze```
    *   Request Body: ```{ "imageUrl": "http://example.com/image.png" }```
    *   Response: ```{ "message": "Analyse réussie", "data": { "nom": "Nom de la bouteille", "provenance": "Brasserie ou Domaine et Pays", "histoire": "Brève histoire de la boisson et de son fabricant", "accompagnement": "Suggestions de plats et fromages qui s’accordent avec cette boisson" } }```
    



## Docker
To build an run the Docker container:
1.  Build the Docker image:

```sh 
docker build -f Dockerfile.basic -t backend .
```

2.   Run the Docker container:

```sh 
docker run -p 5000:5000 --env-file .env backend
 ```

