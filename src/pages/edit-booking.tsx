import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { AppRoutes } from "../constants/AppRoutes";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../components/Header";
import EditInvoiceForm from "../components/EditInvoiceForm";

const EditBooking = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const { loading } = useAuth(); // 👈 make sure this is a hook call
  const [branchList, setBranchList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  const [loadingList, setLoadingList] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!loading) setLoadingList(true);

        const [branchRes, cityRes, bookingRes] = await Promise.all([
          axios.get(AppRoutes.allBranch),
          axios.get(AppRoutes.allCity),
          axios.get(`${AppRoutes.getBookingById}/${id}`),
        ]);

        setBranchList(branchRes.data?.data?.allBranches || []);
        setCityList(cityRes.data?.data?.allCities || []);
        setBookingData(bookingRes.data?.data?.builtyRecord || {});
      } catch (error) {
        const err = error?.response?.data?.errors;
        if (err?.general) toast.error(err.general);
        else toast.error('Something went wrong while fetching data.');
      } finally {
        if (!loading) setLoadingList(false);
      }
    };

    fetchData();
  }, [id, loading]);

  return (
    <div>
      <Header />
      {
        loadingList ? 
       (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-purple-600 text-xl">
        Loading...
      </div>
    ):
    (<EditInvoiceForm
      id={id}
      branchList={branchList}
      cityList={cityList}
      bookingData={bookingData}
      loadingList={loadingList}
    />)
      }
    </div>
  );
};

export default EditBooking;
