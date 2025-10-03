<img src="https://socialify.git.ci/Shantela21/shopping-list-app-/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="shopping-list-app-" width="640" height="320" />

# 🛒 Shopping List App

A **React + TypeScript** web application that allows users to register, log in, and manage multiple shopping lists. The app uses **Redux Toolkit** for state management, **React Router** for navigation, and **json-server** as a mock backend.

---

## 🚀 Features

- 🔐 **Authentication**
  - User registration and login
  - Protected routes (only accessible after login)
  - Public-only routes for unauthenticated users  

- 📋 **Shopping Lists**
  - Create, update, and delete shopping list items  
  - Organized by users  

- 👤 **User Profile**
  - View profile  
  - Edit profile details  

- 📑 **Additional Pages**
  - Home  
  - About  
  - Contact Us  
  - Privacy Policy  
  - Terms & Conditions  
  - 404 Not Found Page  

- 🎨 **UI Components**
  - Responsive **Navbar** and **Footer**
  - Clean and intuitive user experience  

---

## 🛠️ Tech Stack

- **Frontend**
  - React 19 + TypeScript
  - React Router v7
  - Redux Toolkit
  - Axios
  - React Icons  

- **Backend (Mock API)**
  - json-server (REST API simulation)

- **Development Tools**
  - Vite
  - ESLint + TypeScript ESLint
  - Pre-configured scripts for dev, build, lint, and preview  

---

## 📂 Project Structure
```
shopping-list-app/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Profile.tsx
│   │   ├── EditProfile.tsx
│   │   ├── ContactUs.tsx
│   │   ├── Privacy.tsx
│   │   ├── Terms.tsx
│   │   ├── NotFoundPage.tsx
│   ├── data/
│   │   └── db.json   ← Mock API database
│   ├── store.ts      ← Redux store setup
│   ├── App.tsx
│   ├── main.tsx
│   └── App.css
├── package.json
├── tsconfig.json
└── vite.config.ts
```



---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repo
```bash
git clone https://github.com/Shantela21/shopping-list-app.git
```
```bash
cd shopping-list-app
```
## 2️⃣ Install dependencies
``` bash
npm install
```
## 3️⃣Start the development server
```bash
npm run dev
```
## 4️⃣ Start json-server (Mock API)
```bash
npm run json:server
```
The mock API will be available at:
👉 http://localhost:5000

## 📜 Available Scripts

* npm run dev – Start Vite dev server

* npm run build – Build the app for production

* npm run preview – Preview * production build locally

* npm run lint – Run ESLint checks

* npm run json:server – Run mock API server on port 5000

## 🔒 Authentication Flow

* PublicOnlyRoute → Restricts access to login/register if user is already authenticated

* ProtectedRoute → Restricts access to authenticated pages (Home, Profile, Edit Profile)

## 📌 To-Do / Future Enhancements

* ✅ Dark mode toggle

* ✅ Multiple shopping list categories

* ✅ Real backend integration (Node/Express or Firebase)

* ✅ Add item search/filter

## Author
Shantela Noyila