import { useState } from "react";

import { useNavigate } from "react-router-dom";

function Login() {

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const loginUser = () => {

    localStorage.setItem("username", username);

    localStorage.setItem("password", password);

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
        flexDirection: "column"
      }}
    >

      <h1
        style={{
          fontSize: "50px",
          marginBottom: "40px"
        }}
      >
        YOUR SECRET GALLERY
      </h1>

      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
        style={{
          padding: "15px",
          width: "300px",
          marginBottom: "20px"
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
          width: "300px",
          marginBottom: "20px"
        }}
      />

      <button
        onClick={loginUser}
        style={{
          padding: "15px 40px",
          cursor: "pointer"
        }}
      >
        Enter
      </button>

    </div>
  );
}

export default Login;