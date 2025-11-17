import React from 'react'
import ImageContact from "../../assets/delivery-male-with-packages.jpg";

const ContactHeader = () => {
  return (
    <>
      <div className="mt-20 relative">
        <div className="">
          <div className="absolute inset-0 bg-black opacity-70"></div>
          <h1 className="text-6xl text-white font-bold text-center mb-8 absolute  bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            Contact Us
          </h1>
          <p className="text-2xl text-white font-bold text-center absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            Get In Touch With Us
          </p>
        </div>
        <img
          src={ImageContact}
          alt="Professional delivery service"
          className="w-full h-96 object-cover"
        />
      </div>
    </>
  );
}

export default ContactHeader