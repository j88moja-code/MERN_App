import React, { useState } from "react";
import { MdPassword } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import styles from "./auth.module.scss";
import Card from "../../components/card/Card";
import { resetPassword } from "../../services/authService";

const initialState = {
  password: "",
  confirm_password: "",
};

const Reset = () => {
  const [formData, setFormData] = useState(initialState);
  const { password, confirm_password } = formData;

  const { resetToken } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const reset = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (password !== confirm_password) {
      return toast.error("Passwords do not match");
    }

    const userData = {
      password,
      confirm_password,
    };

    try {
      const data = await resetPassword(userData, resetToken);
      toast.success(data.message);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <MdPassword size={35} color="#999" />
          </div>
          <h2>Reset Password</h2>

          <form onSubmit={reset}>
            <input
              type="password"
              placeholder="New Password"
              required
              name="password"
              value={password}
              onChange={handleInputChange}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              required
              name="confirm_password"
              value={confirm_password}
              onChange={handleInputChange}
            />
            <button type="submit" className="--btn --btn-primary --btn-block">
              Reset Password
            </button>
            <div className={styles.links}>
              <p>
                <Link to="/">- Home</Link>
              </p>
              <p>
                <Link to="/login">- Login</Link>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Reset;
