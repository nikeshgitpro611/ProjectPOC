reff - https://github.com/sahandghavidel?tab=repositories

> How to make directory and file

- mkdir pages; cd pages; ni Home.jsx, About.jsx, Profile.jsx, Signin.jsx, Signout.jsx

# Mongoose Setup

- create project with project name only.
- Create Database [deploy cluster choose free on then create deploy, ]

# USE CASE : WHEN REFRESH THE PAGE THEN DATA GONE(NULL) HOW TO HANDEL BY RTK

- FOR Latest stored in local we can use one package called redux persist
- It automatically saves (persists) your Redux state to a storage engine (like localStorage, sessionStorage, or AsyncStorage in React Native).

- On application load, it rehydrates (loads) the persisted state back into your Redux store.
- npm i redux-persist

```
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({ user: userReducer });
```

# how to sing-in by google authentication.

-

# Explain useNavigate and navigate

- useNavigate is a hook but Navigate is a component
- useNavigate - It allows you to programmatically navigate to different routes in your React app.provided y React Router's.
- Navigate - The Navigate component is a built-in React Router component that allows you to perform client-side redirection.It is useful for protected routes, redirects after authentication, or conditional redirects.

```
import { useNavigate } from "react-router-dom";
 const navigate = useNavigate();
  const goToProfile = () => {
    navigate("/profile");
  };

import { Navigate } from "react-router-dom";

// Example Usage
<Navigate to="/target-route" />
```
