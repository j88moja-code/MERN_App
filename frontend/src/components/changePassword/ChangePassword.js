import React, { useState } from "react";
import "./ChangePassword.scss";
import { toast } from "react-toastify";
import { changePassword } from "../../services/authService";
import Card from "../card/Card";
import { useNavigate } from "react-router-dom";

const initialState = {
  oldPassword: "",
  password: "",
  confirm_password: "",
};

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const { oldPassword, password, confirm_password } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const changePass = async (e) => {
    e.preventDefault();

    if (password !== confirm_password) {
      return toast.error("Passwords do not match");
    }

    const formData = {
      oldPassword,
      password,
    };

    const data = await changePassword(formData);
    toast.success(data);
    navigate("/profile");
  };
  return (
    <div className="change-password">
      <Card cardClass="password-card">
        <h3>Change Password</h3>
        <form className="--form-control" onSubmit={changePass}>
          <input
            type="password"
            placeholder="Old Password"
            required
            name="oldPassword"
            value={oldPassword}
            onChange={handleInputChange}
          />
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
            Change Password
          </button>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
