import { toast, ToastContainer } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import { fetchPatientMedicines } from "../../../functions/Fetch";
import { deletePatientMedicine } from "../../../functions/Delete";
import PatientMedicineCard from "./PatientMedicineCard";
import { MagnifyingGlass } from "react-loader-spinner";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Link } from "react-router-dom";

const PatientMedicines = () => {
  const [patientMedicines, setPatientMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPatientMedicines = async () => {
    setLoading(true);
    try {
      const response = await fetchPatientMedicines();
      setPatientMedicines(response.data);
    } catch (error) {
      toast.error("Error fetching patient medicines");
    } finally {
       setLoading(false);
    }
  }

  useEffect(() => { loadPatientMedicines(); }, []);


  const handleDeleteClick = (patientMedicineId) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this medicine?',
      buttons: [
        { label: 'Yes', onClick: async () => {
          try {
            const { status } = await deletePatientMedicine(patientMedicineId);
            status === 200 ? toast.success("Patient Medicine deleted") : toast.error("Failed to delete patient medicine");
            if (status === 200) loadPatientMedicines();
          } catch {
            toast.error("Error deleting medicine");
          }
        }},
        { label: 'No' }
      ]
    });
  };

  const handleDoubleClick = (patientMedicineId) => {
    navigator.clipboard.writeText(patientMedicineId)
      .then(() => toast.success("Patient Medicine ID copied"))
      .catch(() => toast.error("Failed to copy Medicine Entry ID"));
  };

  return (
    <div className="container w-full min-h-screen flex flex-col p-4">
      <ToastContainer />
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <MagnifyingGlass visible={true} height="80" width="80" glassColor="#c0efff" color="#e15b64" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800 flex flex-col justify-center items-center gap-2 rounded-lg shadow-md h-32 w-full relative">
            <div className="w-12 h-12 bg-blue-600 flex items-center justify-center rounded-full">
              <Link to="/" className="text-white">
              <FaPlus size={24} /> </Link>
            </div>
            <h4 className="text-white text-lg font-semibold">Add Patient Medicine</h4>
          </div>
          {patientMedicines.map((patientMedicine) => (
            <PatientMedicineCard
              key={patientMedicine._id}
              patientMedicine={patientMedicine}
              handleDeleteClick={handleDeleteClick}
              handleDoubleClick={handleDoubleClick}
            />
          ))}
        </div>
      )}


    </div>
  );
};

export default PatientMedicines;
