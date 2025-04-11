import React, { useState } from "react";
import { login } from "../services/authSVC";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg.jpg";

const Login = () => {
  const [formData, setFormData] = useState({
    userType: "",
    userId: "",
    password: "",
  });

  // New state to handle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: unknown) => {
    e.preventDefault();
    const status = await login(
      formData.userType,
      formData.userId,
      formData.password
    );
    if (status) {
      navigate("/home");
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div
      className="h-screen flex justify-center items-center"
      style={{ backgroundImage: `url(${bgImage})` , backgroundSize: "cover", backgroundPosition: "center"}}
    >
      <div className="border-2 border-green-100 rounded-lg p-4 w-80 bg-white">
        <h2 className="text-center text-2xl font-bold mb-6">Login</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* User Type Field */}
          <div className="flex items-center gap-4">
            <label htmlFor="userType" className="w-24 text-right">
              User Type
            </label>
            <select
              name="userType"
              id="userType"
              className="bg-white border-2 border-green-200 rounded-lg px-4 py-2 w-full"
              value={formData.userType}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
          </div>
          {/* UserId Field */}
          <div className="flex items-center gap-4">
            <label htmlFor="userId" className="w-24 text-right">
              UserId
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              className="bg-white border-2 border-green-200 rounded-lg px-4 py-2 w-full"
              value={formData.userId}
              onChange={handleChange}
            />
          </div>
          {/* Password Field with Show Password toggle */}
          <div className="flex items-center gap-4">
            <label htmlFor="password" className="w-24 text-right">
              Password
            </label>
            <div className="relative flex items-center w-full">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="bg-white border-2 border-green-200 rounded-lg px-4 py-2 w-full"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 text-sm text-blue-500 hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-center">
            <input
              type="submit"
              value="Login"
              className="border-2 bg-green-600 rounded-lg px-4 py-2 cursor-pointer text-white"
            />
          </div>
          <div
            className="cursor-pointer text-blue-800 text-center hover:text-blue-900"
            onClick={() => navigate("/register")}
          >
            New user? Register here
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
