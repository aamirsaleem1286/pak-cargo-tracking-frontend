import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {useNavigate} from 'react-router-dom'
import { toast } from "react-toastify";
interface TrackingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TrackingModal = ({ open, onOpenChange }: TrackingModalProps) => {
    const [trackingNumber, setTrackingNumber] = useState("");

  const navigate = useNavigate();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  // const { toast } = useToast();

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
  const handleTrackPackage = () => {
    if (invoiceNumber.length !== 12) {
          toast.error("Tracking No must be exactly 12 digits");
          return;
        }
        navigate(`/track/?invoice=${invoiceNumber}`)
    // if (invoiceNumber.trim()) {
    //   toast({
    //     title: "Tracking Package",
    //     description: `Searching for package with invoice: ${invoiceNumber}`,
    //   });
    //   setInvoiceNumber("");
    //   onOpenChange(false);
    // } else {
    //   toast({
    //     title: "Error",
    //     description: "Please enter a valid invoice number",
    //     variant: "destructive",
    //   });
    // }


  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Tracking
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            name="invoiceNo"
            type="text"
            placeholder="Enter your invoice number"
            // value={invoiceNumber}
            onChange={handleChange}
            className="w-full"
            // onKeyPress={(e) => e.key === 'Enter' && handleTrackPackage()}
          />
          <Button 
            onClick={handleTrack}
            className="w-full bg-brand-blue hover:bg-brand-blue-light text-white"
          >
            Track Package
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrackingModal;