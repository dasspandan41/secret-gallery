import { motion } from "framer-motion";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

function Login() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate = useNavigate();

  const loginUser = () => {

    localStorage.setItem(
      "username",
      username
    );

    localStorage.setItem(
      "password",
      password
    );

    navigate("/gallery");

  };

  return (

    <div
      style={{
        background: "black",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative"
      }}
    >

      <motion.h1

        initial={{
          opacity: 0,
          y: -100
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        transition={{
          duration: 1.5
        }}

        style={{
          fontSize: "60px",
          marginBottom: "40px",
          textShadow:
            "0 0 20px white",
          textAlign: "center"
        }}
      >
        YOUR SECRET GALLERY
      </motion.h1>

      <motion.div

        initial={{
          opacity: 0,
          scale: 0.5
        }}

        animate={{
          opacity: 1,
          scale: 1
        }}

        transition={{
          duration: 1
        }}

        style={{
          background:
            "rgba(255,255,255,0.08)",
          padding: "40px",
          borderRadius: "25px",
          backdropFilter:
            "blur(15px)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "320px",
          boxShadow:
            "0 0 30px rgba(255,255,255,0.15)"
        }}
      >

        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          style={{
            padding: "15px",
            borderRadius: "12px",
            border: "none",
            outline: "none"
          }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            padding: "15px",
            borderRadius: "12px",
            border: "none",
            outline: "none"
          }}
        />

        <button
          onClick={loginUser}
          style={{
            padding: "15px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px"
          }}
        >
          Enter Gallery
        </button>

      </motion.div>

    </div>

  );
}

export default Login;