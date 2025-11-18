  import React,{useState,useEffect} from 'react'
  import {numberToWords} from '../lib/helper/numberToWord'
  import { toast } from 'react-toastify';
  import axios from 'axios';
  import { AppRoutes } from '../constants/AppRoutes';
import { handlePdfSave } from '../lib/helper/pdfGenerator'
  import {useNavigate} from 'react-router-dom'
import { handleSend } from '../lib/helper/sendPdf';
import PhoneNumberInput from './PhoneNumberInput';
import { BookingFormData, ChargeItem, Charges} from '@/lib/helper/type'
  const EditInvoiceForm = ({ id,
    branchList,
    cityList,
    bookingData,
    loadingList,}) => {
    // //   console.log(id);
    // //   console.log(branchList);
    // //   console.log(cityList);
    // //   console.log(loading);
    if (!bookingData) return null;
       console.log(bookingData.ReceiverArea);

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmittedBooking, setIsSubmittedBooking] = useState(false);
  const [isEditingBooking, setIsEditingBooking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [readonlyMode, setReadonlyMode] = useState(true);
      const [showNewShipment, setShowNewShipment] = useState(false); // at the top
      const  [whatsappLoading,setwhatsappLoading] = useState(false)

      const role = sessionStorage.getItem("role") || "user";

  const handleEditInvoiceClick = () => {
    setReadonlyMode(false);
    setIsEditClicked(true);
  };

  const [formData, setFormData] = useState({
    SenderName: bookingData.SenderName || '',
    SenderMobile: bookingData.SenderMobile || '',
    SenderIdNumber: bookingData.SenderIdNumber || '',
    SenderAddress: bookingData.SenderAddress || '',
    SenderArea: bookingData.SenderArea || '',
   totalWeight: bookingData.totalWeight || '',
    ReceiverName: bookingData.ReceiverName || '',
    ReceiverMobile1: bookingData.ReceiverMobile1 || '',
    ReceiverMobile2: bookingData.ReceiverMobile2 || '',
    ReceiverAddress: bookingData.ReceiverAddress || '',
    ReceiverArea: bookingData.ReceiverArea || '',

    ItemDetails: bookingData.ItemDetails || '',
    OtherDetails: bookingData.OtherDetails || '',

    NoOfPieces: bookingData.NoOfPieces || '',
    Branch: bookingData.Branch || '',
    BookingDate: bookingData.BookingDate || '',
    BiltyNo: bookingData.BiltyNo || '',
    InvoiceNo: bookingData.InvoiceNo || '',

    Charges: {
      FreightCharges: {
        enabled: bookingData.Charges.FreightCharges.enabled || false,
        unitRate: bookingData.Charges.FreightCharges.unitRate || '',
        qty: bookingData.Charges.FreightCharges.qty || '',
        total: bookingData.Charges.FreightCharges.total || '',
      },
      Insurance: {
        enabled: bookingData.Charges.Insurance.enabled || false,
        unitRate: bookingData.Charges.Insurance.unitRate || '',
        qty: bookingData.Charges.Insurance.qty || '',
        total: bookingData.Charges.Insurance.total || '',
      },
      Packing: {
        enabled: bookingData.Charges.Packing.enabled || false,
        unitRate: bookingData.Charges.Packing.unitRate || '',
        qty: bookingData.Charges.Packing.qty || '',
        total: bookingData.Charges.Packing.total || '',
      },
      Customs: {
        enabled: bookingData.Charges.Customs.enabled || false,
        unitRate: bookingData.Charges.Customs.unitRate || '',
        qty: bookingData.Charges.Customs.qty || '',
        total: bookingData.Charges.Customs.total || '',
      },
      Clearance: {
        enabled: bookingData.Charges.Clearance.enabled || false,
        unitRate: bookingData.Charges.Clearance.unitRate || '',
        qty: bookingData.Charges.Clearance.qty || '',
        total: bookingData.Charges.Clearance.total || '',
      },
      OtherCharges: {
        enabled: bookingData.Charges.OtherCharges.enabled || false,
        unitRate: bookingData.Charges.OtherCharges.unitRate || '',
        qty: bookingData.Charges.OtherCharges.qty || '',
        total: bookingData.Charges.OtherCharges.total || '',
      },
   
    },
    SubTotal: bookingData.SubTotal || '',
    Vat: bookingData.Vat || '',
    VatTotal: bookingData.VatTotal || '',
    Discount: bookingData.Discount || '',

    AmountInWords: bookingData.AmountInWords || '',
    InvoiceTotal: bookingData.InvoiceTota || '',
    City: bookingData.City || '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked, dataset } = e.target;

    if (dataset && dataset.charge) {
      const chargeKey = dataset.charge;
      const field = dataset.field;

      setFormData((prev) => {
        const updatedCharge = {
          ...prev.Charges[chargeKey],
          [field]: type === 'checkbox' ? checked : value,
        };

        const unit = Math.max(
          0,
          parseFloat(field === 'unitRate' ? value : updatedCharge.unitRate) || 0
        );
        const qty = Math.max(
          0,
          parseFloat(field === 'qty' ? value : updatedCharge.qty) || 0
        );

        updatedCharge.total = unit > 0 && qty > 0 ? (unit * qty).toFixed(2) : '';

        return {
          ...prev,
          Charges: {
            ...prev.Charges,
            [chargeKey]: updatedCharge,
          },
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   const requiredFields = [
//     'Branch',
//     'SenderName',
//     'SenderMobile',
//     'SenderIdNumber',
//     'SenderAddress',
//     'SenderArea',
//     'ReceiverName',
//     'ReceiverMobile1',
//     'ReceiverMobile2',
//     'ReceiverArea',
//     'ReceiverAddress',
//     'NoOfPieces',
//     'BookingDate',
//   ];

//   const numberFields = ['SenderMobile', 'ReceiverMobile1', 'ReceiverMobile2', 'NoOfPieces'];

//   const newErrors = {};

//   // 🔍 Collect all required field errors first
//   for (let field of requiredFields) {
//     if (!formData[field] || formData[field].toString().trim() === '') {
//       newErrors[field] = 'This field is required';
//     }
//   }

//   // 🔍 Check number fields
//   for (let field of numberFields) {
//     if (formData[field] && !/^\d+$/.test(formData[field])) {
//       newErrors[field] = 'Only numbers allowed';
//     }
//   }

//   // 🧠 Show first error (in toast)
//   const firstErrorKey = Object.keys(newErrors)[0];
//   if (firstErrorKey) {
//     const errorMessage =
//       newErrors[firstErrorKey] === 'Only numbers allowed'
//         ? `${firstErrorKey.replace(/([A-Z])/g, ' $1')} must contain only numbers`
//         : `${firstErrorKey.replace(/([A-Z])/g, ' $1')} is required`;
//     toast.error(errorMessage);
//     setErrors(newErrors);
//     return; // 🚫 Stop if validation fails
//   }

//   // ✅ If no errors
//   setErrors({});
//   try {
//     setIsSubmittedBooking(true);
//     const response = await axios.post(AppRoutes.addBooking, formData);
//     const data = response.data;

//     setFormData((prev) => ({
//       ...prev,
//       ...data?.data?.bookingData,
//     }));
//     toast.success(data?.data?.message);
//     setIsSubmitted(true);
//   } catch (error) {
//     const err = error?.response?.data?.errors;
//     if (err?.general) toast.error(err.general);
//     else toast.error('Something went wrong');
//   } finally {
//     setIsSubmittedBooking(false);
//   }
// };


    const handleEdit = async (e) => {
    e.preventDefault()
     const requiredFields = [
    'Branch',
    'City',
    'SenderName',
    'SenderMobile',
    'SenderIdNumber',
    'SenderAddress',
    'SenderArea',
    'ReceiverName',
    'ReceiverMobile1',
    'ReceiverMobile2',
    'ReceiverArea',
    'ReceiverAddress',
    'NoOfPieces',
    'BookingDate',
  ];

  const numberFields = ['SenderMobile', 'ReceiverMobile1', 'ReceiverMobile2', 'NoOfPieces'];

  const newErrors = {};

  // 🔍 Collect all required field errors first
  // for (let field of requiredFields) {
  //   if (!formData[field] || formData[field].toString().trim() === '') {
  //     newErrors[field] = 'This field is required';
  //   }
  // }

  // 🔍 Check number fields
  for (let field of numberFields) {
    // if (formData[field] && !/^\d+$/.test(formData[field])) {
    if (formData[field] && !/^\+?\d+$/.test(formData[field])) {
      newErrors[field] = 'Only numbers allowed';
    }
  }

  // 🧠 Show first error (in toast)
  const firstErrorKey = Object.keys(newErrors)[0];
  if (firstErrorKey) {
    const errorMessage =
      newErrors[firstErrorKey] === 'Only numbers allowed'
        ? `${firstErrorKey.replace(/([A-Z])/g, ' $1')} must contain only numbers`
        : `${firstErrorKey.replace(/([A-Z])/g, ' $1')} is required`;
    toast.error(errorMessage);
    setErrors(newErrors);
    return; // 🚫 Stop if validation fails
  }

  // ✅ If no errors
  setErrors({});
    if (formData.BiltyNo) {
      try {
        setIsEditingBooking(true);
        const response = await axios.post(`${AppRoutes.editBookingById}/${id}`, formData);
        const data = response.data;
  
        toast.success(data?.data?.message);
        setFormData((prev) => ({
          ...prev,
          ...data?.data?.bookingData,
        }));
  
        // ✅ Disable form after edit
        setReadonlyMode(true);
setIsEditClicked(false);
setShowNewShipment(true); 
      } catch (error) {
        const err = error?.response?.data?.errors;
        if (err?.general) toast.error(err.general);
        if (!err) toast.error('Something went wrong');
      } finally {
        setIsEditingBooking(false);
      }
    } else {
      toast.error('Cannot edit fields without Bilty and Invoice No');
    }
  };
   const handleDelete = async(builtNo,status) => {
      // {
        if (!builtNo) {
          toast.error('Builty no is missing')
          return
       }
     try {
       setIsDeleting(true)
        const response = await axios.delete(AppRoutes.deleteBooking, { data: { BiltyNo: builtNo } })
        const data = response.data
        toast.success(data?.data?.message)
        navigate(-1)
        
      } catch (error) {
        const err = error?.response?.data?.errors;
        if (err?.general) toast.error(err?.general)
        if (!err) toast.error('Something went wrong');
     } finally {
       setIsDeleting(false)
     }
    //  console.log(typeof status);
     
    }

useEffect(() => {
  
  const allCharges = Object.entries(formData.Charges) as [keyof Charges, ChargeItem][];
       
  // console.log(allCharges);
          let totalCharges = allCharges.reduce((sum, [key,value]) => {
            
            if (key === 'Discount') return sum; // Skip Discount
            const total = parseFloat(value.total) || 0;
            return sum + total;
          }, 0);
          // Apply discount only if enabled
          const Discount = parseFloat(formData.Discount) || 0;
           console.log(Discount);
            

          // subtotal -= discount;
          // ✅ Calculate total of enabled charges (excluding Discount)
  const selectedCharges = allCharges.filter(
    ([key, value]) => value.enabled && key !== 'Discount'
  );
  
          const subtotal = Math.max(0, totalCharges)
          
         
      // const selectedCharges = allCharges.filter(([key,value]) => value.enabled);
      // console.log(selectedCharges);
      
          // let selectedTotal = selectedCharges.reduce((sum, [key,charge]) => {
          //   const total = parseFloat(charge.total) || 0;
          //   return sum + total ;
          // }, 0);
           let selectedTotal = selectedCharges.reduce((sum, [_, charge]) => {
    const total = parseFloat(charge.total) || 0;
    return sum + total;
  }, 0);

   // ✅ VAT should apply only on enabled, non-discount charges
  const vatPercent = parseFloat(formData.Vat) || 0;
  const vatTotal = ((selectedTotal - Discount) * vatPercent) / 100;
      
          // if(selectedTotal > 0) selectedTotal -=discount
          // selectedTotal -=discount
          // const vatPercent = parseFloat(formData.Vat) || 0;
          // const vatTotal = (selectedTotal * vatPercent / 100);
        
        // ✅ Apply discount AFTER VAT calculation
  let discountApply;
        if (selectedTotal){
      discountApply = subtotal + vatTotal;
        }
        else{
          discountApply = subtotal - Discount
        } 
  const invoiceTotal = discountApply;

  const amountInWords = numberToWords(invoiceTotal.toFixed(2));

          // const invoiceTotal = subtotal + vatTotal ;
       
        // const amountInWords = numberToWords(invoiceTotal.toFixed(2));
        // console.log(amountInWords);
        
          setFormData(prev => ({
            ...prev,
            SubTotal: subtotal.toFixed(2),
            VatTotal: vatTotal.toFixed(2),
            InvoiceTotal: invoiceTotal.toFixed(2),
            AmountInWords:amountInWords
          }));
        }, [formData.Charges, formData.Vat, formData.Discount]);
    

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
        <div className='max-w-7xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6'>
            <form onSubmit={handleEdit} className="">
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="text-2xl font-bold text-red-600">
                  Pak Chinar Int'I Cargo                </h1>
                <h2 className="text-xl font-semibold text-gray-700">
                New Invoice Entry
                </h2>
            </div>

            <div className="grid grid-cols-5 gap-4">
                <div>
                <label className="font-medium">Bilty No</label>
                <input  type="text" readOnly className="w-full border rounded px-2 py-1" value={formData.BiltyNo}/>
                </div>
                <div>
                <label className="font-medium">Invoice No</label>
                <input  type="text" readOnly className="w-full border rounded px-2 py-1" value={formData.InvoiceNo}/>
                </div>
                <div>
                <label className="font-medium">Date</label>
                <input name='BookingDate' type="date" className="w-full border rounded px-2 py-1" value={formData.BookingDate}
        onChange={handleChange}
        disabled={readonlyMode}/>
                {errors["BookingDate"] && (
                        <p className="text-sm text-red-600 mt-1">{errors["BookingDate"]}</p>
                        )}  
              </div>
                <div>
                <label  className="font-medium">Branch</label>
                {
                  loadingList ? (<h1>Loading...</h1>) : (
                    <select
                    disabled={readonlyMode}
                    name="Branch"
                    value={formData.Branch}
                    // onChange={readonlyMode ? () => { }  :handleChange}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded"
                  >
                    <option value="">Select Branch</option>
                    {branchList.map((branch,index) => (
                      <option key={index} value={branch.branch}>
                        {branch.branch}
                      </option>
                    ))}
                  </select>
                  ) 
               
                }
               
                {errors["Branch"] && (
                        <p className="text-sm text-red-600 mt-1">{errors["Branch"]}</p>
                        )}
                </div>
                <div>
                <label  className="font-medium">City</label>
                {
                  loadingList ? (<h1>Loading...</h1>) : (
                    <select
                    disabled={readonlyMode}
                    name="City"
                    value={formData.City}
                    // onChange={readonlyMode ? () => { }  :handleChange}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded"
                  >
                    <option value="">Select City</option>
                    {cityList.map((city,index) => (
                      <option key={index} value={city.city}>
                        {city.city}
                      </option>
                    ))}
                  </select>
                  ) 
               
                }
               
                {errors["City"] && (
                        <p className="text-sm text-red-600 mt-1">{errors["City"]}</p>
                        )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Sender Details */}
                <div>
                <h3 className="text-lg font-bold text-blue-800 mb-2">
                    Sender Details
                </h3>
                {[
                    { label: "Name", key: "SenderName" },
                    { label: "Mobile No", key: "SenderMobile" },
                    { label: "ID Number", key: "SenderIdNumber" },
                    { label: "Address", key: "SenderAddress" },
                    { label: "City", key: "SenderArea" },
                    { label: "Other Details", key: "OtherDetails" },
                    { label: "Item Details", key: "ItemDetails" },
                ].map((sender,index) => (
                    <div key={index} className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {sender.label}
                    </label>
                    {
                      loadingList ? (<h1>loading...</h1>) :
                        (
                          sender.key === "SenderArea" ? (
                        
                            <select
                              disabled={readonlyMode}
                            // readOnly={readonlyMode}
                            name="SenderArea"
                            value={formData.SenderArea}
                            onChange={handleChange}
                            className="w-full border rounded px-2 py-1"
                          >
                            <option value="">Select Area</option>
                            {cityList.map((area, idx) => (
                              <option key={idx} value={area.city}>
                                {area.city}
                              </option>
                            ))}
                          </select>
                        ):sender.key === "ItemDetails" ? (
                        <textarea
  name={sender.key}
  readOnly={readonlyMode}
  value={formData[sender.key] || ""}
  onChange={handleChange} // add this if you're using controlled components
  // cols="48"
   rows={6}
 className="sm:w-full md:w-[400px] lg:w-[700px] xl:w-[900px] border rounded px-2 py-1"
/>

                            
                        ):
                             sender.key === "OtherDetails" ? (
                        <textarea
  name={sender.key}
  readOnly={readonlyMode}
  value={formData[sender.key] || ""}
  onChange={handleChange} // add this if you're using controlled components
  // cols="48"
   rows={4}
 className="sm:w-full md:w-[400px] lg:w-[700px] xl:w-[900px] border rounded px-2 py-1"
/>

                            
                        ) : sender.key === "SenderMobile" ? (
                        
                            <PhoneNumberInput value={formData[sender.key]} handleChange={handleChange} name={sender.key} disable={readonlyMode}/>
                        ) 
                             
                        :(<input 
                          readOnly={readonlyMode}
                            name={sender.key}
                            type="text"
                            value={formData[sender.key]}
                            onChange={handleChange}
                            className="w-full border rounded px-2 py-1"
                            />)
                     )
                    }
                        {errors[sender.key] && (
                        <p className="text-sm text-red-600 mt-1">{errors[sender.key]}</p>
                        )}
                    </div>
                ))}
                </div>

                {/* Receiver Details */}
                <div>
                <h3 className="text-lg font-bold text-blue-800 mb-2">
                    Receiver Details
                </h3>
                {[
                    { label: "Name", key: "ReceiverName" },
                    { label: "Mobile No 1", key: "ReceiverMobile1" },
                    { label: "Mobile No 2", key: "ReceiverMobile2" },
                    { label: "Address", key: "ReceiverAddress" },
                    { label: "City", key: "ReceiverArea" },
                    { label: "No Of Pieces", key: "NoOfPieces" },
                    { label: "", key: "totalWeight" },
                ].map((reciever,index) => (
                  <div key={index} className="mb-2">
                    {
                      reciever.key !== "NoOfPieces" &&
                        
                    (<label className="block text-sm font-medium text-gray-700">
                        {reciever.label}
                    </label>)
                        
                    }
                    
                    {/* <label className="block text-sm font-medium text-gray-700">
                        {reciever.label}
                    </label> */}
                    {
                      reciever.key === "ReceiverArea" ? (
                              <input
                      disabled={isSubmitted && !isEditClicked}
                       name="ReceiverArea"
                        type="text"
                        className="w-full border rounded px-2 py-1"
                       value={formData.ReceiverArea}
                        onChange={handleChange}
                       
                      />
                        //   <select
                      //   disabled={readonlyMode}
                      //   name="ReceiverArea"
                      //   value={formData.ReceiverArea}
                      //   onChange={handleChange}
                      //   className="w-full border rounded px-2 py-1"
                      // >
                      //   <option value="">Select Area</option>
                      //   {cityList.map((area, idx) => (
                      //     <option key={idx} value={area.city}>
                      //       {area.city}
                      //     </option>
                      //   ))}
                      // </select>
                      ) :
                        reciever.key === "ReceiverMobile1" ? (
                        
                            <PhoneNumberInput value={formData[reciever.key]} handleChange={handleChange} name={reciever.key} disable={readonlyMode}/>
                        ) :
                        reciever.key === "ReceiverMobile2" ? (
                        
                            <PhoneNumberInput value={formData[reciever.key]} handleChange={handleChange} name={reciever.key} disable={readonlyMode}/>
                        ) :reciever.key === "NoOfPieces" ? (
                              <div className=" w-[200px] ml-auto">
                                <label className="not-even: text-sm font-medium text-gray-700">
                        {reciever.label}
                        </label>
                                <input 
                                readOnly={readonlyMode}
                                name={reciever.key}
                                    type="text"
                                    className="w-full border rounded px-2 py-1"
                                    value={formData[reciever.key]}
                                    onChange={handleChange}
                                    inputMode="numeric"
                            
                                    
                                />
                                </div>
                            ): 

                              


                            reciever.key === "totalWeight" ? (
          <div className="w-[200px] ml-auto">
            <label className="block text-sm font-medium text-gray-700">
              {/* {reciever.label} */}Total Weight
            </label>
      <input
  readOnly={readonlyMode}
  name={reciever.key}
  type="text"
  className="w-full border rounded px-2 py-1"
  value={formData[reciever.key]}
  onChange={handleChange}
  inputMode="numeric"
/>
          </div>)
          :
                             
                           
                    (<input 
                    readOnly={readonlyMode}
                    name={reciever.key}
                        type="text"
                        className="w-full border rounded px-2 py-1"
                        value={formData[reciever.key]}
                        onChange={handleChange}
                        inputMode="numeric"
                
                        
                    />)
                    
                    }
                    {errors[reciever.key] && (
                        <p className="text-sm text-red-600 mt-1">{errors[reciever.key]}</p>
                    )}
                    </div>
                ))}
                </div>
            </div>
            {/* Charges Table */}
                
            <div>
                <h3 className="text-lg font-bold text-blue-800 mb-2">Charges</h3>
                <div className="grid grid-cols-6 gap-2 font-semibold text-sm text-gray-600 border-b pb-1">
                <div>Apply</div>
                <div>Charge Type</div>
                <div>U / Rate</div>
                <div>Qty</div>
                <div>Total</div>
                </div>

                {Object.entries(formData.Charges).map(([chargeKey, chargeData], index) => {
      if (chargeKey === "SubTotal") return null;
                  
      return (
        <div key={chargeKey} className="grid grid-cols-6 gap-2 items-center mt-1">
          <div>
            {chargeKey === "Discount" ? (
              <input 
                disabled={true}
                type="checkbox"
                // checked={false}
                // onChange={handleChange}
                // data-charge={chargeKey}
                // data-field="enabled"
                className="h-4 w-4 text-blue-600"
              />
              
            ) : (
              <input 
                disabled={readonlyMode}
                type="checkbox"
                checked={chargeData.enabled}
                onChange={handleChange}
                data-charge={chargeKey}
                data-field="enabled"
                className="h-4 w-4 text-blue-600"
              />
              
            ) } 
          </div>
          <div className="text-sm font-medium text-gray-700">{chargeKey}</div>
          <input 
            readOnly={readonlyMode}
            type="number"
             step="0.01"   
            min="0"
            value={chargeData.unitRate}
            onChange={handleChange}
            data-charge={chargeKey}
            data-field="unitRate"
            className="border rounded px-2 py-1"
          />
          <input 
            readOnly={readonlyMode}
            type="number"
            step="0.01"
            min="0"
            value={chargeData.qty}
            onChange={handleChange}
            data-charge={chargeKey}
            data-field="qty"
            className="border rounded px-2 py-1"
          />
          <input 
            
            type="text"
            value={chargeData.total}
            readOnly
            className="border rounded px-2 py-1 bg-gray-100"
          />
        </div>
      );
    })}
        {/* Subtotal */}
                <div className="grid grid-cols-6 gap-2 items-center mt-1">
                    <div>
                        <input 
                        disabled
                        type="checkbox"
                        //   checked={chargeData.enabled}
                        //   onChange={handleChange}
                        //   data-charge={chargeKey}
                        data-field="enabled"
                        className="h-4 w-4 text-blue-600"
                        />
                    </div>
                    <div className="text-sm font-medium text-gray-700">Sub Total</div>
                    <div></div>
                    <div></div>
                    <input 
                    type="text"
                    value={formData.SubTotal}
                    readOnly
                    className="border rounded px-2 py-1 bg-gray-100"
                    />
                                                            <div></div>
                                                            <div>      <input 
                        disabled
                        type="checkbox"
                        //   checked={chargeData.enabled}
                        //   onChange={handleChange}
                        //   data-charge={chargeKey}
                        data-field="enabled"
                        className="h-4 w-4 text-blue-600"
                        /></div>

                    <div className="text-sm font-medium text-gray-700">Discount</div>
                    <div></div>
                                        <div></div>

                    <input 
                        type="text"
                        name="Discount"
                        value={-`${formData.Discount}`|| 0}
                  onChange={handleChange}
                  readOnly={isSubmitted && !isEditClicked}
                        className="border rounded px-2 py-1 bg-gray-100"
                    />
                </div>
                
        {/* Vat in percent */}
                <div className="grid grid-cols-6 gap-2 items-center mt-1">
                    <div>
                        <input 
                        disabled
                        type="checkbox"
                        //   checked={chargeData.enabled}
                        //   onChange={handleChange}
                        //   data-charge={chargeKey}
                        data-field="enabled"
                        className="h-4 w-4 text-blue-600"
                        />
                    </div>
                    <div className="text-sm font-medium text-gray-700">Vat</div>
                    <div></div>
                    <div></div>
       <input 
  type="text"
  name="Vat"
  value={formData.Vat}
  onChange={(e) => {
    const value = e.target.value;

    // sirf number aur decimal allow karo, minus disallow
    if (/^-/.test(value)) return; // agar minus se start ho to ignore

    // optional: agar sirf numbers aur ek dot allow karni hai
    if (!/^\d*\.?\d*$/.test(value)) return;

    setFormData({
      ...formData,
      Vat: value,
    });
  }}
  readOnly={readonlyMode}
  className="border rounded px-2 py-1 bg-gray-100"
/>

                </div>
                {/* total vat */}
                <div className="grid grid-cols-6 gap-2 items-center mt-4 font-semibold text-gray-800">
                <div></div>
                <div>VAT ({formData.Vat}%) Total</div>
                <div></div>
                <div></div>
                <input 
                    type="text"
                    value={formData.VatTotal}
                    readOnly
                    className="border rounded px-2 py-1 bg-gray-100"
                />
              </div>
              <div className="grid grid-cols-6 gap-2 items-center mt-4 font-semibold text-gray-800">
                <div></div>
                <div>Invoice Total SAR:</div>
                <div></div>
                <div></div>
                <input 
                    type="text"
                    value={formData.InvoiceTotal}
                    readOnly
                    className="border rounded px-2 py-1 bg-gray-100"
                />
                </div>
            </div>
            
            {/* Amount in Words */}
            <div className='mt-5'>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                Amount In Words SAR
                </label>
                <input  readOnly value={formData.AmountInWords} type="text" className="w-full border rounded px-2 py-1" />
            </div>

            {/* Invoice Total */}
            {/* <div className="text-right">
                <div className="inline-block text-sm font-semibold text-gray-700 mr-2">
                Invoice Total SAR:
                </div>
                <input  type="text" readOnly value={formData.InvoiceTotal} className="border rounded px-2 py-1 w-48" />
            </div> */}
            <div>
            
            </div>
          <div>
              <button
              type="submit"
              disabled={readonlyMode}
                // onClick={}
                className={` ${readonlyMode ? 'bg-gray-500 text-white cursor-not-allowed' : 'cursor-pointer bg-green-600 hover:bg-green-700 text-white'}   py-2 px-4 rounded  transition w-full mt-4 `}
              >
                  {isEditingBooking ?
                    <div className="flex justify-center">
                        <svg className="animate-spin h-5 w-5 text-white " viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </div>
                    :"Update Shipment"}
              </button>
            
            </div>
          </form>

          {/* Action Buttons */}
                    {showNewShipment && (
  <div>
    <button
      onClick={() => navigate('/add-booking')}
      className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition w-full mt-4 cursor-pointer"
    >
      New Shipment
    </button>
  </div>
)}

          
         

<div className="flex flex-wrap gap-4 justify-center pt-4">
  {[
    {
      label: "Save & Print",
      onClick: () => {
        if (formData.BiltyNo && formData.Branch && formData.City && formData.InvoiceNo) {
          handlePdfSave(formData, 'Save&PRINT', bookingData.status, formData.AmountInWords)
        } else {
          toast.error("Cannot Print PDF without Tracking Id,Invoice No,Branch and City")
        }
      },
    },
    {
      label: "Save PDF",
      onClick: () => {
        if (formData.BiltyNo && formData.Branch && formData.City && formData.InvoiceNo) {
          handlePdfSave(formData, 'SavePDF', bookingData.status, formData.AmountInWords)
        } else {
          toast.error("Cannot create PDF without Tracking Id,Invoice No,Branch and City")
        }
      },
    },
    {
      label: "Edit Invoice",
      onClick: () => {
        if (formData.BiltyNo) handleEditInvoiceClick()
        else toast.error("Cannot edit fields without Bilty and Invoice No")
      },
      adminOnly: true
    },
    {
      label: "Del. Invoice",
      onClick: () => handleDelete(formData.BiltyNo, bookingData),
      isLoading: isDeleting,
      adminOnly: true
    },
    {
      label: "PDF To Whatsapp",
      onClick: () => {
        if (formData.BiltyNo && formData.Branch && formData.City && formData.InvoiceNo) {
          const file = handlePdfSave(formData, "SendToWhatsapp", 'Shipment in Godown', formData.AmountInWords);
          if(file) handleSend(formData, file, setwhatsappLoading)
        } else toast.error("Cannot send PDF without Tracking Id,Invoice No,Branch and City")
      },
      isLoading: whatsappLoading,
      adminOnly: true
    }
  ].map(({ label, onClick, isLoading, adminOnly }, index) => {
    // Role-based filter
    if (adminOnly && role !== "admin") return null;

    return (
      <button
        key={index}
        onClick={onClick}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md cursor-pointer"
      >
        {isLoading ? (
          <div className="flex justify-center">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : label}
      </button>
    );
  })}
</div>
        </div>
        
      </div>
    // <></>
    )
  }

  export default EditInvoiceForm
