// --- Type Definitions (You can place these in a separate file like types/booking.ts) ---

// Define the shape of a single Charge item
export interface ChargeItem {
    enabled: boolean;
    unitRate: string; // Stored as string to handle form input
    qty: string;      // Stored as string to handle form input
    total: string;    // Calculated total stored as string
}

// Define the shape of the entire Charges object
export interface Charges {
    FreightCharges: ChargeItem;
    Insurance: ChargeItem;
    Packing: ChargeItem;
    Customs: ChargeItem;
    Clearance: ChargeItem;
    OtherCharges: ChargeItem;
    //Discount: ChargeItem;
    [key: string]: ChargeItem; // Index signature for easier access
}

// Define the shape of the main form data
export interface BookingFormData {
    BiltyNo: string;
    SenderName: string;
    SenderMobile: string;
    SenderIdNumber: string;
    SenderAddress: string;
    SenderArea: string;
    totalWeight: string;
    ReceiverName: string;
    ReceiverMobile1: string;
    ReceiverMobile2: string;
    ReceiverAddress: string;
    ReceiverArea: string;
    ItemDetails: string;
    OtherDetails: string;
    Discount: string;
    NoOfPieces: string;
    Branch: string;
    BookingDate: string; // ISO string format 'YYYY-MM-DD'
    
    Charges: Charges;

    SubTotal: string;
    Vat: string;
    VatTotal: string;
    
    AmountInWords: string;
    InvoiceTotal: string;
    City: string;
    InvoiceNo?: string; // Optional field, likely set after submission
}

// Define the shape for Branch/City items fetched from the API
export interface LocationItem {
    id: number;
    name: string;
    // Add other fields if present in API response
}

// Define the props for InvoiceForm
export interface InvoiceFormProps {
    cityList: LocationItem[];
    branchList: LocationItem[];
    loadingList: boolean;
}
