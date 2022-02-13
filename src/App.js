import React, { useState, useEffect } from "react";

import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import MainHeader from "./components/MainHeader/MainHeader";
import AuthContext from "./context/auth-context";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    //this below code, we cannot use this directly in component as it will get us stuck in infinite loop
    //as everything will execute if state changes
    // Now when we are logged in already and we refresh the home screen it wont get us on login screen as loggedin key is in local storage
    const storedLoggedInInformation = localStorage.getItem("isLoggedIn");
    if (storedLoggedInInformation === "1") setIsLoggedIn(true);
  }, []);

  const loginHandler = (email, password) => {
    // We should of course check email and password
    // But it's just a dummy/ demo anyways

    //we ll store the data in local storage to store the user details so that it does not get lost
    localStorage.setItem("isLoggedIn", "1"); //we are using 1 for logged in and 0 from not logged in
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    //to delete the loggedin key when we logout
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, onLogout: logoutHandler }}
    >
      <MainHeader />
      <main>
        {!isLoggedIn && <Login onLogin={loginHandler} />}
        {isLoggedIn && <Home onLogout={logoutHandler} />}
      </main>
    </AuthContext.Provider>
  );
}

export default App;
