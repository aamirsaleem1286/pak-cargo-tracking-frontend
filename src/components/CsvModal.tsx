// import {useEffect, useState} from 'react'
// import { toast } from 'react-toastify';
// import { exportToExcel } from '../lib/helper/excel-booking';
// // import {CSVLink} from 'react-csv'
// const CsvModal = ({ setShowModal, branches, bookings }) => {
//     // console.log(branches);
//     const [branch,setBranch] = useState('')   
    
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");
//     const [error, setError] = useState('')   

//   const handleExport = () => {
//   if (!branch) {
//     setError("Branch is required");
//   } else if (!startDate) {
//     setError("Start Date is required");
//   } else if (!endDate) {
//     setError("End Date is required");
//   } else if (new Date(endDate) < new Date(startDate)) {
//     setError("End Date cannot be earlier than Start Date");
//   } else {
//     setError("");

//     const filtered = bookings.filter((b) => {
//       const bookingDate = new Date(b.BookingDate);
//       return (
//         // agar branch == "ALL" hai to branch check skip karo
//         (branch === "ALL" || b.Branch === branch) &&
//         bookingDate >= new Date(startDate) &&
//         bookingDate <= new Date(endDate)
//       );
//     });

//     if (filtered.length === 0) {
//       toast.error("No bookings found for selected filters");
//       return;
//     }

//     console.log(filtered);
//     exportToExcel(filtered);
//   }
// };

//     useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => setError(""), 10000);
//         return () => { clearTimeout(timer); console.log("unmount");
//         }; // cleanup on unmount/re-render
//     }
//     }, [error]);
//     // console.log(bookings);
//     let bookingDate =  bookings.map(booking=> booking.BookingDate )
  
//   bookingDate =  [...new Set(bookingDate)] //Set duplicates hata diye, ... (spread)  Set ko wapas array bana diya.
//     console.log(bookingDate);
    
//     return (
//       <div className="mt-20 fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//         <div className="bg-white rounded-lg shadow-lg w-96 p-6">
//           <h2 className="text-xl font-bold mb-4 text-center">
//             Export to xlsx Options
//           </h2>
//           {error && (
//             <p className="text-sm text-red-600 mt-1 text center mb-2 text-center font-bold">
//               {error}
//             </p>
//           )}
//           {/* Branch Select */}
//           <div className="mb-4">
//             <label className="block mb-1 font-semibold">Select Branch</label>
//      <select
//   value={branch}
//   onChange={(e) => setBranch(e.target.value)}
//   className="w-full border rounded px-3 py-2"
// >
//   <option value="">-- Select Branch --</option>
//   <option value="ALL">All Branches</option>
//   {branches.map((b, index) => (
//     <option key={index} value={b.branch}>
//       {b.branch}
//     </option>
//   ))}
// </select>
//           </div>

//           {/* Date Range */}
//           <div className="mb-4">
//             <label className="block mb-1 font-semibold">Start Date</label>
//             {/* <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="w-full border rounded px-3 py-2"
//               /> */}
//             <select
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="w-full border rounded px-3 py-2"
//             >
//               <option value="">-- Select Start Date --</option>
//               {bookingDate.map((bookingDate, index) => (
//                 <option value={bookingDate} key={index}>
//                   {bookingDate}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block mb-1 font-semibold">End Date</label>
//             {/* <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="w-full border rounded px-3 py-2"
//               /> */}
//             <select
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="w-full border rounded px-3 py-2"
//             >
//               <option value="">-- Select End Date --</option>
//               {bookingDate.map((bookingDate, index) => (
//                 <option value={bookingDate} key={index}>
//                   {bookingDate}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-between">
//             <button
//               onClick={() => setShowModal(false)}
//               className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleExport}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
//             >
//               Export
//             </button>
//           </div>
//         </div>
//       </div>
//     );
// }

// export default CsvModal








import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { exportToExcel } from '../lib/helper/excel-booking';

// ✅ Parse "DD-MM-YYYY" format (e.g., "26-10-2025")
const parseBookingDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return new Date(NaN);
  
  const parts = dateStr.split('-');
  if (parts.length !== 3) return new Date(NaN); // Not DD-MM-YYYY

  const [day, month, year] = parts.map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return new Date(NaN);

  // Validate
  if (day < 1 || day > 31 || month < 1 || month > 12) return new Date(NaN);

  return new Date(year, month - 1, day); // month is 0-indexed
};

const CsvModal = ({ setShowModal, branches, bookings }) => {
  const [branch, setBranch] = useState('');
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState('');

  const handleExport = () => {
    if (!branch) {
      setError("Branch is required");
    } else if (!startDate) {
      setError("Start Date is required");
    } else if (!endDate) {
      setError("End Date is required");
    } else {
      const start = parseBookingDate(startDate);
      const end = parseBookingDate(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setError("Invalid date format. Expected: DD-MM-YYYY (e.g., 26-10-2025)");
        return;
      }

      if (end < start) {
        setError("End Date cannot be earlier than Start Date");
        return;
      }

      setError("");

      const filtered = bookings.filter((b) => {
        const bookingDate = parseBookingDate(b.BookingDate);
        if (isNaN(bookingDate.getTime())) {
          console.warn("⚠️ Invalid BookingDate:", b.BookingDate);
          return false;
        }

        return (
          (branch === "ALL" || b.Branch === branch) &&
          bookingDate >= start &&
          bookingDate <= end
        );
      });

      if (filtered.length === 0) {
        toast.error("No bookings found for selected filters");
        return;
      }

      console.log("✅ Exporting", filtered.length, "bookings");
      exportToExcel(filtered);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Get unique dates (as they appear: "26-10-2025")
  const uniqueDates = [...new Set(bookings.map(b => b.BookingDate).filter(Boolean).sort())];

  return (
    <div className="mt-20 fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold mb-4 text-center">
          Export to xlsx Options
        </h2>
        {error && (
          <p className="text-sm text-red-600 mt-1 mb-2 text-center font-bold">
            {error}
          </p>
        )}
        {/* Branch */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Select Branch</label>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select Branch --</option>
            <option value="ALL">All Branches</option>
            {branches.map((b, index) => (
              <option key={index} value={b.branch}>
                {b.branch}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Start Date</label>
          <select
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select Start Date --</option>
            {uniqueDates.map((date, index) => (
              <option value={date} key={index}>
                {date}
              </option>
            ))}
          </select>
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">End Date</label>
          <select
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select End Date --</option>
            {uniqueDates.map((date, index) => (
              <option value={date} key={index}>
                {date}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default CsvModal;