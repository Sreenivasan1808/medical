import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;

export const login = async (
  userType: string,
  userId: string,
  password: string
) => {
  try {
    const response = await axios.post(`${SERVER_URL}/auth/login`, {
      userType: userType,
      userId: userId,
      password: password,
    });
    if (response.status == 200) {
      if (response.data.message.includes("Success")) {
        localStorage.setItem("userType", response.data.userType);
        localStorage.setItem("userId", response.data.userId);
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const logout = async () => {
  const userType = localStorage.getItem("userType");
  const userId = localStorage.getItem("userId");
  if (userType !== null && userId !== null) {
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    return true;
  } else {
    return false;
  }
};

export const registerDoctor = async (details: unknown) => {
  try {
    const response = await axios.post(`${SERVER_URL}/auth/register/doctor`, {
      details: details,
    });
    if (response.status == 200) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const registerPatient = async (details: unknown) => {
  try {
    const response = await axios.post(`${SERVER_URL}/auth/register/patient`, {
      details: details,
    });
    if (response.status == 200) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
