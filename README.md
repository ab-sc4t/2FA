Hello everyone this is my project named ***"2FA"*** .
## Idea behind this project:
first: login using email and password; second: otp verification

## Technologies used:
**Frontend:**
1. ReactJS
2. Material UI

**Backend:**
1. NodeJS
2. ExpressJS

**Data Access (from backend to database):**
Sequelize ORM

**Database Used:**
MySQL

**Authorisation:**
PassportJS

## Steps to run this project
*Note: Create an anv file on the project directory level and give the relevant values to the env variables used thorughout the project*
1. Git clone the project
2. In the project folder open three terminals
3. On first terminal go to backend folder
4. On second terminal go to frontend folder
5. Type "npm i" on the two terminals to install the necessary npm packages used
6. On the backend one run "nodemon"
7. On the frontend one run "npm start"
   *AND YOU ARE ALL SET!!*

## ENV FILE VARIABLES EXPLAINED
1. GOOGLE_CLIENT_ID = google client id to be created for passport googleAuth
2. GOOGLE_CLIENT_SECRET = The corresponding google client secret
3. GOOGLE_CALLBACK_URL = The corresponding google callback url
4. GOOGLE_PROFILEURL = the corresponding profile URL
5. DB_PORT = Databse port (preferred: 8080)
6. DB_USERNAME = Your MySQL username
7. DATABASE_HOST = "localhost"
8. DB_PASS = Your MySQL password
9. DATABASE_NAME = Create a database with any name (mine: "2fa")
10. SECRET_SESSION = Your session secret key can be anything
11. OTP_SECRET = Your OTP session key can be anything
12. OTP_EMAIL = The email you want to send email from for the otp
13. OTP_EMAIL_PASS = Set an app password for the above gmail and place it here

