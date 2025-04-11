import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;

export const addPatientRecord = async (recordData: any) => {
  try {
    const response = await axios.post(
      `${SERVER_URL}/patient-records`,
      recordData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding patient record:", error);
    throw error;
  }
};

export const getPatientRecordsByDoctor = async (doctorId) => {
  const response = await axios.get(
    `${SERVER_URL}/patient-records/doctor/${doctorId}`
  );
  return response.data;
};

export const updatePatientRecord = async (recordId, updatedData) => {
  try {
    const res = await axios.put(`${SERVER_URL}/patient-records/${recordId}`, updatedData);
    return res.data;
  } catch (err) {
    throw new Error("Failed to update patient record");
  }
};

export const deletePatientRecord = async (recordId) => {
  try {
    const res = await axios.delete(`${SERVER_URL}/patient-records/${recordId}`);
    return res.data;
  } catch (err) {
    throw new Error("Failed to delete patient record");
  }
};


export const getPatientById = async (patientId) => {
  const response = await axios.get(`${SERVER_URL}/patient/${patientId}`);
  return response.data.patient;
}

export const getPatientRecordsByPatient = async (patientId) => {
  const response = await axios.get(
    `${SERVER_URL}/patient-records/patient/${patientId}`
  );
  return response.data;
}


