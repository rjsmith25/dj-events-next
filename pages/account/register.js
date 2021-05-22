import { FaUser } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import styles from "@/styles/AuthForm.module.css";
import { useAuth } from "@/context/authContext";

export default function RegisterPage() {
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const { register, error } = useAuth();

  useEffect(() => error && toast.error(error), [error]);

  function handleSubmit(e) {
    e.preventDefault();
    if (newUser.password !== newUser.passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }
    register({
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
    });
  }

  function handleChange(e) {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  }

  return (
    <div className={styles.auth}>
      <h1>
        <FaUser /> Register
      </h1>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={newUser.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={newUser.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={newUser.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="passwordConfirm">Password Confirm</label>
          <input
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            value={newUser.passwordConfirm}
            onChange={handleChange}
          />
        </div>
        <input className="btn" type="submit" value="Register" />
      </form>
      <p>
        Already have an account ? <Link href="/account/login">Login</Link>
      </p>
    </div>
  );
}
