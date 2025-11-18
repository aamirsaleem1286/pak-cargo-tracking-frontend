import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { AppRoutes } from '../constants/AppRoutes.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PhoneNumberInput from '@/components/PhoneNumberInput';

const WhatsAppMarketing = () => {
  const [file, setFile] = useState(null);
  const [contactInput, setContactInput] = useState('');
  const [contactsByCity, setContactsByCity] = useState({});
  const [city, setCity] = useState('');
  const [numberLoading, setNumberLoading] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const navigate = useNavigate();

  const [manualContacts, setManualContacts] = useState([]);

  
  const [saveLoading, setsaveLoading] = useState(false);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

 const handleAddContact = () => {
  if (!contactInput) {
    toast.error("Contact number is required");
    return;
  }

  const trimmedContact = contactInput.trim();

  // 🔍 Check globally if number already exists
  const allNumbers = Object.values(contactsByCity).flat();
  if (allNumbers.includes(trimmedContact)) {
    toast.error("This number already exists");
    return;
  }
  
  // ✅ Add to 'unsorted' city or general group
  setContactsByCity((prev) => ({
    ...prev,
    "New Contact": [...(prev["New Contact"] || []), trimmedContact],
  }));
  
  setManualContacts((prev) => [...prev, trimmedContact]);
  setContactInput('');
  toast.success("Number Added to New Contact Successfully");
};


  const handleSelectContact = (number) => {
    setSelectedContacts((prev) =>
      prev.includes(number)
        ? prev.filter((n) => n !== number)
        : [...prev, number]
    );
  };

  const handleSelectAll = () => {
    const allNumbers = city
      ? contactsByCity[city] || []
      : Object.values(contactsByCity).flat();
    if (allNumbers.every((num) => selectedContacts.includes(num))) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(allNumbers);
    }
  };

  const handleSend = async() => {
    if (!file) {
      toast.error('Please upload a file.');
      return;
    }
    if (selectedContacts.length === 0) {
      toast.error('Please select at least one contact.');
      return;
    }
    // console.log(manualContacts);
    // if (manualContacts.length === 0) {
    //   toast.error('Please add at least one contact.');
    //   return;
    // }
    // const whatsappNumbers = ['+923493445479','+923151014701']
    // console.log(selectedContacts);
    try {
      setsaveLoading(true)
       const formData = new FormData();

    // 📎 Add the file (ensure correct field name!)
    formData.append(
      file.type.startsWith("image/")
        ? "marketingImage"
        : "marketingFile",
      file
    );

    // 📲 Add WhatsApp numbers
    // whatsappNumbers.forEach(num => formData.append('whatsappNumbers', num));
     selectedContacts.forEach(num => formData.append('whatsappNumbers', num))
      const response = await axios.post(AppRoutes.sendMediaTwhatsapp, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    toast.success(response.data?.data?.message);
    } catch (error) {
      console.log(error);
          const err = error?.response?.data?.errors;
          // if (err?.email) setEmailErr(err.email);
          if (err?.general) toast.error(err.general);
          if (!err) toast.error('Something went wrong');
    } finally {
      setsaveLoading(false)
    }
    // alert(`Message sent to ${selectedContacts.length} selected contacts.`);
  };

  // const getNumbers = async () => {
  //   try {
  //     setNumberLoading(true);
  //     const response = await axios.get(AppRoutes.allWhatsappNumber);
  //     const numbers = response?.data?.data?.result || [];
  //     const groupedContacts = {};
  //     const citySet = new Set();

  //     numbers.forEach(number => {
  //       if (number?.sender?.area && number?.sender?.number) {
  //         const area = number.sender.area.toLowerCase();
  //         citySet.add(area);
  //         if (!groupedContacts[area]) groupedContacts[area] = [];
  //         if (!groupedContacts[area].includes(number.sender.number)) {
  //           groupedContacts[area].push(number.sender.number);
  //         }
  //       }

  //       if (number?.receiver?.area) {
  //         const area = number.receiver.area.toLowerCase();
  //         citySet.add(area);
  //         if (!groupedContacts[area]) groupedContacts[area] = [];

  //         [number.receiver.number1, number.receiver.number2].forEach(num => {
  //           if (num && !groupedContacts[area].includes(num)) {
  //             groupedContacts[area].push(num);
  //           }
  //         });
  //       }
  //     });

  //     setContactsByCity(groupedContacts);
  //     setCityOptions([...citySet]);

  //   } catch (error) {
  //     console.log(error);
  //     const err = error?.response?.data?.errors;
  //     if (err?.general) toast.error(err.general);
  //     else toast.error('Something went wrong while fetching contacts');
  //   } finally {
  //     setNumberLoading(false);
  //   }
  // };

  const getNumbers = async () => {
  try {
    setNumberLoading(true);
    const response = await axios.get(AppRoutes.allWhatsappNumber);
    const numbers = response?.data?.data?.result || [];
    const groupedContacts = {};
    const citySet = new Set();
    const globalSet = new Set(); // ✅ To track unique numbers

    numbers.forEach(number => {
      // Sender
      if (number?.sender?.area && number?.sender?.number) {
        const area = number.sender.area.toLowerCase();
        citySet.add(area);
        if (!groupedContacts[area]) groupedContacts[area] = [];

        const contact = number.sender.number.trim();
        if (!globalSet.has(contact)) {
          groupedContacts[area].push(contact);
          globalSet.add(contact); // ✅ Mark as used
        }
      }

      // Receiver
      if (number?.receiver?.area) {
        const area = number.receiver.area.toLowerCase();
        citySet.add(area);
        if (!groupedContacts[area]) groupedContacts[area] = [];

        [number.receiver.number1, number.receiver.number2].forEach(num => {
          if (num) {
            const contact = num.trim();
            if (!globalSet.has(contact)) {
              groupedContacts[area].push(contact);
              globalSet.add(contact); // ✅ Mark as used
            }
          }
        });
      }
    });

    setContactsByCity(groupedContacts);
    setCityOptions([...citySet]);
  } catch (error) {
    console.log(error);
    const err = error?.response?.data?.errors;
    if (err?.general) toast.error(err.general);
    else toast.error('Something went wrong while fetching contacts');
  } finally {
    setNumberLoading(false);
  }
};

  useEffect(() => {
    getNumbers();
  }, []);

  return numberLoading ? (
    <div className="flex items-center justify-center h-screen bg-gray-50 text-purple-600 text-xl">
      Loading...
    </div>
  ) : (
    <div
      className="relative min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/w5.webp')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-white bg-opacity-95 p-8 rounded-xl shadow-2xl w-full max-w-3xl text-black">
          <button
  onClick={() => navigate(-1)}
  className="mb-4 text-blue-600 hover:underline font-semibold cursor-pointer"
>
  ← Back
</button>

          <h2 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="Logo"
              className="h-8 w-8"
            />
            WhatsApp Broadcast Panel
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full">
              <label className="block mb-1 font-semibold">Upload File</label>
              <p className="text-sm text-gray-600">
  Allowed: .mp4,.png,.jpg,.jpeg,.pdf (Max 10MB)
</p>

              <input
                type="file"
   accept=".mp4,.png,.jpg,.jpeg,.pdf"
                onChange={handleFileChange}
                className="block w-full mb-2 p-2 border rounded"
              />
              <p className="text-sm text-gray-600">Supported: .png, .jpeg, .mp4</p>

              <label className="block mt-4 font-semibold">Select City</label>
              <select
                className="mt-1 p-2 w-full rounded border"
                onChange={(e) => setCity(e.target.value)}
                value={city}
              >
                <option value="">-- SELECT CITY --</option>
                {cityOptions.map((cityName, idx) => (
                  <option key={idx} value={cityName}>
                    {cityName.charAt(0).toUpperCase() + cityName.slice(1)}
                  </option>
                ))}
              </select>

              <div className="mt-4">
                <label className="block mb-1 font-semibold">Add Contact Number</label>
                <div className="flex gap-2">
                  <PhoneNumberInput
                    name="manualContact"
                    value={contactInput}
                    handleChange={(e) => setContactInput(e.target.value)}
                  />

                  <button
                    onClick={handleAddContact}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full">
              <h3 className="font-semibold mb-2">Contact List ({city || 'All Cities'})</h3>

              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700 font-medium">
                  {selectedContacts.length} selected
                </span>
                <label className="text-sm flex items-center gap-1">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      (city
                        ? (contactsByCity[city] || []).every((n) =>
                            selectedContacts.includes(n)
                          )
                        : Object.values(contactsByCity)
                            .flat()
                            .every((n) => selectedContacts.includes(n))) &&
                      selectedContacts.length > 0
                    }
                    className="accent-blue-600 cursor-pointer"
                  />
                  Select All
                </label>
              </div>

              <div className="max-h-48 overflow-y-auto pr-2 border border-gray-300 rounded p-3 bg-gray-50">
                {city === '' ? (
                  Object.keys(contactsByCity).length === 0 ? (
                    <p className="text-gray-500 italic">No contacts available.</p>
                  ) : (
                    Object.entries(contactsByCity).map(([cityName, contacts]) => (
                      <div key={cityName} className="mb-4">
                        <h4 className="font-semibold text-gray-700 mb-1 capitalize">{cityName}</h4>
                        {contacts.map((contact, idx) => (
                          <div key={idx} className="flex justify-between mb-1 text-sm">
                            <span>{contact}</span>
                            <input
                              type="checkbox"
                              checked={selectedContacts.includes(contact)}
                              onChange={() => handleSelectContact(contact)}
                              className="accent-green-600 cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    ))
                  )
                ) : (
                  <>
                    {(contactsByCity[city] || []).map((contact, index) => (
                      <div key={index} className="flex justify-between mb-1 text-sm">
                        <span>{contact}</span>
                        <input
                          type="checkbox"
                          checked={selectedContacts.includes(contact)}
                          onChange={() => handleSelectContact(contact)}
                          className="accent-green-600"
                        />
                      </div>
                    ))}
                    {(!contactsByCity[city] || contactsByCity[city].length === 0) && (
                      <p className="text-gray-500 italic">No contacts available.</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleSend}
            disable={saveLoading}
            className={`mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 w-full rounded ${saveLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {saveLoading ? 'Sending....':'📤 Send WhatsApp Message'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppMarketing;
