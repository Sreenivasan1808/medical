import React, { useEffect, useState } from "react";
import {
  addPatientRecord,
  getPatientRecordsByDoctor,
  updatePatientRecord,
  deletePatientRecord,
} from "../services/patientSVC";
import { getDoctorById, getAiPrediction } from "../services/doctorSVC";
import { logout } from "../services/authSVC";
import { UserCircleIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";

const DoctorDashboardBento = () => {
  const [doctorName, setDoctorName] = useState("");
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    lastVisitDate: "",
    nextVisitDate: "",
    currentDiagnosis: " ",
    medication: [{ name: "", dosage: "", time: "" }],
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);

  const doctorId = localStorage.getItem("userId"); // 👈 Get doctorId from localStorage

  useEffect(() => {
    if (doctorId) {
      fetchDoctorDetails();
      fetchRecords();
    }
  }, [doctorId]);

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();

    navigate("/");
  };

  const fetchDoctorDetails = async () => {
    try {
      const doctor = await getDoctorById(doctorId);
      setDoctorName(doctor.doctorName || "Unknown Doctor");
    } catch (error) {
      console.error("Failed to fetch doctor:", error);
      setDoctorName("Unknown Doctor");
    }
  };

  const fetchRecords = async () => {
    try {
      const data = await getPatientRecordsByDoctor(doctorId);
      setRecords(data);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medication];
    updatedMedications[index][field] = value;
    setFormData((prev) => ({ ...prev, medication: updatedMedications }));
  };

  const addMedicationField = () => {
    setFormData((prev) => ({
      ...prev,
      medication: [...prev.medication, { name: "", dosage: "", time: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      patientId,
      lastVisitDate,
      currentDiagnosis,
      nextVisitDate,
      medication,
    } = formData;

    if (
      !patientId ||
      !lastVisitDate ||
      !currentDiagnosis ||
      medication.some((m) => !m.name || !m.dosage || !m.time)
    ) {
      alert("Please fill all required fields including medication.");
      return;
    }

    const recordData = {
      doctorId,
      patientId,
      lastVisitDate,
      nextVisitDate,
      currentDiagnosis,
      medication,
    };

    try {
      await addPatientRecord(recordData);
      await fetchRecords();
      setFormData({
        patientId: "",
        lastVisitDate: "",
        nextVisitDate: "",
        currentDiagnosis: "",
        medication: [{ name: "", dosage: "", time: "" }],
      });
      alert("Record added successfully");
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to add record.");
    }
  };

  const handleEditFieldChange = (index, field, value) => {
    const updated = { ...editData, [field]: value };
    setEditData(updated);
  };

  const handleEditMedicationChange = (i, field, value) => {
    const meds = [...editData.medication];
    meds[i][field] = value;
    setEditData({ ...editData, medication: meds });
  };

  const handleStartEdit = (record, index) => {
    setEditingIndex(index);
    setEditData({ ...record });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditData({});
  };

  const handleUpdateRecord = async (recordId) => {
    try {
      await updatePatientRecord(recordId, editData);
      await fetchRecords();
      handleCancelEdit();
      alert("Record updated successfully.");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update record.");
    }
  };

  const handleFileChange = async (recordId, e, disease) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // 1. upload the file to your backend
      const patientId = records[recordId].patientId;
      await getAiPrediction(patientId, file, disease);
      // 2. re-fetch the list so UI updates
      await fetchRecords();
      if(editingIndex){
        handleCancelEdit();
      }
      alert("Test results uploaded successfully.");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload test results.");
    } finally {
      // reset the input so the same file can be re‐selected if needed
      e.target.value = "";
    }
  };

  const handleDeleteRecord = async (recordId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (!confirm) return;

    try {
      await deletePatientRecord(recordId);
      await fetchRecords();
      alert("Record deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete record.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <header className="mb-6 text-center ">
        <h1 className="text-4xl font-semibold">
          Welcome <span className="text-green-500">{doctorName}</span>
        </h1>
        <div className="absolute top-0 right-0 p-4">
          <div className="relative inline-block text-left">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center justify-center space-x-1"
            >
              <UserCircleIcon className="h-10 w-10 text-gray-600 hover:text-green-500" />
              {/* Account */}
            </button>

            {showDropdown && (
              <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Record Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Add Patient Record</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Input Fields (same as before) */}
            {/* ... (keep your original input blocks here) */}
            <div className="flex items-center gap-4">
              <label htmlFor="patientId" className="w-36 text-right">
                Patient ID:
              </label>
              <input
                type="text"
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="lastVisitDate" className="w-36 text-right">
                Last Visit Date:
              </label>
              <input
                type="date"
                id="lastVisitDate"
                name="lastVisitDate"
                value={formData.lastVisitDate}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="nextVisitDate" className="w-36 text-right">
                Next Visit Date:
              </label>
              <input
                type="date"
                id="nextVisitDate"
                name="nextVisitDate"
                value={formData.nextVisitDate}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            {/* <div className="flex items-center gap-4">
              <label htmlFor="currentDiagnosis" className="w-36 text-right">
                Diagnosis:
              </label>
              <input
                type="text"
                id="currentDiagnosis"
                name="currentDiagnosis"
                value={formData.currentDiagnosis}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                required
              />
            </div> */}
            <div className="flex items-center justify-between">
              <label className="w-36 text-right">Medication:</label>
              <button
                type="button"
                onClick={addMedicationField}
                className="text-blue-500 hover:underline"
              >
                + Add
              </button>
            </div>

            {formData.medication.map((med, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={med.name}
                  onChange={(e) =>
                    handleMedicationChange(idx, "name", e.target.value)
                  }
                  className="border rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={med.dosage}
                  onChange={(e) =>
                    handleMedicationChange(idx, "dosage", e.target.value)
                  }
                  className="border rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Time"
                  value={med.time}
                  onChange={(e) =>
                    handleMedicationChange(idx, "time", e.target.value)
                  }
                  className="border rounded px-3 py-2"
                  required
                />
              </div>
            ))}

            <div className="text-center">
              <button
                type="submit"
                className="bg-green-200 border border-green-200 rounded px-6 py-2 hover:bg-green-300"
              >
                Add Record
              </button>
            </div>
          </form>
        </div>

        {/* Patient Details Display */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Patient Details</h2>
          {records.length === 0 ? (
            <p className="text-gray-500">No records available.</p>
          ) : (
            <div className="space-y-4">
              {records.map((record, index) => (
                <div
                  key={index}
                  className="border border-green-400 p-4 rounded space-y-2"
                >
                  {editingIndex === index ? (
                    <>
                      {/* Editable fields */}
                      <input
                        type="text"
                        value={editData.patientId}
                        onChange={(e) =>
                          handleEditFieldChange(
                            index,
                            "patientId",
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                      <input
                        type="date"
                        value={editData.lastVisitDate?.slice(0, 10)}
                        onChange={(e) =>
                          handleEditFieldChange(
                            index,
                            "lastVisitDate",
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                      <input
                        type="date"
                        value={editData.nextVisitDate?.slice(0, 10) || ""}
                        onChange={(e) =>
                          handleEditFieldChange(
                            index,
                            "nextVisitDate",
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                      {/* <input
                        type="text"
                        value={editData.currentDiagnosis}
                        onChange={(e) =>
                          handleEditFieldChange(
                            index,
                            "currentDiagnosis",
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      /> */}
                      <div className="flex gap-2 items-center">
                      <p>AI Diagnosis for Parkinson Disease: </p>
                        <label
                          htmlFor="file-upload"
                          className="bg-green-300 rounded-lg px-4 py-2 hover:scale-95 hover:cursor-pointer"
                        >
                          Upload test results
                        </label>
                        <input
                          className="border-2 py-2 px-4 bg-green-100 rounded-lg hidden hover:scale-95"
                          id="file-upload"
                          type="file"
                          accept=".csv"
                          onChange={(e) => handleFileChange(index, e, 1)}
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                      <p>AI Diagnosis for Diabetes: </p>
                        <label
                          htmlFor="file-upload2"
                          className="bg-green-300 rounded-lg px-4 py-2 hover:scale-95 hover:cursor-pointer"
                        >
                          Upload test results
                        </label>
                        <input
                          className="border-2 py-2 px-4 bg-green-100 rounded-lg hidden hover:scale-95"
                          id="file-upload2"
                          name="diabetes"
                          type="file"
                          accept=".csv"
                          onChange={(e) => handleFileChange(index, e, 2)}
                        />
                      </div>
                      <div className="space-y-1">
                        {editData.medication?.map((med, i) => (
                          <div key={i} className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={med.name}
                              onChange={(e) =>
                                handleEditMedicationChange(
                                  i,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1"
                            />
                            <input
                              type="text"
                              value={med.dosage}
                              onChange={(e) =>
                                handleEditMedicationChange(
                                  i,
                                  "dosage",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1"
                            />
                            <input
                              type="text"
                              value={med.time}
                              onChange={(e) =>
                                handleEditMedicationChange(
                                  i,
                                  "time",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateRecord(record._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-300 text-black px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Normal view */}
                      <p>
                        <span className="font-semibold">Patient ID:</span>{" "}
                        {record.patientId}
                      </p>
                      <p>
                        <span className="font-semibold">Last Visit:</span>{" "}
                        {new Date(record.lastVisitDate).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-semibold">Next Visit:</span>{" "}
                        {record.nextVisitDate
                          ? new Date(record.nextVisitDate).toLocaleDateString()
                          : "-"}
                      </p>
                      {/* <p>
                        <span className="font-semibold">Diagnosis:</span>{" "}
                        {record.currentDiagnosis}
                      </p> */}
                      <p>
                        <span className="font-semibold">AI Diagnosis for Parkinson Disease:</span>{" "}
                        {record.aiDiagnosis ? (
                          record.aiDiagnosis
                        ) : (
                          <>
                            <label
                              htmlFor="file-upload"
                              className="bg-green-300 rounded-lg px-4 py-2 hover:scale-95 hover:cursor-pointer"
                            >
                              Upload test results
                            </label>
                            <input
                              className="border-2 py-2 px-4 bg-green-100 rounded-lg hidden hover:cursor-pointer hover:scale-95"
                              id="file-upload"
                              type="file"
                              accept=".csv"
                              onChange={(e) => handleFileChange(index, e, 1)}
                            />
                          </>
                        )}
                      </p>
                      <p>
                        <span className="font-semibold">AI Diagnosis for Diabetes:</span>{" "}
                        {record.diabetesDiagnosis ? (
                          record.diabetesDiagnosis
                        ) : (
                          <>
                            <label
                              htmlFor="file-upload"
                              className="bg-green-300 rounded-lg px-4 py-2 hover:scale-95 hover:cursor-pointer"
                            >
                              Upload test results
                            </label>
                            <input
                              className="border-2 py-2 px-4 bg-green-100 rounded-lg hidden hover:cursor-pointer hover:scale-95"
                              id="file-upload"
                              type="file"
                              accept=".csv"
                              onChange={(e) => handleFileChange(index, e, 2)}
                            />
                          </>
                        )}
                      </p>
                      <div>
                        <span className="font-semibold">Medication:</span>
                        {record.medication?.length > 0 ? (
                          <ul className="list-disc ml-6 mt-1">
                            {record.medication.map((med, i) => (
                              <li key={i}>
                                <span className="font-medium">{med.name}</span>{" "}
                                — {med.dosage}, {med.time}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="ml-2">-</span>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3 mt-3 justify-end">
                        <button
                          onClick={() => handleStartEdit(record, index)}
                          className="text-white hover:underline bg-green-600 rounded-lg px-4 py-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record._id)}
                          className="text-white hover:underline bg-red-500 rounded-lg px-4 py-2"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardBento;
