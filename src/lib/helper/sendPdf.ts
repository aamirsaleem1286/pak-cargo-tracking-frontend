import axios from "axios";
import { toast } from "react-toastify";
import { AppRoutes } from "../../constants/AppRoutes";

export const handleSend = async (formData,file,setwhatsappLoading) => {
    // console.log(formData);
    // console.log(file);
    // console.log(setwhatsappLoading);
    
    // Validation
      if (!file) {
        toast.error("Please upload a file.");
        return;
      }
    
      // const allContacts = [];
    
      // // Push the available numbers safely
      // if (formData.SenderMobile) allContacts.push(formData.SenderMobile);
      // if (formData.ReceiverMobile1) allContacts.push(formData.ReceiverMobile1);
      // if (formData.ReceiverMobile2) allContacts.push(formData.ReceiverMobile2);
    
  const allContacts = Array.from(new Set([
  formData.SenderMobile,
  formData.ReceiverMobile1,
  formData.ReceiverMobile2
].filter(Boolean))); // removes undefined / empty

      if (allContacts.length === 0) {
        toast.error("Please add at least one contact number.");
        return;
      }
    
      try {
        
        setwhatsappLoading(true)
        const formDataToSend = new FormData();
    
        // Append the file (decide if it's image or other)
        formDataToSend.append(
          file.type.startsWith("image/") ? "marketingImage" : "marketingFile",
          file
        );
    
        // Append all WhatsApp numbers
        allContacts.forEach((num) =>
          formDataToSend.append("whatsappNumbers", num)
        );
    
        // Send to backend
        const response = await axios.post(
          AppRoutes.sendMediaTwhatsapp,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
    
        toast.success(response.data?.data?.message);
      } catch (error) {
        console.error(error);
        const err = error?.response?.data?.errors;
        if (err?.general) toast.error(err.general);
        else toast.error("Something went wrong");
      } finally {
        setwhatsappLoading(false)
      }
    };