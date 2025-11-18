
import Logo from "@/assets/logo.jpg";
import { Divider, Field } from "@/components/TrackingData/TrackCompo";
import { TrackingDetails } from "@/components/TrackingData/TrackingDetails";
import { TrackingHistory } from "@/components/TrackingData/TrackingHistory";
import { AppRoutes } from "@/constants/AppRoutes";
import axios from "axios";
import { useEffect, useState } from "react";
import {useNavigate,useSearchParams} from 'react-router-dom'

const BackToHomeButton = ({ navigate }: { navigate: (path: string) => void }) => (
    <div className="mt-8 flex justify-center">
        <button
            onClick={() => navigate('/')}
            className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            Back to Pak Chinar Int'I Cargo Home
        </button>
    </div>
);

const Loader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            {/* Tailwind CSS spinner */}
            <svg className="animate-spin h-10 w-10 text-blue-700 mx-auto" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <p className="mt-4 text-gray-600">Loading tracking data...</p>
        </div>
    </div>
);

const ErrorDisplay = ({ errorMessage, navigate }: { errorMessage: string | null, navigate: (path: string) => void }) => (
    <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600">Tracking Failed </h2>
            <p className="mt-4 text-gray-700">{errorMessage || "An unknown error occurred while fetching the tracking details."}</p>
            <BackToHomeButton navigate={navigate} />
        </div>
    </div>
);

export default function Tracking() {
  const navigate = useNavigate() 
  // Dummy data — replace with your real API response
  const [searchParam] = useSearchParams()
  const invoiceNumber = searchParam.get('invoice')
  // console.log(invoiceNumber);
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState(null);
  // const [shipmentContainerDetails, setShipmentContainerDetails] = useState([]);
  const [trackingDetails, setTrackingDetails] = useState([]);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const handleSearch = async() => {
    try {
      setLoading(true)
      const response = await axios.get(`${AppRoutes.tracking}/${invoiceNumber}`)
      const data = response.data
      console.log(data);

      setTrackingData(data?.data?.foundTrackingId)
      // setShipmentContainerDetails(data?.data?.shipmentParts)
      setTrackingDetails(data?.data?.foundTrackingId?.tracking_details)
      console.log("track detail",data?.data?.foundTrackingId?.tracking_details)
      setTrackingHistory(data?.data?.foundTrackingId?.tracking_history)
            console.log("track history",data?.data?.foundTrackingId?.tracking_history)

    } catch (error) {
      if (axios.isAxiosError(error)) {
            // Check if it's a network/connection error (no response)
            if (!error.response) {
                setError("Network Error: Please check your internet connection."); // 💡 Internet error message
                return;
            }
            
            // Handle specific server-side errors (validation errors)
            const errResponse = error.response.data;
            if (errResponse?.errors?.trackingId) {
                setError(errResponse.errors.trackingId);
            } else if (errResponse?.errors?.general) {
                setError(errResponse.errors.general);
            } else {
                setError(`Server Error (${error.response.status}): Could not fetch tracking details.`);
            }
        } else {
            // Handle unexpected errors
            setError('An unexpected error occurred.');
        }
    }
    finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    handleSearch()
  },[invoiceNumber])
  const invoice = {
    number: "S0169743",
    date: "08/08/2025",
    bookingOffice: "HEAD OFFICE",
    sender: "PUNJAB EXPRESS CARGO",
    receiver: "ROJIN KUMAR RAM",
    docketNo: "—",
    toLocation: "Madhu ban-",
    localTransporter: "—",
    totalWeight: "43",
    pieces: 1,
    currentStatusDate: "04 Sep 2025",
    currentStatus: "SHIPMENT CLEARED at NEW DELHI–INDIA",
  };
  if (loading) {
  return <Loader/> 
  } 
  if (error) {
  return <ErrorDisplay navigate={navigate} errorMessage={error}/> 
  } 
// console.log(trackingDetails);

  return (
    <div className="lg:min-h-screen bg-white text-gray-800">
      {/* Top spacing to mimic screenshot white space */}
      <div className="h-8" />

      <main className="mx-auto max-w-full px-4">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img
            src={Logo}
            alt="Professional delivery service"
            className="w-28  rounded-2xl"
          />
          <div className="pl-3">
            <h3 className="text-red-700 text-6xl font-bold text-center ">
              PCC
            </h3>
            <p className="text-3xl lg:text-6xl text-red-700 -mt-1">
              Pak Chinar Int'I Cargo
            </p>
          </div>
        </div>

        {/* System title */}
        <p className="mt-2 text-center lg:text-3xl tracking-wider ">
          Consignment Tracking System
        </p>

      {/* Tracking Details */}
<h1 className="mt-3 text-center text-2xl lg:text-6xl font-semibold">
  Tracking Details for{" "}
  <span className="text-blue-700">{invoiceNumber}</span>
</h1>

<Divider className="lg:mx-auto mt-2 lg:max-w-xs" />

{trackingDetails.length > 0 &&
  trackingDetails.map((detail, index) => {
    // Filter related history for this detail
 const relatedHistory = trackingHistory.filter(
  history => history.containerNumber === detail.containerNumber 
           || history.containerNumber === "N/A"
);

    return (
      <div key={index} className=" w-full ml-[-10px] mt-6 border rounded-lg p-4 shadow-sm mx-40 bg-white-50">
        {/* Tracking Detail */}
        <TrackingDetails
          trackingData={trackingData}
          trackingDetails={detail}
          BookingDate={trackingData.BookingDate}
        />

        {/* Related History for this detail */}
        {relatedHistory.length > 0 && (
          <>
            <h3 className="mt-4 ml-8 text-center text-md font-semibold text-gray-700 lg:text-6xl text-3xl">
              History for Container:{" "}
              <span className="text-blue-600">{detail.containerNumber === "N/A" ?"#":detail.containerNumber}</span>
            </h3>
            <Divider className="w-full mt-2" />
            <TrackingHistory trackingHistory={relatedHistory} />
          </>
        )}
      </div>
    );
  })}

    
       {/* <TrackingHistory/> */}
        {/* Back button */}
        <BackToHomeButton navigate={navigate}/>

        <div className="h-10" />
      </main>
    </div>
  );
}


