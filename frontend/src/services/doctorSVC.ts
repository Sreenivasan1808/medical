import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;

export const getDoctorById = async (doctorId) => {
    
  const response = await axios.get(`${SERVER_URL}/doctor/${doctorId}`);
  
  return response.data;
};
