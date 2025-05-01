import { useNavigate } from "react-router-dom";
import { logout } from "../services/authSVC";
import { useEffect, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/16/solid";
import { getPatientById, getPatientRecordsByPatient } from "../services/patientSVC";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [records, setRecords] = useState([]);

  const patientId = localStorage.getItem("userId");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const fetchDoctorDetails = async () => {
    try {
      const patient = await getPatientById(patientId);
      setPatientName(patient.patientName || "Unknown Patient");
    } catch (error) {
      console.error("Failed to fetch doctor:", error);
      setPatientName("Unknown Patient");
    }
  };

  const fetchPatientRecords = async () => {
    try {
      const data = await getPatientRecordsByPatient(patientId);
      setRecords(data);
    } catch (error) {
      console.error("Error fetching patient records:", error);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchDoctorDetails();
      fetchPatientRecords();
    }
  }, [patientId]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-semibold">
          Welcome <span className="text-green-500">{patientName}</span>
        </h1>
        <div className="absolute top-0 right-0 p-4">
          <div className="relative inline-block text-left">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center space-x-1"
            >
              <UserCircleIcon className="h-10 w-10 text-gray-600 hover:text-green-500" />
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

      {/* Records */}
      <section className="grid gap-6 ">
        {records.length > 0 ? (
          records.map((record, index) => (
            <div key={index} className="bg-white p-4 rounded-2xl shadow-md border-2 border-green-400 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Diagnosis: <span className="text-green-600">{record.currentDiagnosis}</span>
              </h2>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                AI Diagnosis for Parkinson Disease: <span className="text-green-600">{record.aiDiagnosis}</span>
              </h2>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                AI Diagnosis for Diabetes: <span className="text-green-600">{record.diabetesDiagnosis}</span>
              </h2>
              <p className="text-sm text-gray-600">
                Last Visit: <span className="font-semibold">{new Date(record.lastVisitDate).toLocaleDateString()}</span> | Next Visit:{" "}
                <span className="font-semibold">{new Date(record.nextVisitDate).toLocaleDateString()}</span>
              </p>
              <p>Consulted Doctor: <span className="font-semibold">Dr. {record.doctorName}</span></p>

              {/* Medication Table */}
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-1">Medications</h3>
                <table className="w-full table-auto border border-gray-200">
                  <thead className="bg-gray-100 text-gray-700 text-sm">
                    <tr>
                      <th className="border px-3 py-1">Name</th>
                      <th className="border px-3 py-1">Dosage</th>
                      <th className="border px-3 py-1">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.medication.map((med, idx) => (
                      <tr key={idx} className="text-sm text-gray-700">
                        <td className="border px-3 py-1">{med.name}</td>
                        <td className="border px-3 py-1">{med.dosage}</td>
                        <td className="border px-3 py-1">{med.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No records found.</p>
        )}
      </section>
    </div>
  );
};

export default PatientDashboard;
