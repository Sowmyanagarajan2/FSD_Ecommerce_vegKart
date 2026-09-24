import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevent the default form submission behavior

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
//save the token and user data in local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user)); //store user data as a string in local storage

      navigate("/home"); //navigate to the home page after successful login
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed"); //display an alert with the error message if login fails
    }
  };

  return (
    <div className="page-container">
      <div className="auth-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <fieldset>
            <legend>Enter Your Credentials</legend>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <br></br>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <br></br>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <br></br>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </fieldset>
        </form>

        <div className="auth-link">
          <p>
            Don't have an Account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;