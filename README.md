# MooMarket
An online market for selling cattle, meat, hoof, horn and raw-hide. 

## Functionalities
1. Advertisements of various products (cattle, meat etc.) from sellers
2. Location-based advertisements display
3. Purchasing products by Buyers
4. Filtering options for users to help users find their desired products
5. Order post from buyers
6. Acceptance of order posts by sellers
7. Reviews and ratings given by buyers
8. Priority points assigned to the sellers
9. Auction for cattle

## Technology Stack
- **Languages**: JavaScript (Node.js, Vanilla JS)
- **Backend**: Node.js, Express
- **Frontend**: HTML, Vanilla JavaScript, EJS (Embedded JavaScript)
- **Database**: PostgreSQL
- **Version Control**: Git, GitHub
- **Package Manager**: npm
- **Deployment**: Render

## API Integrations

- **Location-based Search**:  
  Utilizes the **Google Cloud Maps API** for geolocation and map-based queries.
  
- **Email Verification**:  
  Employs **Gmail Mail Server** in combination with **Nodemailer** for sending verification emails.
  
- **OTP Verification**:  
  Powered by **Twilio** for generating and verifying One-Time Passwords (OTP).

## Authentication Mechanisms

- **Email Verification**:  
  Ensures user authenticity through a verification link sent to the provided email address.

- **OTP Verification**:  
  Implements OTP-based authentication for additional security, with verification handled via Twilio.

- **JWT (JSON Web Token) Authentication**:  
  Uses **JWT** tokens for secure session management and **bcrypt** for password hashing, ensuring secure login and data handling.

## Design and Diagrams
- UI design by Figma
- bpmn diagram
- ERD diagram and Class diagram
- Collaboration diagram, Sequence diagram, and State diagram

## Installation instructions
### Clone the repository:
```
git clone https://github.com/nafiislam/MooMarket.git
```
## Navigate to the project directory:
```
cd MooMarket
```
### First install all dependencies using the following command:
```
npm install
```

### Then run the following command to execute the website:
```
npm run devStart
```
### Configure environment variables:
Create a .env file in the project root with the following values:

```
PGUSER=db_user
PGHOST=dpg-cjpjouthe99c739qhkq0-something.com
PGDATABASE=dbname
PGPASSWORD=dbpassword
PGPORT=5432
SALT=10
GMAIL_USER=project@gmail.com
GMAIL_PASSWORD=dggfv564561515fdg511
JWT_SECRET=dfsfesf54826654sefesf45grdgrd65354456456gfsfsdfjjkmkh
DOMAIN=http://localhost:3000
```

### Access the application:
Open your browser and navigate to http://localhost:3000.

## MooMarket Pages
### Homepage
![image](https://github.com/user-attachments/assets/561328e5-e583-424c-81e5-c898cef2f2c3)

### Registration page
![image](https://github.com/user-attachments/assets/daeec700-d546-4cac-9f1e-07fd7d7466b7)

### Location selection page
![image](https://github.com/user-attachments/assets/f0786964-0f8a-4bce-9924-86800e350c59)

### Advertisement page
![Screenshot from 2024-10-24 00-00-59](https://github.com/user-attachments/assets/70978345-29bd-4fd2-9373-b69dd82cea46)

### Give Advertisement page
![Screenshot from 2024-10-24 00-01-56](https://github.com/user-attachments/assets/b43282cf-2aec-4a4b-b2ec-4c5ce9a753ef)

### Buyer order post page

![Screenshot from 2024-10-24 00-03-39](https://github.com/user-attachments/assets/6ff8907e-920d-40d9-83b6-d6b4f991d0c7)
