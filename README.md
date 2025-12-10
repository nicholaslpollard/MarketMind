# MarketMind – Stock News Sentiment Dashboard
MarketMind is a full-stack MEAN-style (MongoDB, Express, Angular, Node) application that enables users to:
- Register and log in securely  
- Maintain a personalized stock watchlist
- View sentiment summaries for recent news headlines with last price
- Search any ticker symbol and view articles + sentiment  
- Open a ticker details page showing price, sentiment, and related news  

The backend uses Node/Express + MongoDB Atlas.  
The frontend is built with Angular 16.2.16

This README contains full setup instructions so anyone can install and run the entire project.

---

# 1. Prerequisites
### Required Software/Versions
- **Node.js 22.21.1**
- **npm 9.8.1**
- **Angular CLI 16.2.16**  
   Install with:
   npm install -g @angular/cli
- **MongoDB Atlas account (Provided)**
- **Massive.com (formally Polygon.io) account (Provided)**
- **Express 5.2.1**
- **Mongoose 9.0.1**
- **Axios 1.13.2**

### Required API Keys
**The .env file has been included in the github repository due to needed a key for the api calls that requires an account.**
**This is for class submission and grading purposes only.  Normally this would be set up in the enviroment variables when hosting online**
**Keys will be change/deactivated after semesters end**

(These are not needed, but would be if depolying out of a classroom enviroment)
You must supply: 
- A **Massive News API Key**
- A **MongoDB connection string (MONGO_URI)**

---

# 2. Project Structure
MarketMind/
backend
  .env
  config
    db.js
  controllers
    authController.js
    newsController.js
    priceController.js
    watchlistController.js
  middleware
    authMiddleware.js
  models
    User.js
    Watchlist.js
  package-lock.json
  package.json
  routes
    authRoutes.js
    newsRoutes.js
    watchlistRoutes.js
  server.js
  utils
    promisePool.js
frontend
  .gitignore
  .vscode
    extensions.json
    launch.json
    tasks.json
  angular.json
  package-lock.json
  package.json
  proxy.conf.json
  src
    app
      app-routing.module.ts
      app.component.css
      app.component.html
      app.component.ts
      app.module.ts
      core
        guards
          auth.guard.ts
        interceptors
          auth.interceptor.ts
        services
          auth.service.ts
          news.service.ts
          watchlist.service.ts
      layout
        main-layout
          layout.component.css
          layout.component.html
          layout.component.ts
        navbar
          navbar.component.css
          navbar.component.html
          navbar.component.ts
      material
        material.module.ts
      pages
        dashboard
          dashboard.component.css
          dashboard.component.html
          dashboard.component.ts
        home
          home.component.css
          home.component.html
          home.component.ts
        login
          login.component.css
          login.component.html
          login.component.ts
        register
          register.component.css
          register.component.html
          register.component.ts
        settings
          settings.component.css
          settings.component.html
          settings.component.ts
        ticker
          ticker.component.css
          ticker.component.html
          ticker.component.ts
        watchlist
          watchlist.component.css
          watchlist.component.html
          watchlist.component.ts
    assets
      .gitkeep
    favicon.ico
    index.html
    main.ts
    styles.css
  tsconfig.app.json
  tsconfig.json
  tsconfig.spec.json
package-lock.json
package.json
README.md
---

## 3. Backend Setup
### 3.1 Navigate into the backend folder
```
cd backend
```

### 3.2 Install dependencies
(Already installed in the classroom environment, but normally you would run:)
```
npm install
```

### 3.3 Create your `.env` file  
Inside `/backend`, create a file named **.env**:

```
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=CHOOSE_A_SECRET_KEY
MASSIVE_API_KEY=YOUR_MASSIVE_NEWS_API_KEY
MASSIVE_BASE_URL=https://api.massive.com/v2
PORT=5000
```

**Example MongoDB URI:**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/marketmind
```

### 3.4 Start the backend
```
npm run dev
```

Backend default URL:
```
http://localhost:5000
```

## 4. Frontend Setup
### 4.1 Navigate into the frontend directory
```
cd frontend
```

### 4.2 Install dependencies
```
npm install
```

### 4.3 Install Angular CLI **16.2.16 specifically**  
Angular 17+ is **not compatible** with this project.  
Run this to force-install the correct CLI version:

```
npm install -g @angular/cli@16.2.16
```

Verify installation:
```
ng version
```
You should see:
```
Angular CLI: 16.2.16
Angular: 16.2.16
```

### 4.4 Start the Angular development server
```
npm start
```

Frontend default URL:
```
http://localhost:4200
```

### 4.5 Configure API URLs
The Angular frontend communicates with the backend using a proxy configuration file located at:

```
frontend/proxy.conf.json
```

This file forwards all `/api/*` requests to the backend server running on http://localhost:5000:

```
{
  "/api": {
    "target": "http://localhost:5000",
    "secure": false
  }
}
```

No changes are required unless the backend runs on a different port.  
As long as you start both servers:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:4200`

All API calls (such as `/api/auth/login`, `/api/news/search`, `/api/watchlist/full`) will be routed correctly.

## Required Software / Verified Versions
The environment uses:

```
Node.js:        22.21.1
npm:            9.8.1

Angular CLI:    16.2.16  
Angular Core:   16.2.16

MongoDB Atlas:  Provided for the course
Massive.com API: Provided for the course

Express:        5.2.1
Mongoose:       9.0.1
Axios:          1.13.2
```

### Frontend package.json key libraries
```
@angular/core: 16.2.0
@angular/material: 16.2.14
@angular/cdk: 16.2.14
rxjs: 7.8.0
typescript: 5.1.3
```

### Backend package.json key libraries
```
express: 5.2.1
mongoose: 9.0.1
axios: 1.13.2
bcryptjs: 3.0.3
jsonwebtoken: 9.0.3
```


# 5. Creating an Account & Using the App

1. Start both backend and frontend servers  
2. Visit:  
   `https://ominous-pancake-5g465qqq5prjc65r-4200.app.github.dev/`
   or go to in VS Code, go to ports and copy the Forward Address from Port 4200
3. Register a new account by clicking "Register" in the navigation bar and entering a email address and password 
4. Log in by clicking "Log in" in the navigation bar and entering your email address and password
   Testing account has been created with credentials:
      email: test@gmail.com
      password: password
5. Log in to access:
   - Dashboard (search + watchlist)
   - Individual ticker pages
   - Watchlist page
   - Settings (change password, delete account)

---

# 6. Environment Notes

- JWT tokens and email are stored in localStorage
- Backend uses JWT authentication for all protected endpoints
- MongoDB Atlas may require adding your IP to the whitelist
- Massive News API requires a valid API key

---

# 7. Running Backend & Frontend Together
### Terminal 1 – Backend
cd backend
npm run dev

### Terminal 2 – Frontend
cd frontend
npm start
---

# 8. Troubleshooting
### Backend not connecting?
- Verify `.env` values
- Ensure MongoDB URI is valid
- Confirm Node.js version is 22.21.1

### Angular proxy not forwarding?
- Ensure backend is running on port 5000

### Login issues?
- Ensure JWT_SECRET exists in `.env`
- Ensure MongoDB Atlas cluster is reachable

---
