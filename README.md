# URL-SHORTENER

- **URL Shortener**: A URL shortener is a service that takes a long URL and  converts it into a shorter, more manageable URL.

# How to Install and Run the URL Shortener Project

1. Clone Repository

2. Run npm install

3. Copy .env.example to .env and fill in the required environment variables

4. Run npx prisma migrate dev --name init to run migrations

5. Run npm run start:dev to star the project

6. Testing Endpoints

Register User: POST http://localhost:3000/auth/register

Login User: POST http://localhost:3000/auth/login

Update User: PUT http://localhost:3000/auth/update/:id

Delete User: DELETE http://localhost:3000/auth/delete/:id

Shorten URL: POST http://localhost:3000/url/shorten

Access Shortened URL: GET http://localhost:3000/url/:shortUrl

7. Running Unit Tests (Optional)

npm run test:e2e

8. Troubleshooting

If you encounter issues while running the application, check the console for error messages and ensure that all environment variables are set correctly.

Make sure your database is running and accessible according to the connection string you provided.


# The API documentation can be found [here], url-shortener.postman_collection.json