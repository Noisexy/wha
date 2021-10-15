import React, { useState, useRef } from "react";
import "./sidebar.css";
import userSvg from "../../images/user.svg";
import messageSvg from "../../images/messages.svg";
import settingsSvg from "../../images/settings.svg";
import axios from "../../axios";

export const Sidebar = ({ user, setUser }) => {
  const [userSign, setUserSign] = useState({
    user: "",
    password: "",
    password2: "",
  });

  const loginRef = useRef(null);
  const [isLoginShown, setIsLoginShown] = useState(false);

  const [userLogin, setUserLogin] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const value = e.target.value;
    //setUser({ name: value });
  };

  const handleSignChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserSign({ ...userSign, [name]: value });
  };
  const handleSignSubmit = (e) => {
    e.preventDefault();
    if (userSign.password !== userSign.password2) {
      alert("PASSWORDS DO NOT MATCH");
    } else {
      const { user, password } = userSign;
      axios
        .post("/api/v1/users", { username: user, password: password })
        .then((res) => console.log(res.status))
        .catch((e) => console.log(e));

      setUserSign({ user: "", password: "", password2: "" });
    }
  };

  const handleLoginChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserLogin({ ...userLogin, [name]: value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const { username, password } = userLogin;
    axios
      .post("/api/v1/users/login", {
        username: username,
        password: password,
      })
      .then(async (res) => {
        if (res.status === 200) {
          console.log("LOGGED");
          await setUser({ name: username });
        }
      })
      .catch((e) => {
        console.log(e);
      });
    localStorage.setItem("user", userLogin.username);

    setUserLogin({ username: "", password: "" });
  };

  const handleBurgerClick = (e) => {
    if (!isLoginShown) {
      console.log("hey");
      loginRef.current.style.transform = "translateY(0px)";
      setIsLoginShown(!isLoginShown);
    } else {
      console.log("hoy");
      loginRef.current.style.transform = "translateY(-1000px)";
      setIsLoginShown(!isLoginShown);
    }
  };

  return (
    <>
      <span className="burgerContainer" onClick={handleBurgerClick}>
        <span className="burger1"></span>
        <span className="burger2"></span>
      </span>

      <section className="sidebar" ref={loginRef}>
        <div className="userNavBar">
          <img src={userSvg} alt="" className="userimg" />
          <div className="iconsContainer">
            <img src={messageSvg} alt="" className="messageSvg" />
            <img src={settingsSvg} alt="" className="settingsSvg" />
          </div>
        </div>

        <form className="signUpForm" onSubmit={(e) => handleSignSubmit(e)}>
          <h3>Sign Up</h3>
          <h6>User</h6>
          <input
            type="text"
            placeholder="USERNAME"
            required={true}
            name="user"
            value={userSign.user}
            onChange={(e) => handleSignChange(e)}
          />
          <h6>Password</h6>
          <input
            type="password"
            placeholder="PASSWORD"
            required={true}
            name="password"
            value={userSign.password}
            onChange={(e) => handleSignChange(e)}
          />
          <h6>Repeat Password</h6>
          <input
            type="password"
            placeholder="PASSWORD"
            required={true}
            name="password2"
            value={userSign.password2}
            onChange={(e) => handleSignChange(e)}
          />
          <button type="submit">SEND</button>
        </form>

        <form className="loginForm" onSubmit={(e) => handleLoginSubmit(e)}>
          <h3>Login</h3>
          <h6>User</h6>
          <input
            type="text"
            placeholder="USERNAME"
            required={true}
            name="username"
            value={userLogin.username}
            onChange={(e) => handleLoginChange(e)}
          />
          <h6>Password</h6>
          <input
            type="text"
            placeholder="PASSWORD"
            required={true}
            name="password"
            value={userLogin.password}
            onChange={(e) => handleLoginChange(e)}
          />
          <button type="submit">SEND</button>
        </form>

        <input
          type="text"
          placeholder="your name"
          name="name"
          value={user.name}
          onChange={(e) => handleChange(e)}
        />
      </section>
    </>
  );
};
