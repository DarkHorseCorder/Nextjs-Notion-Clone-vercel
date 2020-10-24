# sayem-nextjs-vercel Frontend

  [Live Demo](https://sayem-nextjs-vercel.vercel.app/) <br />
## 📓 Notion Clone

#### Create and Edit Notes like in Notion

This clone tries to replicate some of the great note-taking features Notion has. If you don't know [Notion.so](https://notion.so) yet, I highly recommend to check it out!


<img alt="notion clone screenshot" src="./screenshot.gif" width="480">

---

## Features

- **Slash Commands** (Type `/` to turn the block into different content types)
- **HTML Support** (Use regular HTML tags like `<a>` in text blocks)
- **Image Support** (Upload images by using the `/image` command)
- **Drag And Drop** (Reorder blocks easily by drag and drop)
- **Guest Editing** (Anyone can create public pages and share them via link)
- **User Management** (Create an account to create private pages)
- **Scheduled Jobs** (Delete inactive pages and accounts automatically)

## Tech Stack
  The frontend is built with Next.js and fully server-side rendered. On the backend, a REST API handles saving user content and user management.

#### Frontend

Next.js · React.js · SCSS/SASS

#### Backend

Express.js · MongoDB with Mongoose · Nodemailer · JWT (Cookie-based)

## Installation

1. **Clone the project**

   ```sh
    git clone https://github.com/konstantinmuenster/notion-clone.git
    cd notion-clone
   ```
   
2. **Add environment variables**

   Backend: Create an `.env` file in the `backend` directory:

   ```
   FRONTEND_URL="http://localhost:3000"
   DOMAIN="localhost"
   JWT_KEY="yourSecretForTokenGeneration"
   PORT=8080
   MONGO_URI="mongodb+srv://username:password@cluster.gqqwp.gcp.mongodb.net/database?retryWrites=true&w=majority"
   MAIL_HOST="smtp.sendgrid.net"
   MAIL_PORT=465
   MAIL_USER="apiKey"
   MAIL_SENDER="Your Name <your@mail.com>"
   MAIL_PASSWORD="yourSendGridApiKey"
   ```

   Frontend: Create an `.env.local` file in the `frontend` directory:

   ```
   NEXT_PUBLIC_API="http://localhost:8080"
   ```

3. **Install and run backend (http://localhost:8080)**

    ```sh
    cd backend
    npm install
    npm start
    ```

4. **Install and run frontend (http://localhost:3000)**

    ```sh
    cd frontend
    npm install
    npm run dev
    ```
    
  ## Deploy on Vercel.com
  ### - Sign up on Vercel.com
  ### - New Project

  ![image](https://user-images.githubusercontent.com/75736745/109390756-0a3df100-78d9-11eb-9ba6-148f30e5e4be.png)

  ### - Import from git repository

  ![image](https://user-images.githubusercontent.com/75736745/109391808-a0c0e100-78de-11eb-80a7-d6e03939e4c0.png)

  ### - Deployment Build

  ![image](https://user-images.githubusercontent.com/75736745/109391998-4d9b5e00-78df-11eb-8037-1b435943688d.png)

## Google OAuth2 
  ### Use Google ClientID for google OAuth authentication login.
  
  ![image](https://user-images.githubusercontent.com/75736745/109507407-51a4b880-7a64-11eb-92cc-710e8acd558b.png)

  ### Add live site to Google whitelist
  
  ![image](https://user-images.githubusercontent.com/75736745/109507531-76992b80-7a64-11eb-8637-d395cebc7034.png)

  ![image](https://user-images.githubusercontent.com/75736745/109507610-87e23800-7a64-11eb-9739-8ac4d75e4c68.png)

  ### Save all you've done!
  
## That's all!

## Thanks.
