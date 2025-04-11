import DoctorDashboard from "../components/DoctorDashboard";
import PatientDashboard from "../components/PatientDashboard";


const Home = () => {
    const userType = localStorage.getItem("userType");
  return (
    <div>
      {userType == 'doctor' ? <DoctorDashboard/> : <PatientDashboard/>}
    </div>
  )
}

export default Home
