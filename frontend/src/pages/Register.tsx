import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerDoctor, registerPatient } from "../services/authSVC";
import bgImage from "../assets/bg.jpg";

const Register = () => {
  const [userType, setUserType] = useState("doctor"); // default registration type
  const [formData, setFormData] = useState({
    // Doctor fields
    doctorId: "",
    doctorName: "",
    contactNumber: "",
    password: "",
    specialization: "",
    // Patient fields
    patientId: "",
    patientName: "",
    age: "",
    gender: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Example registration logic: use different API calls for doctor vs. patient
    if (userType === "doctor") {
      const response = await registerDoctor(formData);
      if (response == true) {
        alert("Registration success");
        navigate("/login");
      } else {
        alert("Doctor registration failed");
      }
      console.log("Registering doctor with", formData);
    } else {
      const response = await registerPatient(formData);
      if (response == true) {
        alert("Registration success");
        navigate("/login");
      } else {
        alert("Patient registration failed");
      }
      console.log("Registering patient with", formData);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-50"
    style={{ backgroundImage: `url(${bgImage})` , backgroundSize: "cover", backgroundPosition: "center"}}>
      <div className="border-2 border-green-100 rounded-lg p-6 w-96 shadow-lg bg-white">
        <h2 className="text-center text-2xl font-bold mb-6">Register</h2>
        {/* Registration Type Selector */}
        <div className="flex justify-center mb-6">
          <select
            value={userType}
            onChange={handleUserTypeChange}
            className="bg-white border-2 border-green-200 rounded-lg px-4 py-2"
          >
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {userType === "doctor" ? (
            // Registration form for Doctor
            <>
              <div className="flex items-center gap-4">
                <label htmlFor="doctorId" className="w-28 text-right">
                  Doctor ID
                </label>
                <input
                  type="text"
                  id="doctorId"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  className="bg-white border-2 border-green-200 rounded-lg px-4 py-2 w-full"
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <label htmlFor="doctorName" className="w-28 text-right">
                  Doctor Name
                </label>
                <input
                  type="text"
                  id="doctorName"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                  className="bg-white border-2 border-green-200 rounded-lg px-4 py-2 w-full"
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <label htmlFor="contactNumber" className="w-28 text-right">
                  Contact
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="bg-white border-2 border-green-200 rounded-lg px-4 py-2 w-full"
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <label htmlFor="password" className="w-28 text-right">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white border-2 border-green-200 rounded-lg px-4 py-2 w-full"
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <label htmlFor="specialization" className="w-28 text-right">
                  Specialization
                </label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="bg-white border-2 border-green-200 rounded-lg px-4 py-2 w-full"
                />
              </div>
            </>
          ) : (
            // Registration form for Patient
            <>
              <div className="flex items-center gap-4">
                <label htmlFor="patientId" className="w-28 text-right">
                  Patient ID
                </label>
                <input
                  type="text"
                  id="patientId"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className="bg-white border-2 border-green-200 rounded-lg px-4 py-2 w-full"
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <label htmlFor="patientName" className="w-28 text-right">
                  Patient Name
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="bg-white border-2 border-green-200 rounded-lg px-4 py-2 w-full"
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <label htmlFor="age" className="w-28 text-right">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="bg-white border-2 border-green-200 rounded-lg px-4 py-2 w-full"
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <label htmlFor="gender" className="w-28 text-right">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="bg-white border-2 border-green-200 rounded-lg px-4 py-2 w-full"
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label htmlFor="contactNumber" className="w-28 text-right">
                  Contact
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="bg-white border-2 border-green-200 rounded-lg px-4 py-2 w-full"
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <label htmlFor="password" className="w-28 text-right">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white border-2 border-green-200 rounded-lg px-4 py-2 w-full"
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <label htmlFor="address" className="w-28 text-right">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="bg-white border-2 border-green-200 rounded-lg px-4 py-2 w-full"
                  required
                />
              </div>
            </>
          )}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="border-2 bg-green-200 rounded-lg px-4 py-2"
            >
              Register
            </button>
          </div>
          <div
            className="cursor-pointer text-blue-800 text-center hover:text-blue-900"
            onClick={() => navigate("/login")}
          >
            Already have an account? Click here to login
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
