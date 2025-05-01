import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;

export const getDoctorById = async (doctorId) => {
  const response = await axios.get(`${SERVER_URL}/doctor/${doctorId}`);
  return response.data;
};

export const getAiPrediction = async (patientId, file, disease) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // your CSV File object
    formData.append("patientId", patientId); // the patientId field
    // formData.append("disease", disease); // the patientId field

    // axios will pick up the correct Content-Type header for you
    let response;
    if(disease == 1)
      response = await axios.post(`${SERVER_URL}/ml/predict/parkinson`, formData);
    else
      response = await axios.post(`${SERVER_URL}/ml/predict/diabetes`, formData);

    return response.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};
