//   import React,{useState,useEffect, FormEvent} from 'react'
//   import {numberToWords} from '@/lib/helper/numberToWord'
//   import { toast } from 'react-toastify';
//   import axios from 'axios';
//   import { AppRoutes } from '../constants/AppRoutes';
//   import {handlePdfSave} from '@/lib/helper/pdfGenerator'
// import { handleSend } from '@/lib/helper/sendPdf';
// import PhoneNumberInput from './PhoneNumberInput';
// import { BookingFormData, ChargeItem, Charges} from '@/lib/helper/type'
// import moment from "moment";

// const InvoiceForm = ({ cityList, branchList, loadingList, role = sessionStorage.getItem("role") || "user" }: { cityList: any; branchList: any; loadingList: boolean; role?: string }) => {
      
//       const [errors, setErrors] = useState<Record<string, string>>({});
//       const  [isSubmitted,setIsSubmitted] = useState(false)
//       const  [isSubmittedBooking,setIsSubmittedBooking] = useState(false)
//       const  [isEditingBooking,setIsEditingBooking] = useState(false)
//       const  [isDeleting,setIsDeleting] = useState(false)
//       const  [whatsappLoading,setwhatsappLoading] = useState(false)
      
//       const  [isEditClicked,setIsEditClicked] = useState(false)
      

//     const [formData, setFormData] = useState<BookingFormData>({
//       BiltyNo: "",
//       SenderName: "",
//       SenderMobile: "",
//       SenderIdNumber:"",
//       SenderAddress: "",
//       SenderArea: "",
//       ReceiverName: "",
//       ReceiverMobile1: "",
//       ReceiverMobile2: "",
//       ReceiverAddress: "",
//       ReceiverArea: "",
//       ItemDetails:"",
//       OtherDetails:"",
//      totalWeight:"",
//       NoOfPieces: "",
//       Discount:"",
//       Branch: "",
//       BookingDate: moment().format("DD-MM-YYYY"),

//       // BookingDate:new Date().toISOString().split('T')[0],
//       //  BiltyNo: "",
//       //  InvoiceNo: "",
      
//       Charges: {
//           FreightCharges: { enabled: false, unitRate: '', qty: '', total: '' },
//           Insurance: { enabled: false, unitRate: '', qty: '', total: '' },
//           Packing: { enabled: false, unitRate: '', qty: '', total: '' },
//           Customs: { enabled: false, unitRate: '', qty: '', total: '' },
//           Clearance: { enabled: false, unitRate: '', qty: '', total: '' },
//           OtherCharges: { enabled: false, unitRate: '', qty: '', total: '' },
//           // Discount: {enabled: false, unitRate: '', qty: '', total: ''  },
//       },
//       SubTotal:"",
//       Vat:"",
//       VatTotal:"",
//       AmountInWords: '',
//       InvoiceTotal: '',
//       City: '',
//       })

    
//       const handleChange = (e:any) => {
//           const { name, value, type, checked, dataset } = e.target;
   
//         if (name === "BiltyNo") {
//             // Sirf digits allow karo aur max 12 tak
//             const onlyNumbers = value.replace(/\D/g, ""); // non-digits remove
//             if (onlyNumbers.length <= 12) {
//               setFormData((prev) => ({
//                 ...prev,
//                 BiltyNo: onlyNumbers,
//               }));
//             }
//             return;
//           }

        
//           // Charges section
//           if (dataset && dataset.charge) {
//             const chargeKey = dataset.charge;
//             const field = dataset.field;
        
//             setFormData((prev) => {
//                 const updatedCharge = {
//                   ...prev.Charges[chargeKey],
//                   [field]: type === "checkbox" ? checked : value,
//                 };
        
//                 // const unit = parseFloat(field === 'unitRate' ? value : updatedCharge.unitRate) || 0;
//                 // const qty = parseFloat(field === 'qty' ? value : updatedCharge.qty) || 0;
//                 // updatedCharge.total = (unit * qty).toFixed(2);

//                 const unit = Math.max(0, parseFloat(field === 'unitRate' ? value : updatedCharge.unitRate) || 0);
//                 const qty = Math.max(0, parseFloat(field === 'qty' ? value : updatedCharge.qty) || 0);

//                 // Only calculate total if both unit and qty have valid positive values
//                 updatedCharge.total = unit > 0 && qty > 0 ? (unit * qty).toFixed(2) : '';
//                 // updatedCharge.total = unit > 0 && qty > 0 ? (unit * qty) : '';

        
//                 return {
//                   ...prev,
//                   Charges: {
//                     ...prev.Charges,
//                     [chargeKey]: updatedCharge,
//                   },
//                 };
//               });
//           } else {
//             // Top-level fields
//             setFormData((prev) => ({
//               ...prev,
//               [name]: value,
//             }));
//           }
//         };
        
            
    
//       const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         console.log(formData);
        
//         const requiredFields:Array<keyof BookingFormData> = [
//             // 'BiltyNo',
//             'BookingDate',
//             'Branch',
//             'City',
//             'SenderName',
//             'SenderMobile',
//             'SenderIdNumber',
//             'SenderAddress',
//             'SenderArea',
//             'ReceiverName',
//             'ReceiverMobile1',
//             'ReceiverMobile2',
//             'ReceiverAddress',
//             'ReceiverArea',
//             'NoOfPieces',
// ];

// const numberFields = ['SenderMobile', 'ReceiverMobile1', 'ReceiverMobile2', 'NoOfPieces',];

// const newErrors:Record<string, string> = {};

//  // 🔍 Bilty No validation (12 digits exact)
// if (formData.BiltyNo.length !== 12) {
//   newErrors.BiltyNo = "Bilty No must be exactly 12 digits";
//   toast.error("Bilty No must be exactly 12 digits");
//   setErrors(newErrors);
//   return;
// }
//         // 🔍 Check required fields first
//         for (let field of requiredFields) {
//   // console.log(field);
  

//   if (!formData[field]) {
//     newErrors[field] = 'This field is required';
//     toast.error(`${field.replace(/([A-Z])/g, ' $1')} is required`);
//     setErrors(newErrors);
//     return; // ✅ Stop at first error
//   }
  
// }


// // 🔍 Check number fields
// for (let field of numberFields) {
//   // if (formData[field] && !/^\d+$/.test(formData[field])) {
//   if (formData[field] && !/^\+?\d+$/.test(formData[field])) {
//     newErrors[field] = 'Only numbers allowed';
//     toast.error(`${field.replace(/([A-Z])/g, ' $1')} must contain only numbers`);
//     setErrors(newErrors);
//     return; // ✅ Stop at first error
//   }

 
// }

// setErrors({});
// // ✅ Proceed with submit here

//         //   if (Object.keys(newErrors).length > 0) {
//         //     return;
//         // }
//         if (parseInt(formData.InvoiceTotal) < 0) {
//           toast.error("Calculated total cannot be negative")
//           return
//         }
//         try {
//           setIsSubmittedBooking(true)
//                formData.BookingDate = moment(formData.BookingDate).format("DD-MM-YYYY");
//           const response = await axios.post(AppRoutes.addBooking,formData)
//         const data = response.data
//         // set response data into form
//         setFormData((prev) => ({
//           ...prev,
//           ...data?.data?.bookingData,
//         }));
//         toast.success(data?.data?.message)
//         setIsSubmitted(true)
//         } catch (error) {
//             const err = (error as any).response?.data?.errors;
//             if (err?.general) toast.error(err.general);
//             if (!err) toast.error('Something went wrong');
//         } finally {
//           setIsSubmittedBooking(false)
          
//         }

//     }
    
//     const handleNewShipment = () => {
//       setFormData({
//         SenderName: "",
//       SenderMobile: "",
//       SenderIdNumber:"",
//       SenderAddress: "",
//       SenderArea: "",
//       ReceiverName: "",
//       ReceiverMobile1: "",
//       ReceiverMobile2: "",
//       ReceiverAddress: "",
//       ReceiverArea: "",
//       ItemDetails:"",
//       OtherDetails:"",
//       totalWeight:"",
//       NoOfPieces: "",
//       Branch: "",
//       Discount:"",
//       BookingDate:new Date().toISOString().split('T')[0],
//       //  BiltyNo: "",
//       //  InvoiceNo: "",
      
//       Charges: {
//           FreightCharges: { enabled: false, unitRate: '', qty: '', total: '' },
//           Insurance: { enabled: false, unitRate: '', qty: '', total: '' },
//           Packing: { enabled: false, unitRate: '', qty: '', total: '' },
//           Customs: { enabled: false, unitRate: '', qty: '', total: '' },
//           Clearance: { enabled: false, unitRate: '', qty: '', total: '' },
//           OtherCharges: { enabled: false, unitRate: '', qty: '', total: '' },
//           // Discount: {enabled: false, unitRate: '', qty: '', total: '' },
//       },
//       SubTotal:"",
//       Vat:"",
//       VatTotal:"",
      
//       AmountInWords: '',
//       InvoiceTotal: '',
//       BiltyNo: '',
//       InvoiceNo: '',
//       City: ''
      
//       });
//       setIsSubmitted(false);
//       setIsEditClicked(false);
//     };
    
//     const handleEdit = async () => {
//       if (formData.BiltyNo) {
//         try {
//           setIsEditingBooking(true)
//           const response = await axios.post(AppRoutes.editBooking,formData)
//           const data = response.data
//           toast.success(data?.data?.message)
//           // set response data into form
//           setFormData((prev) => ({
//             ...prev,
//             ...data?.data?.bookingData,
//           }));
//           // console.log("success=>",data);
          
//         } catch (error) {
//           // console.log("error=>",error);
//           const err = error?.response?.data?.errors;
//           if (err?.general) toast.error(err.general);
//           if (!err) toast.error('Something went wrong');
//         } finally {
//           setIsEditingBooking(false)
//           setIsEditClicked(false)
//         }
//       }
//       else {
//         toast.error("Cannot edit fields without Bilty and Invoice No")
//       }
    
      
//     }
//     const handleDelete = async(builtNo:any) => {
//       try {
//         if (!builtNo) {
//           toast.error('Builty no is missing')
//           return
//         }
//         setIsDeleting(true)
//         const response = await axios.delete(AppRoutes.deleteBooking, { data: { BiltyNo: builtNo } })
//         const data = response.data
//         toast.success(data?.data?.message)
//         handleNewShipment()
        
//       } catch (error) {
//         const err = error?.response?.data?.errors;
//         if (err?.general) toast.error(err?.general)
//         if (!err) toast.error('Something went wrong');
//       } finally {
//         setIsDeleting(false)
//       }
//     }
// const [isVatActive, setIsVatActive] = useState(false);

// // 👇 2) Yeh chhota useEffect alag likho
// useEffect(() => {
//   const vatValue = parseFloat(formData.Vat) || 0;
//   setIsVatActive(vatValue < 0);
// }, [formData.Vat]);
//    useEffect(() => {
//     setIsVatActive(parseFloat(formData.Vat) > 0);

//   const allCharges = Object.entries(formData.Charges) as [keyof Charges, ChargeItem][];
//           // console.log(allCharges);
//           let totalCharges = allCharges.reduce((sum, [key,value]) => {
            
//             if (key === 'Discount') return sum; // Skip Discount
//             const total = parseFloat(value.total) || 0;
//             return sum + total;
//           }, 0);
//           // Apply discount only if enabled
//           const Discount = parseFloat(formData.Discount) || 0;
//            console.log(Discount);
            

//           // subtotal -= discount;
//           // ✅ Calculate total of enabled charges (excluding Discount)
//   const selectedCharges = allCharges.filter(
//     ([key, value]) => value.enabled && key !== 'Discount'
//   );
  
//           const subtotal = Math.max(0, totalCharges)
          
         
//       // const selectedCharges = allCharges.filter(([key,value]) => value.enabled);
//       // console.log(selectedCharges);
      
//           // let selectedTotal = selectedCharges.reduce((sum, [key,charge]) => {
//           //   const total = parseFloat(charge.total) || 0;
//           //   return sum + total ;
//           // }, 0);
//            let selectedTotal = selectedCharges.reduce((sum, [_, charge]) => {
//     const total = parseFloat(charge.total) || 0;
//     return sum + total;
//   }, 0);

//    // ✅ VAT should apply only on enabled, non-discount charges
//   const vatPercent = parseFloat(formData.Vat) || 0;
//   const vatTotal = ((selectedTotal - Discount) * vatPercent) / 100;
      
//           // if(selectedTotal > 0) selectedTotal -=discount
//           // selectedTotal -=discount
//           // const vatPercent = parseFloat(formData.Vat) || 0;
//           // const vatTotal = (selectedTotal * vatPercent / 100);
        
//         // ✅ Apply discount AFTER VAT calculation
//   let discountApply;
//         if (selectedTotal){
//       discountApply = subtotal + vatTotal;
//         }
//         else{
//           discountApply = subtotal - Discount
//         } 
//   const invoiceTotal = discountApply;

//   const amountInWords = numberToWords(invoiceTotal.toFixed(2));

//           // const invoiceTotal = subtotal + vatTotal ;
       
//         // const amountInWords = numberToWords(invoiceTotal.toFixed(2));
//         // console.log(amountInWords);
        
//           setFormData(prev => ({
//             ...prev,
//             SubTotal: subtotal.toFixed(2),
//             VatTotal: vatTotal.toFixed(2),
//             InvoiceTotal: invoiceTotal.toFixed(2),
//             AmountInWords:amountInWords
//           }));
//         }, [formData.Charges, formData.Vat, formData.Discount]);
    
    
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
//         <div className='max-w-7xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6'>
//             <form onSubmit={handleSubmit} className="">
//             <div className="flex justify-between items-center border-b pb-4">
//                 <h1 className="text-2xl font-bold text-red-600">
//                 Pak Chinar Int'I Cargo
//                 </h1>
//                 <h2 className="text-xl font-semibold text-gray-700">
//                 New Invoice Entry
//                 </h2>
//             </div>

//             <div className="grid grid-cols-5 gap-4">
//                 <div>
//                 <label className="font-medium">Bilty No</label>
//                 <input type="text" className="w-full border rounded px-2 py-1"
//                  value={formData.BiltyNo} onChange={handleChange} name='BiltyNo'
//                   readOnly={isSubmitted && !isEditClicked} />
//                 </div>
//                 <div>
//                 <label className="font-medium">Invoice No</label>
//                 <input  type="text" readOnly className="w-full border rounded px-2 py-1" value={formData.InvoiceNo}/>
//                 </div>
//          <div>
//                 <label className="font-medium">Date</label>
                
//                 <input name='BookingDate' type="date" className="w-full border rounded px-2 py-1" value={formData.BookingDate} onChange={handleChange} readOnly={isSubmitted && !isEditClicked}/>
//                 {errors["BookingDate"] && (
//                         <p className="text-sm text-red-600 mt-1">{errors["BookingDate"]}</p>
//                         )}  
//               </div>
//                 <div>
//                 <label  className="font-medium">Branch</label>
//                 {
//                   loadingList ? (<h1>Loading...</h1>) : (
//                     <select
//                     disabled={isSubmitted && !isEditClicked}
//                     name="Branch"
//                     value={formData.Branch}
//                     // onChange={isSubmitted && !isEditClicked ? () => { }  :handleChange}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border rounded"
//                   >
//                     <option value="">Select Branch</option>
//                     {branchList.map((branch,index) => (
//                       <option key={index} value={branch.branch}>
//                         {branch.branch}
//                       </option>
//                     ))}
//                   </select>
//                   ) 
               
//                 }
               
//                 {errors["Branch"] && (
//                         <p className="text-sm text-red-600 mt-1">{errors["Branch"]}</p>
//                         )}
//                 </div>
//                 <div>
//                 <label  className="font-medium">City</label>
//                 {
//                   loadingList ? (<h1>Loading...</h1>) : (
//                     <select
//                     disabled={isSubmitted && !isEditClicked}
//                     name="City"
//                     value={formData.City}
//                     // onChange={isSubmitted && !isEditClicked ? () => { }  :handleChange}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border rounded"
//                   >
//                     <option value="">Select City</option>
//                     {cityList.map((city,index) => (
//                       <option key={index} value={city.city}>
//                         {city.city}
//                       </option>
//                     ))}
//                   </select>
//                   ) 
               
//                 }
               
//                 {errors["City"] && (
//                         <p className="text-sm text-red-600 mt-1">{errors["City"]}</p>
//                         )}
//                 </div>
//             </div>

//           <div className="grid grid-cols-2 gap-6">
//   {/* Sender Details */}
//   <div>
//     <h3 className="text-lg font-bold text-blue-800 mb-2">Sender Details</h3>

//     {loadingList ? (
//       <h1>loading...</h1>
//     ) : (
//       <>
//         {/* Normal Sender Fields */}
//         {[
//           { label: "Name", key: "SenderName" },
//           { label: "Mobile No", key: "SenderMobile" },
//           { label: "ID Number", key: "SenderIdNumber" },
//           { label: "Address", key: "SenderAddress" },
//           { label: "City", key: "SenderArea" },
//           { label: "Other Details", key: "OtherDetails" },
//           { label: "Item Details", key: "ItemDetails" },
          
//         ].map((sender, index) => (
//           <div key={index} className="mb-2">
//             <label className="block text-sm font-medium text-gray-700">
//               {sender.label}
//             </label>

//             {sender.key === "SenderArea" ? (
//               <select
//                 disabled={isSubmitted && !isEditClicked}
//                 name="SenderArea"
//                 value={formData.SenderArea}
//                 onChange={handleChange}
//                 className="w-full border rounded px-2 py-1"
//               >
//                 <option value="">Select Area</option>
//                 {cityList.map((area: any, idx: any) => (
//                   <option key={idx} value={area.city}>
//                     {area.city}
//                   </option>
//                 ))}
//               </select>
//             ) : sender.key === "SenderMobile" ? (
//               <PhoneNumberInput
//                 value={formData[sender.key]}
//                 handleChange={handleChange}
//                 name={sender.key}
//                 disable={isSubmitted && !isEditClicked}
//               />
//             ) : sender.key === "OtherDetails" ? (
//               <textarea
//                 name={sender.key}
//                 value={formData[sender.key] || ""}
//                 onChange={handleChange}
//                 rows={4}
//                 className="sm:w-full md:w-[400px] lg:w-[700px] xl:w-[900px] border rounded px-2 py-1"
//               />
//             ) : 
//               sender.key === "ItemDetails" ? (
//                 <textarea
//                   name={sender.key}
//                   value={formData[sender.key] || ""}
//                   onChange={handleChange}
//                   rows={4}
//                   className="flex flex-col sm:w-full md:w-[400px] lg:w-[700px] xl:w-[900px] border rounded px-2 py-1"
//                 />
//             )
            
//             :(
//               <input
//                 readOnly={isSubmitted && !isEditClicked}
//                 name={sender.key}
//                 type="text"
//                 value={formData[sender.key]}
//                 onChange={handleChange}
//                 className="w-full border rounded px-2 py-1"
//               />
//             )}

//             {errors[sender.key] && (
//               <p className="text-sm text-red-600 mt-1">{errors[sender.key]}</p>
//             )}
//           </div>
//         ))}
//       </>
//     )}
//   </div>

//   {/* Receiver Details */}
//   <div>
//     <h3 className="text-lg font-bold text-blue-800 mb-2">Receiver Details</h3>

//     {[
//       { label: "Name", key: "ReceiverName" },
//       { label: "Mobile No 1", key: "ReceiverMobile1" },
//       { label: "Mobile No 2", key: "ReceiverMobile2" },
//       { label: "Address", key: "ReceiverAddress" },
//       { label: "City", key: "ReceiverArea" },
//       { label: "No Of Pieces", key: "NoOfPieces" },
//       { label: "", key: "totalWeight" },
//     ].map((reciever, index) => (
//       <div key={index} className="mb-2">
//         {reciever.key !== "NoOfPieces" && (
//           <label className="block text-sm font-medium text-gray-700">
//             {reciever.label}
//           </label>
//         )}

//         {reciever.key === "ReceiverArea" ? (
//           <select
//             disabled={isSubmitted && !isEditClicked}
//             name="ReceiverArea"
//             value={formData.ReceiverArea}
//             onChange={handleChange}
//             className="w-full border rounded px-2 py-1"
//           >
//             <option value="">Select Area</option>
//             {cityList.map((area: any, idx: any) => (
//               <option key={idx} value={area.city}>
//                 {area.city}
//               </option>
//             ))}
//           </select>
//         ) : reciever.key === "ReceiverMobile1" ? (
//           <PhoneNumberInput
//             value={formData[reciever.key]}
//             handleChange={handleChange}
//             name={reciever.key}
//             disable={isSubmitted && !isEditClicked}
//           />
//         ) : reciever.key === "ReceiverMobile2" ? (
//           <PhoneNumberInput
//             value={formData[reciever.key]}
//             handleChange={handleChange}
//             name={reciever.key}
//             disable={isSubmitted && !isEditClicked}
//           />
//         ) : reciever.key === "NoOfPieces" ? (
//           <div className="w-[200px] ml-auto">
//             <label className="block text-sm font-medium text-gray-700">
//               {reciever.label}
//             </label>
//             <input
//               readOnly={isSubmitted && !isEditClicked}
//               name={reciever.key}
//               type="text"
//               className="w-full border rounded px-2 py-1"
//               value={formData[reciever.key]}
//               onChange={handleChange}
//               inputMode="numeric"
//             />
//           </div>
//         ) : reciever.key === "totalWeight" ? (
//           <div className="w-[200px] ml-auto">
//             <label className="block text-sm font-medium text-gray-700">
//               {/* {reciever.label} */}Total Weight
//             </label>
//             <input
//               readOnly={isSubmitted && !isEditClicked}
//               name={reciever.key}
//               type="text"
//               className="w-full border rounded px-2 py-1"
//               value={formData[reciever.key]}
//               onChange={handleChange}
//               inputMode="numeric"
//             />
//           </div>
//         ) 
        
//         : (
//           <input
//             readOnly={isSubmitted && !isEditClicked}
//             name={reciever.key}
//             type="text"
//             className="w-full border rounded px-2 py-1"
//             value={formData[reciever.key]}            onChange={handleChange}
//             inputMode="numeric"
//           />
//         )}

//         {errors[reciever.key] && (
//           <p className="text-sm text-red-600 mt-1">{errors[reciever.key]}</p>
//         )}
//       </div>
//     ))}
//   </div>
// </div>

//             {/* Charges Table */}
                
//             <div>
//                 <h3 className="text-lg font-bold text-blue-800 mb-2">Charges</h3>
//                 <div className="grid grid-cols-6 gap-2 font-semibold text-sm text-gray-600 border-b pb-1">
//                 <div>Apply</div>
//                 <div>Charge Type</div>
//                 <div>U / Rate</div>
//                 <div>Qty</div>
//                 <div>Total</div>
//                 </div>

//    {Object.entries(formData.Charges).map(([chargeKey, chargeData]) => {
//   if (chargeKey === "SubTotal") return null;

//   return (
//     <div key={chargeKey} className="grid grid-cols-6 gap-2 items-center mt-1">
//       <div>
//         {chargeKey === "Discount" ? (
//           <input
//             disabled={true}
//             type="checkbox"
//             className="h-4 w-4 text-blue-600"
//           />
//         ) : (
//           <input
//             type="checkbox"
//             checked={chargeData.enabled}
//             onChange={handleChange}
//             data-charge={chargeKey}
//             data-field="enabled"
//             className="h-4 w-4 text-blue-600"
//             // 👇 disable agar VAT zero hai ya form readonly mode me hai
//             disabled={!isVatActive || (isSubmitted && !isEditClicked)}
//           />
//         )}
//       </div>

//       <div className="text-sm font-medium text-gray-700">{chargeKey}</div>

//       <input
//         type="number"
//         step="0.01"
//         min="0"
//         value={chargeData.unitRate}
//         onChange={handleChange}
//         data-charge={chargeKey}
//         data-field="unitRate"
//         className="border rounded px-2 py-1"
//       />

//       <input
//         type="number"
//         step="0.01"
//         min="0"
//         value={chargeData.qty}
//         onChange={handleChange}
//         data-charge={chargeKey}
//         data-field="qty"
//         className="border rounded px-2 py-1"
//       />

//       <input
//         type="text"
//         value={chargeData.total}
//         readOnly
//         className="border rounded px-2 py-1 bg-gray-100"
//       />
//     </div>
//   );
// })}

//         {/* Subtotal */}
//                 <div className="grid grid-cols-6 gap-2 items-center mt-1">
//                     <div>
//                         <input 
//                         disabled
//                         type="checkbox"
//                         //   checked={chargeData.enabled}
//                         //   onChange={handleChange}
//                         //   data-charge={chargeKey}
//                         data-field="enabled"
//                         className="h-4 w-4 text-blue-600"
//                         />
//                     </div>
//                     <div className="text-sm font-medium text-gray-700">Sub Total</div>
//                     <div></div>
//                     <div></div>
//                     <input 
//                     type="text"
//                     value={formData.SubTotal}
//                     readOnly
//                     className="border rounded px-2 py-1 bg-gray-100"
//                     />
//                 </div>
//                 {/* Subtotal */}
//                 <div className="grid grid-cols-6 gap-2 items-center mt-1">
//                     <div>
//                         <input 
//                         disabled
//                         type="checkbox"
//                         //   checked={chargeData.enabled}
//                         //   onChange={handleChange}
//                         //   data-charge={chargeKey}
//                         data-field="enabled"
//                         className="h-4 w-4 text-blue-600"
//                         />
//                     </div>
    
//                     <div className="text-sm font-medium text-gray-700">Discount</div>
//                     <div></div>
//                     <div></div>
//                     <input 
//                         type="text"
//                         name="Discount"
//                         value={-`${formData.Discount}`|| 0}
//                   onChange={handleChange}
//                   readOnly={isSubmitted && !isEditClicked}
//                         className="border rounded px-2 py-1 bg-gray-100"
//                     />
//                 </div>


//                 {/* adnan code edited */}
//     <div className="grid grid-cols-6 gap-2 items-center mt-4 font-semibold text-gray-800">
// <div></div>
//  <div className="text-sm font-medium text-gray-700">Vat</div>
                    
//                     <div></div>
//                     <div></div>
//                     <input 
//                         type="text"
//                         name="Vat"
//   value={`${formData.Vat}`|| 0}
//                         // value={formData.Vat}
//                   onChange={handleChange}
//                   readOnly={isSubmitted && !isEditClicked}
//                         className="border rounded px-2 py-1 bg-gray-100"
//                     />


//     </div>
//     {/* adnan code edited */}
//                 {/* total Invoice */}
//                 <div className="grid grid-cols-6 gap-2 items-center mt-4 font-semibold text-gray-800">
//                 <div></div>
//                 <div>VAT ({formData.Vat}%) Total</div>
//                 <div></div>
//                 <div></div>
//                 <input 
//                     type="text"
//                     value={formData.VatTotal}
//                     readOnly
//                     className="border rounded px-2 py-1 bg-gray-100"
//                 />
//                 </div>
//                 <div className="grid grid-cols-6 gap-2 items-center mt-4 font-semibold text-gray-800">
//                 <div></div>
//                 <div>Invoice Total SAR:</div>
//                 <div></div>
//                 <div></div>
//                 <input 
//                     type="text"
//                     value={formData.InvoiceTotal}
//                     readOnly
//                     className="border rounded px-2 py-1 bg-gray-100"
//                 />
//                 </div>
//             </div>
            
//             {/* Amount in Words */}
//             <div className='mt-5'>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 Amount In Words SAR
//                 </label>
//                 <input  readOnly value={formData.AmountInWords} type="text" className="w-full border rounded px-2 py-1" />
//             </div>

//             {/* Invoice Total */}
//             {/* <div className="text-right">
//                 <div className="inline-block text-sm font-semibold text-gray-700 mr-2">
//                 Invoice Total SAR:
//                 </div>
//                 <input  type="text" readOnly value={formData.InvoiceTotal} className="border rounded px-2 py-1 w-48" />
//             </div> */}
//             <div>
//             {
//               !isSubmitted && 
              
//                 ( <button
//                 disabled={isSubmittedBooking}
//                   type="submit"
//                   className="md:col-span-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full mt-4 cursor-pointer"
//                 >
//                   {
//                         isSubmittedBooking ?
//                         <div className="flex justify-center">
//                         <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                         </svg>
//                       </div>:
//                   "Save Shipment"
//                   }
//                 </button>)
//             }
//             </div>
//           </form>

//           {/* Action Buttons */}
//           {
//             isSubmitted && 
//           <div>
//               <button
//                 type="button"
//                 onClick={handleNewShipment}
//                 className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition w-full mt-4 cursor-pointer"
//               >
//                 New Shipment
//               </button>
            
//             </div>
            
//           }
//           {
//             isEditClicked && 
//           <div>
//               <button
//                 type="button"
//                 onClick={handleEdit}
//                 className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition w-full mt-4 cursor-pointer"
//               >
//                   {isEditingBooking ?
//                     <div className="flex justify-center">
//                         <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                         </svg>
//                       </div>
//                     :"Edit Shipment"}
//               </button>
            
//             </div>
            
//           }
//              <div className="flex flex-wrap gap-4 justify-center pt-4">
//   {[
//     {
//       label: "Save & Print",
//       roles: ["admin", "user"], // ✅ visible to both
//       onClick: () => {
//         if (formData.BiltyNo && formData.Branch && formData.City && formData.InvoiceNo) {
//           handlePdfSave(formData, "Save&PRINT", "Shipment in Godown", formData.AmountInWords);
//         } else {
//           toast.error("Cannot Print PDF without Tracking Id, Invoice No, Branch and City");
//         }
//       },
//     },
//     {
//       label: "Save PDF",
//       roles: ["admin", "user"], // ✅ visible to both
//       onClick: () => {
//         if (formData.BiltyNo && formData.Branch && formData.City && formData.InvoiceNo) {
//           handlePdfSave(formData, "SavePDF", "Shipment in Godown", formData.AmountInWords);
//         } else {
//           toast.error("Cannot create PDF without Tracking Id, Invoice No, Branch and City");
//         }
//       },
//     },
//     {
//       label: "Edit Invoice",
//       roles: ["admin"], // 🔒 admin only
//       onClick: () => {
//         if (formData.BiltyNo) {
//           setIsEditClicked(true);
//         } else {
//           toast.error("Cannot edit fields without Bilty and Invoice No");
//         }
//       },
//     },
//     {
//       label: "Del. Invoice",
//       roles: ["admin"], // 🔒 admin only
//       onClick: () => handleDelete(formData.BiltyNo),
//       isLoading: isDeleting,
//     },
//     {
//       label: "PDF To Whatsapp",
//       roles: ["admin"], // 🔒 admin only
//       isLoading: whatsappLoading,
//     },
//   ]
//     // filter by role
//     .filter(({ roles }) => roles.includes(role))
//     .map(({ label, onClick, isLoading }, index) => {
//       if (label === "PDF To Whatsapp") {
//         return (
//           <button
//             key={index}
//             onClick={() => {
//               if (formData.BiltyNo && formData.Branch && formData.City && formData.InvoiceNo) {
//                 const file = handlePdfSave(formData, "SendToWhatsapp", "Shipment in Godown", formData.AmountInWords);
//                 if (file) handleSend(formData, file, setwhatsappLoading);
//               } else {
//                 toast.error("Cannot send PDF without Tracking Id, Invoice No, Branch and City");
//               }
//             }}
//             disabled={isLoading}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md cursor-pointer"
//           >
//             {isLoading ? (
//               <div className="flex justify-center">
//                 <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                   />
//                 </svg>
//               </div>
//             ) : (
//               label
//             )}
//           </button>
//         );
//       }

//       // default button rendering
//       return (
//         <button
//           key={index}
//           onClick={onClick}
//           disabled={isLoading}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md cursor-pointer"
//         >
//           {isLoading ? (
//             <div className="flex justify-center">
//               <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                 />
//               </svg>
//             </div>
//           ) : (
//             label
//           )}
//         </button>
//       );
//     })}
// </div>

//         </div>
        
//       </div>
//     )
//   }

//   export default InvoiceForm
import React, { useState, useEffect, FormEvent } from 'react';
import { numberToWords } from '@/lib/helper/numberToWord';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppRoutes } from '../constants/AppRoutes';
import { handlePdfSave } from '@/lib/helper/pdfGenerator';
import { handleSend } from '@/lib/helper/sendPdf';
import PhoneNumberInput from './PhoneNumberInput';
import { BookingFormData, ChargeItem, Charges } from '@/lib/helper/type';
import moment from "moment";

const InvoiceForm = ({ 
  cityList, 
  branchList, 
  loadingList, 
  role = sessionStorage.getItem("role") || "user" 
}: { 
  cityList: any; 
  branchList: any; 
  loadingList: boolean; 
  role?: string 
}) => {
      
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmittedBooking, setIsSubmittedBooking] = useState(false);
  const [isEditingBooking, setIsEditingBooking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [whatsappLoading, setwhatsappLoading] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [isVatActive, setIsVatActive] = useState(false);

  // ✅ Initial BookingDate as YYYY-MM-DD for <input type="date">
  const [formData, setFormData] = useState<BookingFormData>({
    BiltyNo: "",
    SenderName: "",
    SenderMobile: "",
    SenderIdNumber: "",
    SenderAddress: "",
    SenderArea: "",
    ReceiverName: "",
    ReceiverMobile1: "",
    ReceiverMobile2: "",
    ReceiverAddress: "",
    ReceiverArea: "",
    ItemDetails: "",
    OtherDetails: "",
    totalWeight: "",
    NoOfPieces: "",
    Discount: "",
    Branch: "",
    // 👇 UI کے لیے ISO فارمیٹ
    BookingDate: new Date().toISOString().split('T')[0], // e.g., "2025-10-28"

    Charges: {
      FreightCharges: { enabled: false, unitRate: '', qty: '', total: '' },
      Insurance: { enabled: false, unitRate: '', qty: '', total: '' },
      Packing: { enabled: false, unitRate: '', qty: '', total: '' },
      Customs: { enabled: false, unitRate: '', qty: '', total: '' },
      Clearance: { enabled: false, unitRate: '', qty: '', total: '' },
      OtherCharges: { enabled: false, unitRate: '', qty: '', total: '' },
    },
    SubTotal: "",
    Vat: "",
    VatTotal: "",
    AmountInWords: '',
    InvoiceTotal: '',
    City: '',
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked, dataset } = e.target;

    // if (name === "BiltyNo") {
    //   const onlyNumbers = value.replace(/\D/g, "");
    //   if (onlyNumbers.length <= 12) {
    //     setFormData(prev => ({ ...prev, BiltyNo: onlyNumbers }));
    //   }
    //   return;
    // }

    if (dataset && dataset.charge) {
      const chargeKey = dataset.charge;
      const field = dataset.field;

      setFormData(prev => {
        const updatedCharge = {
          ...prev.Charges[chargeKey],
          [field]: type === "checkbox" ? checked : value,
        };

        const unit = Math.max(0, parseFloat(field === 'unitRate' ? value : updatedCharge.unitRate) || 0);
        const qty = Math.max(0, parseFloat(field === 'qty' ? value : updatedCharge.qty) || 0);
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
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requiredFields: Array<keyof BookingFormData> = [
      'BookingDate', 'Branch', 'City', 'SenderName', 'SenderMobile',
      'SenderIdNumber', 'SenderAddress', 'SenderArea', 'ReceiverName',
      'ReceiverMobile1', 'ReceiverMobile2', 'ReceiverAddress', 'ReceiverArea', 'NoOfPieces'
    ];

    const numberFields = ['SenderMobile', 'ReceiverMobile1', 'ReceiverMobile2', 'NoOfPieces'];

    const newErrors: Record<string, string> = {};

    // if (formData.BiltyNo.length !== 0) {
    //   toast.error("Bilty provided manually.");
    //   return;
    // }

    // for (let field of requiredFields) {
    //   if (!formData[field]) {
    //     toast.error(`${field.replace(/([A-Z])/g, ' $1')} is required`);
    //     return;
    //   }
    // }

    for (let field of numberFields) {
      if (formData[field] && !/^\+?\d+$/.test(formData[field])) {
        toast.error(`${field.replace(/([A-Z])/g, ' $1')} must contain only numbers`);
        return;
      }
    }

    if (parseInt(formData.InvoiceTotal) < 0) {
      toast.error("Calculated total cannot be negative");
      return;
    }

    try {
      setIsSubmittedBooking(true);

      // ✅ API کو DD-MM-YYYY بھیجیں
      const payload = {
        ...formData,
        BookingDate: moment(formData.BookingDate).format("DD-MM-YYYY")
      };

      const response = await axios.post(AppRoutes.addBooking, payload);
      const data = response.data;

      // ✅ API سے واپس آنے والی تاریخ کو UI فارمیٹ میں کنورٹ کریں
      setFormData(prev => ({
        ...prev,
        ...data?.data?.bookingData,
        BookingDate: moment(data?.data?.bookingData.BookingDate, "DD-MM-YYYY").format("YYYY-MM-DD")
      }));

      toast.success(data?.data?.message);
      setIsSubmitted(true);
    } catch (error) {
      const err = (error as any).response?.data?.errors;
      if (err?.general) toast.error(err.general);
      else toast.error('Something went wrong');
    } finally {
      setIsSubmittedBooking(false);
    }
  };

  const handleNewShipment = () => {
    setFormData({
      SenderName: "",
      SenderMobile: "",
      SenderIdNumber: "",
      SenderAddress: "",
      SenderArea: "",
      ReceiverName: "",
      ReceiverMobile1: "",
      ReceiverMobile2: "",
      ReceiverAddress: "",
      ReceiverArea: "",
      ItemDetails: "",
      OtherDetails: "",
      totalWeight: "",
      NoOfPieces: "",
      Branch: "",
      Discount: "",
      BookingDate: new Date().toISOString().split('T')[0], // Reset to ISO

      Charges: {
        FreightCharges: { enabled: false, unitRate: '', qty: '', total: '' },
        Insurance: { enabled: false, unitRate: '', qty: '', total: '' },
        Packing: { enabled: false, unitRate: '', qty: '', total: '' },
        Customs: { enabled: false, unitRate: '', qty: '', total: '' },
        Clearance: { enabled: false, unitRate: '', qty: '', total: '' },
        OtherCharges: { enabled: false, unitRate: '', qty: '', total: '' },
      },
      SubTotal: "",
      Vat: "",
      VatTotal: "",
      AmountInWords: '',
      InvoiceTotal: '',
      BiltyNo: '',
      InvoiceNo: '',
      City: ''
    });
    setIsSubmitted(false);
    setIsEditClicked(false);
  };

  const handleEdit = async () => {
    if (formData.BiltyNo) {
      try {
        setIsEditingBooking(true);
        const payload = {
          ...formData,
          BookingDate: moment(formData.BookingDate).format("DD-MM-YYYY")
        };
        const response = await axios.post(AppRoutes.editBooking, payload);
        const data = response.data;

        setFormData(prev => ({
          ...prev,
          ...data?.data?.bookingData,
          BookingDate: moment(data?.data?.bookingData.BookingDate, "DD-MM-YYYY").format("YYYY-MM-DD")
        }));

        toast.success(data?.data?.message);
      } catch (error) {
        const err = error?.response?.data?.errors;
        if (err?.general) toast.error(err.general);
        else toast.error('Something went wrong');
      } finally {
        setIsEditingBooking(false);
        setIsEditClicked(false);
      }
    } else {
      toast.error("Cannot edit fields without Bilty and Invoice No");
    }
  };

  const handleDelete = async (builtNo: any) => {
    if (!builtNo) {
      toast.error('Builty no is missing');
      return;
    }
    try {
      setIsDeleting(true);
      const response = await axios.delete(AppRoutes.deleteBooking, { data: { BiltyNo: builtNo } });
      toast.success(response.data?.data?.message);
      handleNewShipment();
    } catch (error) {
      const err = error?.response?.data?.errors;
      if (err?.general) toast.error(err?.general);
      else toast.error('Something went wrong');
    } finally {
      setIsDeleting(false);
    }
  };

  // VAT useEffect
  useEffect(() => {
    setIsVatActive(parseFloat(formData.Vat) > 0);

    const allCharges = Object.entries(formData.Charges) as [keyof Charges, ChargeItem][];
    let totalCharges = allCharges.reduce((sum, [key, value]) => {
      if (key === 'Discount') return sum;
      const total = parseFloat(value.total) || 0;
      return sum + total;
    }, 0);

    const Discount = parseFloat(formData.Discount) || 0;
    const selectedCharges = allCharges.filter(
      ([key, value]) => value.enabled && key !== 'Discount'
    );

    const subtotal = Math.max(0, totalCharges);
    const selectedTotal = selectedCharges.reduce((sum, [_, charge]) => {
      const total = parseFloat(charge.total) || 0;
      return sum + total;
    }, 0);

    const vatPercent = parseFloat(formData.Vat) || 0;
    const vatTotal = ((selectedTotal - Discount) * vatPercent) / 100;
    const invoiceTotal = Math.max(0, subtotal + vatTotal - Discount);
    const amountInWords = numberToWords(invoiceTotal.toFixed(2));

    setFormData(prev => ({
      ...prev,
      SubTotal: subtotal.toFixed(2),
      VatTotal: vatTotal.toFixed(2),
      InvoiceTotal: invoiceTotal.toFixed(2),
      AmountInWords: amountInWords
    }));
  }, [formData.Charges, formData.Vat, formData.Discount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <div className='max-w-7xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6'>
        <form onSubmit={handleSubmit} className="">
          <div className="flex justify-between items-center border-b pb-4">
            <h1 className="text-2xl font-bold text-red-600">Pak Chinar Int'I Cargo</h1>
            <h2 className="text-xl font-semibold text-gray-700">New Invoice Entry</h2>
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="font-medium">Bilty No</label>
              <input 
                type="text" 
                className="w-full border rounded px-2 py-1"
                value={formData.BiltyNo} 
                onChange={handleChange} 
                name='BiltyNo'
                readOnly={isSubmitted && !isEditClicked} 
              />
            </div>
            <div>
              <label className="font-medium">Invoice No</label>
              <input  
                type="text" 
                readOnly 
                className="w-full border rounded px-2 py-1" 
                value={formData.InvoiceNo}
              />
            </div>
            <div>
              <label className="font-medium">Date</label>
              {/* ✅ input type="date" کو YYYY-MM-DD چاہیے */}
              <input 
                name='BookingDate' 
                type="date" 
                className="w-full border rounded px-2 py-1" 
                value={formData.BookingDate} 
                onChange={handleChange} 
                readOnly={isSubmitted && !isEditClicked}
              />
              {errors["BookingDate"] && (
                <p className="text-sm text-red-600 mt-1">{errors["BookingDate"]}</p>
              )}  
            </div>
            <div>
              <label className="font-medium">Branch</label>
              {loadingList ? (<h1>Loading...</h1>) : (
                <select
                  disabled={isSubmitted && !isEditClicked}
                  name="Branch"
                  value={formData.Branch}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="">Select Branch</option>
                  {branchList.map((branch, index) => (
                    <option key={index} value={branch.branch}>
                      {branch.branch}
                    </option>
                  ))}
                </select>
              )}
              {errors["Branch"] && (
                <p className="text-sm text-red-600 mt-1">{errors["Branch"]}</p>
              )}
            </div>
            <div>
              <label className="font-medium">City</label>
              {loadingList ? (<h1>Loading...</h1>) : (
                <select
                  disabled={isSubmitted && !isEditClicked}
                  name="City"
                  value={formData.City}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="">Select City</option>
                  {cityList.map((city, index) => (
                    <option key={index} value={city.city}>
                      {city.city}
                    </option>
                  ))}
                </select>
              )}
              {errors["City"] && (
                <p className="text-sm text-red-600 mt-1">{errors["City"]}</p>
              )}
            </div>
          </div>

          {/* ... باقی کوڈ (Sender/Receiver/Charges) ویسا ہی رہے گا ... */}
          {/* (آپ کا موجودہ باقی کوڈ درست ہے، صرف تاریخ کا مسئلہ تھا) */}

          {/* Sender & Receiver Sections — unchanged */}
          <div className="grid grid-cols-2 gap-6">
            {/* Sender Details */}
            <div>
              <h3 className="text-lg font-bold text-blue-800 mb-2">Sender Details</h3>
              {loadingList ? (
                <h1>loading...</h1>
              ) : (
                <>
                  {[
                    { label: "Name", key: "SenderName" },
                    { label: "Mobile No", key: "SenderMobile" },
                    { label: "ID Number", key: "SenderIdNumber" },
                    { label: "Address", key: "SenderAddress" },
                    { label: "City", key: "SenderArea" },
                    { label: "Other Details", key: "OtherDetails" },
                    { label: "Item Details", key: "ItemDetails" },
                  ].map((sender, index) => (
                    <div key={index} className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {sender.label}
                      </label>
                      {sender.key === "SenderArea" ? (
                        <select
                          disabled={isSubmitted && !isEditClicked}
                          name="SenderArea"
                          value={formData.SenderArea}
                          onChange={handleChange}
                          className="w-full border rounded px-2 py-1"
                        >
                          <option value="">Select Area</option>
                          {cityList.map((area: any, idx: any) => (
                            <option key={idx} value={area.city}>
                              {area.city}
                            </option>
                          ))}
                        </select>
                      ) : sender.key === "SenderMobile" ? (
                        <PhoneNumberInput
                          value={formData[sender.key]}
                          handleChange={handleChange}
                          name={sender.key}
                          disable={isSubmitted && !isEditClicked}
                        />
                      ) : sender.key === "OtherDetails" || sender.key === "ItemDetails" ? (
                        <textarea
                          name={sender.key}
                          value={formData[sender.key] || ""}
                          onChange={handleChange}
                          rows={4}
                          className="sm:w-full md:w-[400px] lg:w-[700px] xl:w-[900px] border rounded px-2 py-1"
                        />
                      ) : (
                        <input
                          readOnly={isSubmitted && !isEditClicked}
                          name={sender.key}
                          type="text"
                          value={formData[sender.key]}
                          onChange={handleChange}
                          className="w-full border rounded px-2 py-1"
                        />
                      )}
                      {errors[sender.key] && (
                        <p className="text-sm text-red-600 mt-1">{errors[sender.key]}</p>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Receiver Details */}
            <div>
              <h3 className="text-lg font-bold text-blue-800 mb-2">Receiver Details</h3>
              {[
                { label: "Name", key: "ReceiverName" },
                { label: "Mobile No 1", key: "ReceiverMobile1" },
                { label: "Mobile No 2", key: "ReceiverMobile2" },
                { label: "Address", key: "ReceiverAddress" },
                { label: "City", key: "ReceiverArea" },
                { label: "No Of Pieces", key: "NoOfPieces" },
                { label: "", key: "totalWeight" },
              ].map((reciever, index) => (
                <div key={index} className="mb-2">
                  {reciever.key !== "NoOfPieces" && (
                    <label className="block text-sm font-medium text-gray-700">
                      {reciever.label}
                    </label>
                  )}
                  {reciever.key === "ReceiverArea" ? (
                         <input
                      disabled={isSubmitted && !isEditClicked}
                       name="ReceiverArea"
                        type="text"
                        className="w-full border rounded px-2 py-1"
                       value={formData.ReceiverArea}
                        onChange={handleChange}
                       
                      />
                    // <select
                    //   disabled={isSubmitted && !isEditClicked}
                    //   name="ReceiverArea"
                    //   value={formData.ReceiverArea}
                    //   onChange={handleChange}
                    //   className="w-full border rounded px-2 py-1"
                    // >
                    //   <option value="">Select Area</option>
                    //   {cityList.map((area: any, idx: any) => (
                    //     <option key={idx} value={area.city}>
                    //       {area.city}
                    //     </option>
                    //   ))}
                    // </select>
                  ) : reciever.key === "ReceiverMobile1" || reciever.key === "ReceiverMobile2" ? (
                    <PhoneNumberInput
                      value={formData[reciever.key]}
                      handleChange={handleChange}
                      name={reciever.key}
                      disable={isSubmitted && !isEditClicked}
                    />
                  ) : reciever.key === "NoOfPieces" ? (
                    <div className="w-[200px] ml-auto">
                      <label className="block text-sm font-medium text-gray-700">
                        {reciever.label}
                      </label>
                      <input
                        readOnly={isSubmitted && !isEditClicked}
                        name={reciever.key}
                        type="text"
                        className="w-full border rounded px-2 py-1"
                        value={formData[reciever.key]}
                        onChange={handleChange}
                        inputMode="numeric"
                      />
                    </div>
                  ) : reciever.key === "totalWeight" ? (
                    <div className="w-[200px] ml-auto">
                      <label className="block text-sm font-medium text-gray-700">
                        Total Weight
                      </label>
                      <input
                        readOnly={isSubmitted && !isEditClicked}
                        name={reciever.key}
                        type="text"
                        className="w-full border rounded px-2 py-1"
                        value={formData[reciever.key]}
                        onChange={handleChange}
                        inputMode="numeric"
                      />
                    </div>
                  ) : (
                    <input
                      readOnly={isSubmitted && !isEditClicked}
                      name={reciever.key}
                      type="text"
                      className="w-full border rounded px-2 py-1"
                      value={formData[reciever.key]}
                      onChange={handleChange}
                    />
                  )}
                  {errors[reciever.key] && (
                    <p className="text-sm text-red-600 mt-1">{errors[reciever.key]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Charges Table — unchanged */}
          <div>
            <h3 className="text-lg font-bold text-blue-800 mb-2">Charges</h3>
            <div className="grid grid-cols-6 gap-2 font-semibold text-sm text-gray-600 border-b pb-1">
              <div>Apply</div>
              <div>Charge Type</div>
              <div>U / Rate</div>
              <div>Qty</div>
              <div>Total</div>
            </div>

            {Object.entries(formData.Charges).map(([chargeKey, chargeData]) => {
              if (chargeKey === "SubTotal") return null;
              return (
                <div key={chargeKey} className="grid grid-cols-6 gap-2 items-center mt-1">
                  <div>
                    {chargeKey === "Discount" ? (
                      <input disabled type="checkbox" className="h-4 w-4 text-blue-600" />
                    ) : (
                      <input
                        type="checkbox"
                        checked={chargeData.enabled}
                        onChange={handleChange}
                        data-charge={chargeKey}
                        data-field="enabled"
                        className="h-4 w-4 text-blue-600"
                        disabled={!isVatActive || (isSubmitted && !isEditClicked)}
                      />
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-700">{chargeKey}</div>
                  <input
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

            {/* Subtotal, Discount, VAT, Total — unchanged */}
            <div className="grid grid-cols-6 gap-2 items-center mt-1">
              <div><input disabled type="checkbox" className="h-4 w-4 text-blue-600" /></div>
              <div className="text-sm font-medium text-gray-700">Sub Total</div>
              <div></div><div></div>
              <input type="text" value={formData.SubTotal} readOnly className="border rounded px-2 py-1 bg-gray-100" />
            </div>
            <div className="grid grid-cols-6 gap-2 items-center mt-1">
              <div><input disabled type="checkbox" className="h-4 w-4 text-blue-600" /></div>
              <div className="text-sm font-medium text-gray-700">Discount</div>
              <div></div><div></div>
              <input
                type="text"
                name="Discount"
                value={-`${formData.Discount}` || 0}
                onChange={handleChange}
                readOnly={isSubmitted && !isEditClicked}
                className="border rounded px-2 py-1 bg-gray-100"
              />
            </div>
            <div className="grid grid-cols-6 gap-2 items-center mt-4 font-semibold text-gray-800">
              <div></div>
              <div className="text-sm font-medium text-gray-700">Vat</div>
              <div></div><div></div>
              <input
                type="text"
                name="Vat"
                value={`${formData.Vat}` || 0}
                onChange={handleChange}
                readOnly={isSubmitted && !isEditClicked}
                className="border rounded px-2 py-1 bg-gray-100"
              />
            </div>
            <div className="grid grid-cols-6 gap-2 items-center mt-4 font-semibold text-gray-800">
              <div></div>
              <div>VAT ({formData.Vat}%) Total</div>
              <div></div><div></div>
              <input type="text" value={formData.VatTotal} readOnly className="border rounded px-2 py-1 bg-gray-100" />
            </div>
            <div className="grid grid-cols-6 gap-2 items-center mt-4 font-semibold text-gray-800">
              <div></div>
              <div>Invoice Total SAR:</div>
              <div></div><div></div>
              <input type="text" value={formData.InvoiceTotal} readOnly className="border rounded px-2 py-1 bg-gray-100" />
            </div>
          </div>

          {/* Amount in Words */}
          <div className='mt-5'>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Amount In Words SAR</label>
            <input readOnly value={formData.AmountInWords} type="text" className="w-full border rounded px-2 py-1" />
          </div>

          {/* Submit Button */}
          {!isSubmitted && (
            <button
              disabled={isSubmittedBooking}
              type="submit"
              className="md:col-span-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full mt-4 cursor-pointer"
            >
              {isSubmittedBooking ? (
                <div className="flex justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : "Save Shipment"}
            </button>
          )}
        </form>

        {/* Action Buttons */}
        {isSubmitted && (
          <button
            type="button"
            onClick={handleNewShipment}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition w-full mt-4 cursor-pointer"
          >
            New Shipment
          </button>
        )}
        {isEditClicked && (
          <button
            type="button"
            onClick={handleEdit}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition w-full mt-4 cursor-pointer"
          >
            {isEditingBooking ? (
              <div className="flex justify-center">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : "Edit Shipment"}
          </button>
        )}

        {/* PDF/WhatsApp Buttons — unchanged */}
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          {[
           {
  label: "Save & Print",
  roles: ["admin", "user"],
  onClick: () => {
    if (formData.BiltyNo && formData.Branch && formData.City && formData.InvoiceNo) {
      handlePdfSave(formData, "Save&PRINT", "Shipment in Godown", null);
    } else {
      toast.error("Cannot create PDF without Tracking Id, Invoice No, Branch and City");
    }
  },
},
      {
  label: "Save PDF",
  roles: ["admin", "user"],
  onClick: () => {
    if (formData.BiltyNo && formData.Branch && formData.City && formData.InvoiceNo) {
      handlePdfSave(formData, "SavePDF", "Shipment in Godown", null);
    } else {
      toast.error("Cannot create PDF without Tracking Id, Invoice No, Branch and City");
    }
  },
},
 
            {
              label: "Edit Invoice",
              roles: ["admin"],
              onClick: () => {
                if (formData.BiltyNo) {
                  setIsEditClicked(true);
                } else {
                  toast.error("Cannot edit fields without Bilty and Invoice No");
                }
              },
            },
            {
              label: "Del. Invoice",
              roles: ["admin"],
              onClick: () => handleDelete(formData.BiltyNo),
              isLoading: isDeleting,
            },
            {
              label: "PDF To Whatsapp",
              roles: ["admin"],
              isLoading: whatsappLoading,
            },
          ]
            .filter(({ roles }) => roles.includes(role))
            .map(({ label, onClick, isLoading }, index) => {
              if (label === "PDF To Whatsapp") {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (formData.BiltyNo && formData.Branch && formData.City && formData.InvoiceNo) {
                        const file = handlePdfSave(formData, "SendToWhatsapp", "Shipment in Godown", formData.AmountInWords);
                        if (file) handleSend(formData, file, setwhatsappLoading);
                      } else {
                        toast.error("Cannot send PDF without Tracking Id, Invoice No, Branch and City");
                      }
                    }}
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
              }
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
  );
};

export default InvoiceForm;