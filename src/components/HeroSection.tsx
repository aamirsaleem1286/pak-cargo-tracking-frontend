import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/final1200x600.png";
import TrackingModal from "./TrackingModal";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'
const HeroSection = () => {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
   
                    if (name === "invoiceNo") {
            // Sirf digits allow karo aur max 12 tak
            const alphaNumeric = value.replace(/[^a-zA-Z0-9]/g, "");
            //if (onlyNumbers.length <= 12) {
              setTrackingNumber(alphaNumeric)
            //}
            return;
          }
  }
  const handleTrack = () => {
    // if (trackingNumber.length !== 12) {
    //   toast.error("Tracking No must be exactly 12 digits");
    //   return;
    // }
    navigate(`/track/?invoice=${trackingNumber}`)
  };
  return (
    <section className="relative flex items-center pt-16 sm:min-h-full xl:mb-64">
      {/* Background Image */}
      <div className="bg-black absolute inset-0 z-0 h-[40vh]">
        <img
          src={heroImage}
          alt="Professional delivery service"
          className="w-full object-cover h-[50vh] sm:h-[40vh] md:h-[70vh] lg:h-[80vh] xl:h-[90vh]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent
                       md:h-[70vh] lg:h-[80vh] xl:h-[90vh] 2xl:h-[90vh] h-[40vh]"></div>
      </div>

      <div className="relative z-10 px-4 lg:px-8 lg:mt-44 md:mt-20 2xl:w-1/2">
        <div className="grid lg:grid-cols-1 gap-8">
          {/* Hero Content */}
       <div className="text-left ">
 <h1 className="mt-[40px]  text-4xl lg:text-4xl md:text-3xl sm:text-2xl font-bold text-white leading-tight mb-2">
  Delivering happiness across the world.
</h1>

  <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-lg">
    Fast and secure cargo & couriers.
  </p>

  {/* Tracking Section */}
<div className="bg-white/95 backdrop-blur rounded-lg p-4 sm:p-7 shadow-xl 
max-w-screen-lg mt-4 sm:mt-[-30px] w-[95%] sm:w-12/12 lg:w-2/2 lg:p-4">

  {/* Input + Button Container */}
  <div className="flex flex-col sm:flex-row items-center gap-3 w-full">

    {/* Input Field */}
    <Input
      type="text"
      placeholder="Enter Invoice No."
      value={trackingNumber}
      onChange={handleChange}
      name="invoiceNo"
      className="flex-1 h-12 w-full sm:w-auto text-center sm:text-left 
      placeholder:text-lg sm:placeholder:text-base text-gray-800 font-medium
      border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
      style={{ fontSize: "18px" }}
    />

    {/* Track Button */}
    <Button
      onClick={handleTrack}
      className="bg-red-500 hover:bg-red-600 h-12 w-full 
      text-lg sm:text-base text-white font-semibold px-10 py-2 
      rounded-md transition-all duration-300 sm:h-10 sm:w-14 md:w-16"
    >
      TRACK IT
    </Button>
  </div>
</div>
</div></div></div>
      {/* Floating Track Package Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsTrackingModalOpen(true)}
          className="bg-brand-blue  hover:bg-blue-600 text-white rounded-full px-6 py-3 shadow-lg font-medium"
        >
          📦 Track Package
        </Button>
      </div>

      {/* Tracking Modal */}
      <TrackingModal
        open={isTrackingModalOpen}
        onOpenChange={setIsTrackingModalOpen}
      />
    </section>
  );
};

export default HeroSection;