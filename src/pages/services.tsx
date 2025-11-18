import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Services = () => {
  const [userAccess, setUserAccess] = useState([]);

  useEffect(() => {
    // ✅ Fetch user access from sessionStorage (set this after login)
    const accessData = sessionStorage.getItem("accessPages");
    if (accessData) {
      try {
        setUserAccess(JSON.parse(accessData));
      } catch {
        setUserAccess([]);
      }
    }
  }, []);

  // ✅ All available pages in your app
  const allPages = [
    { label: "Create Container", path: "/container" },
    { label: "Containers Lists", path: "/all-containers" },
    { label: "Track Your Deliveries", path: "/" },
    { label: "Admin Panel", path: "/admin-pannel" },
    { label: "Whatsapp-Media", path: "/whatsapp-marketing" },
    { label: "Update Status", path: "/update-status" },
    { label: "Home", path: "/" },
    { label: "Create Booking", path: "/add-booking" },
    { label: "Bookings Lists", path: "/all-bookings" },

    { label: "Services", path: "/services" },
  ];

  // ✅ Filter pages based on user’s allowed access
  const visibleLinks =
    userAccess.length > 0
      ? allPages.filter((page) => userAccess.includes(page.path))
      : [];

  return (
    <div className="flex justify-center items-center px-8 h-[87vh] bg-[#2596be]">
      <div>
        <h2 className="text-white text-3xl font-bold mb-8 text-center">
          Available Services
        </h2>

        {visibleLinks.length > 0 ? (
          <ul className="grid grid-cols-3 gap-8 text-center text-2xl">
            {visibleLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </ul>
        ) : (
          <p className="text-white text-center text-lg">
            🚫 You don't have access to any services yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Services;
