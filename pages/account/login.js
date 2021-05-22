import { FaUser } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/AuthForm.module.css";
import { useAuth } from "@/context/authContext";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const { login, error } = useAuth();

  useEffect(() => error && toast.error(error), [error]);

  function handleSubmit(e) {
    e.preventDefault();
    login({ email: credentials.email, password: credentials.password });
  }

  function handleChange(e) {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  return (
    <div className={styles.auth}>
      <h1>
        <FaUser /> Log In
      </h1>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={credentials.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <input className="btn" type="submit" value="Login" />
      </form>
      <p>
        Don't have an account ? <Link href="/account/register">Register</Link>
      </p>
    </div>
  );
}
