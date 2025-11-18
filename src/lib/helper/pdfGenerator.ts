import axios from "axios";
import { jsPDF } from "jspdf";

// Extend jsPDF to include lastAutoTable
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: { finalY: number };
  }
}
import autoTable from "jspdf-autotable";
import { AppRoutes } from "../../constants/AppRoutes";
import { toast } from "react-toastify";

// export const handlePdfSave = (
//   formData,
//   buttonType,
//   status,
//   setwhatsappLoading
// ) => {
//   const doc = new jsPDF();
//   const safeText = (val) => String(val ?? "");
//   const shipmentStatus = status || "Ship?ment in Godown";

//   const formatDate = (dateStr) => {
//     const [y, m, d] = (dateStr || "").split("-");
//     return d && m && y ? `${d}/${m}/${y}` : "";
//   };

//   // ==== HEADER ====
  
//   const companyLines = doc.splitTextToSize("Pak Chinar Int'I Cargo", 90);

//   doc.setFontSize(15);
//   doc.setFont("helvetica", "normal");
//   const addressLines = doc.splitTextToSize(
//     "Dammam Al-Khaleej, Street 22, Double Road Opposite Boys School Near Al-Ahli Bank ATM",
//     80
//   );
//   const companyNumber = doc.splitTextToSize("+966591080611 | +966590878234 | +966590056199",
//     90
//   );

//   const companyY = 15;
//   const addressY = companyY + companyLines.length * 8;
//   const numberY = addressY + companyY + companyLines.length * 6;
//   const footerY = addressY + addressLines.length * 6;
//   const rightColumnBottom = footerY + 18;

//   const invoiceInfoY = 28;
//   const leftColumnBottom = footerY + 18;

//   const headerHeight = Math.max(50,  leftColumnBottom);

//   doc.setFillColor(33, 91, 168);
//   doc.rect(0, 0, 210, headerHeight, "F");

//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(22);
//   doc.setFont("helvetica", "bold");
//   // doc.text("Invoice", 120, companyY);

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(15);
//   // doc.text(`Invoice #: ${safeText(formData.InvoiceNo)}`, 120, companyY + 8);
//   doc.text(
//     `Booking Date: ${formatDate(formData.BookingDate)}`,
//     120,
//     companyY + 0
//   );
//   // doc.text(`Tracking Id: ${safeText(formData.BiltyNo)}`, 120, companyY + 20);
//   doc.text(`From: ${formData.SenderArea}`, 147, companyY + 6);

//   doc.text(`TO: ${formData.ReceiverArea}`, 147, companyY + 12);
//     doc.text(`Bilty Number: ${formData.BiltyNo}`, 120, companyY + 18);

//   // doc.text(`Total Weight: ${formData.totalWeight} KG`, 120, companyY + 38);

  
//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(20);
//   doc.setFont("helvetica", "bold");
//   companyLines.forEach((line, i) => doc.text(line, 10, companyY + i * 6));
//   doc.setFontSize(12);
//   addressLines.forEach((line, i) => doc.text(line, 10, addressY + i * 6));
//   companyNumber.forEach((line, i) => doc.text(line, 10, numberY + i * 6));

//   // doc.text("City", 120, footerY);
//   // doc.text("Saudi Arabia", 120, footerY + 6);
//   // doc.text("75311", 120, footerY + 12);

//   // ==== BODY START ====
//   const bodyStartY = headerHeight + 10;

//   // Sender and Receiver
//   doc.setTextColor(0, 0, 0);
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "bold");
//   doc.text("Consigner Name and Address:", 15, bodyStartY);
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "normal");
//   const senderLines = [
//     `Name:       ${safeText(formData.SenderName)}`,
//     // `ID:             ${safeText(formData.SenderIdNumber)}`,
//     `Mobile:      ${safeText(formData.SenderMobile)}`,
//     // `Address:    ${safeText(formData.SenderAddress)}`,
//     // `City:           ${safeText(formData.SenderArea)}`,
//   ];
//   // let currentY = bodyStartY + 5;

//   // senderLines.forEach((line) => {
//   //   const wrappedText = doc.splitTextToSize(line, 80); // 80 = max width
//   //   doc.text(wrappedText, 15, currentY);
//   //   currentY += wrappedText.length * 5; // move Y based on how many lines wrapped
//   // });

//   let currentY = bodyStartY + 7;

//   senderLines.forEach((line) => {
//     const wrappedText = doc.splitTextToSize(line, 80); // wrap line to array

//     if (line.startsWith("Address:")) {
//       // First line x = 15
//       doc.text(wrappedText[0], 15, currentY);
//       currentY += 5;

//       // Remaining lines x = 30
//       for (let i = 1; i < wrappedText.length; i++) {
//         doc.text(wrappedText[i], 37, currentY);
//         currentY += 5;
//       }
//     } else {
//       // For all other lines
//       doc.text(wrappedText, 15, currentY);
//       // currentY += wrappedText.length * 4.5;
//       currentY += wrappedText.length * 6;
//     }
//   });
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "bold");
//   // doc.text("RECEIVER DETAILS:", 130, bodyStartY);
//   doc.text("Consignee Name & Address:", 120, bodyStartY);
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "normal");
//   const receiverLines = [
//     `Name:         ${safeText(formData.ReceiverName)}`,
//     `Mobile 1:    ${safeText(formData.ReceiverMobile1)}`,
//     `Mobile 2:    ${safeText(formData.ReceiverMobile2)}`,
//     `Address:     ${safeText(formData.ReceiverAddress)}`,
//     `City:            ${safeText(formData.ReceiverArea)}`,
//   ];
//   // let currentRY = bodyStartY + 5;
//   let currentRY = bodyStartY + 7;

//   receiverLines.forEach((line) => {
//     const wrappedText = doc.splitTextToSize(line, 80); // wrap line to array

//     if (line.startsWith("Address:")) {
//       // First line x = 15
//       doc.text(wrappedText[0], 120, currentRY);
//       currentRY += 5;

//       // Remaining lines x = 30
//       for (let i = 1; i < wrappedText.length; i++) {
//         doc.text(wrappedText[i], 143, currentRY);
//         currentRY += 5;
//       }
//     } else {
//       // For all other lines
//       doc.text(wrappedText, 120, currentRY);
//       currentRY += wrappedText.length * 6;
//     }
//   });

//   // const detailStartY = bodyStartY + Math.max(senderLines.length, receiverLines.length) * 6 + 10;
//   const detailStartY =
//     bodyStartY + Math.max(senderLines.length, receiverLines.length) * 5 + 20;
//   // const detailStartY = bodyStartY +  receiverLines.length * 5 + 20;

//   // --- Column Positions ---
//   // === Column Positions ===
//   const col1X = 20; // Pieces
//   const col2X = 65; // Item Details
//   const col3X = 130; // Other Details
//   const maxWidth = 55; // text wrap width per column
//   const lineHeight = 4; // reduced gap
//   let y = detailStartY;

//   // === TABLE HEADER ===
//   const headerHeight1 = 7; // header ki height (adjustable)
//   doc.setFillColor(255, 255, 255); // Light blue background
//   doc.rect(15, y - 5, 185, headerHeight1, "F");
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "bold");
//   // doc.text("Pieces", col1X, y);
//   // doc.text("Item Details", col2X, y);
//   // doc.text("Other Details", col3X, y);

//   // Thin line under header (optional)
//   // doc.setFillColor(215, 234, 249);
//   // doc.setLineWidth(0.2);
//   // doc.line(15, y + 1.5, 200, y + 1.5);

//   y += 6; // small space below header

//   // === TABLE BODY ===

//   // Column 1 — Pieces
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(12);
//   // doc.text(safeText(formData.NoOfPieces), col1X+5, y+5);

//   // Column 2 — Item Details (wrapped)
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(12);
//   const itemLines = doc.splitTextToSize(
//     safeText(formData.ItemDetails),
//     maxWidth
//   );
//   // doc.text(itemLines, col2X, y+2);

//   // Column 3 — Other Details (wrapped)
//   const otherLines = doc.splitTextToSize(
//     safeText(formData.OtherDetails),
//     maxWidth
//   );
//   doc.text(otherLines, col3X, y+2);





//     doc.text(`Invoice Number: ${formData.InvoiceNo}`, 12,  120);
//     doc.text(`Total weight: ${formData.totalWeight} KG`, 80,  120);
//     doc.text(`Total Charges: SAR ${formData.InvoiceTotal}`, 140,  120);

//     // doc.text(`Invoice Number: ${formData.InvoiceNo}`, 12,  120);
//         doc.text(`Sender Id: ${formData.SenderIdNumber}`, 12,  128);
//     doc.text(`Total Pieces: ${formData.NoOfPieces}`, 80,  128);
//     doc.text(`Payment: Paid`, 140,  128);




//   // === Calculate height for next section ===
//   const bodyHeight =
//     Math.max(itemLines.length, otherLines.length) * lineHeight + 4;
//   const tableEndY = y + bodyHeight;

//   // Optional bottom line for table
//   //doc.setLineWidth(0.1);
//   //doc.line(15, tableEndY, 200, tableEndY);

//   // --- Calculate dynamic next Y position for next section ---
//   const rowHeight =
//     Math.max(itemLines.length, otherLines.length) * lineHeight + 8;
//   const tableStartY = y + rowHeight;
//   // ========== CHARGES TABLE ==========
//   // autoTable(doc, {
//   //   head: [["#", "CHARGES", "UNIT/RATE", "QUANTITY", "SAR TOTAL"]],
//   //   body: Object.entries(formData.Charges || {}).map(([key, value], index) => [
//   //     index + 1,
//   //     safeText(key),
//   //     `${safeText(value.unitRate)}`,
//   //     value.qty > 0 ? `${value.qty}` : "",
//   //     value.qty > 0 ? `${safeText(value.total)}` : "",
//   //   ]),
//   //   startY: tableStartY,
//   //   theme: "grid",

//   //   // âœ… Center align body columns
//   //   columnStyles: {
//   //     0: { halign: 'center' },
//   //     1: { halign: 'left' },
//   //     2: { halign: 'center' },
//   //     3: { halign: 'center' },
//   //     4: { halign: 'center' },
//   //   },

//   //   // âœ… Center align header text
//   //   headStyles: {
//   //     halign: 'center',
//   //   }
//   // });
 
// autoTable(doc, {
//   head: [["No.", "Description", "QUANTITY", ]],
//   body: Object.entries(formData.Charges || {}).map(([key, value], index) => {
//     const charge = value as { unitRate: string; qty: number; total: string };
//     return [
//       index + 1,
//       safeText(key),
//       `${safeText(charge.unitRate)}`,
//       charge.qty > 0 ? `${charge.qty}` : "",
//       charge.qty > 0 ? `${safeText(charge.total)}` : "",
//     ];
//   }),

//   startY: tableStartY,
//   margin: { top: 2, bottom: 2 },
//   styles: {
//     cellPadding: 1.2,
//     fontSize: 12,
//   },
//   theme: "grid",

//   tableWidth: "auto", // ✅ table full width maintain karega

//   columnStyles: {
//     0: { halign: "center", cellWidth: 15 }, // No. (narrow)
//     1: { halign: "left", cellWidth: 130 },  // Description (wide)
//     2: { halign: "center", cellWidth: 35 }, // Quantity (narrow)
   
//   },

//   headStyles: {
//     halign: "center",
//   },
// });




//   const finalY = doc.lastAutoTable?.finalY+5 || tableStartY ;

//   const notesBoxX = 0;
//   const notesBoxWidth = 120;
//   const notesY = finalY;
//   // const boxHeight = 30;
//   const boxHeight = 20;

//   // Draw Notes Box
//   doc.setFillColor(255, 255, 255);
//   doc.rect(notesBoxX, notesY, notesBoxWidth, boxHeight+50, "F");

//   // Set styles
//   doc.setTextColor(0, 0, 0);
//   doc.setFontSize(12);

//   // Text content
//   const notesTitle = "Amount In Words:";
//   const thankYouMsg = formData.AmountInWords;
//   const wrappedText = doc.splitTextToSize(thankYouMsg, notesBoxWidth - 20); // padding 10 on both sides
//   // const lineHeight = 6;
//   // const lineHeight = 5;
//   const textHeight = wrappedText.length * lineHeight;

//   // Center content vertically in box
//   const verticalStart = notesY + (boxHeight - textHeight - lineHeight) ;

//   // Render bold title
//   doc.setFont(undefined, "bold");
//   doc.text(notesTitle, notesBoxX + 10, verticalStart);

//   // Render normal wrapped lines
//   doc.setFont(undefined, "normal");
//   wrappedText.forEach((line, i) => {
//     doc.text(line, notesBoxX + 10, verticalStart + lineHeight * (i +1.5));
//   });

//   // ========== TOTALS ==========
//   // const summaryItems = [
//   //   { label: "SUBTOTAL", value: `SAR ${safeText(formData.SubTotal)}` },
//   //   { label: "VAT", value: `SAR ${safeText(formData.VatTotal)}` },
//   //   { label: "TOTAL", value: `SAR ${safeText(formData.InvoiceTotal)}` },
//   // ];

//   // summaryItems.forEach((item, i) => {
//   //   // const y = finalY + 10 + i * 10;
//   //   const y = finalY  + i * 7.1;
//   //   doc.setFillColor(215, 234, 249);
//   //   // doc.setFillColor(33, 91, 168);
//   //   doc.setTextColor(0, 0, 0);
//   //   doc.rect(120, y, 100, 100, "F");
//   //   doc.setFontSize(12);
//   //   doc.setFont("helvetica", "bold");
//   //   doc.text(item.label, 120, y + 7);
//   //   doc.setFontSize(12);
//     // doc.text(item.value, 205, y + 5, { align: "left" });
//   //   doc.text(item.value, 160, y+7, { align: "left" });
//   // });

//   // Footer Box (Head Office & Branches)
//   function drawFooterBlock(title, address, phone, startX, startY) {
//     doc.setFontSize(12);

//     // Title
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor("white");
//     doc.text(title, startX, startY);
//     let currentY = startY + 5;

//     // Address
//     doc.setFont("helvetica", "normal");
//     const addressLabel = "Address:";
//     const addressText = safeText(address);
//     const addressLabelWidth = doc.getTextWidth(addressLabel + " ");

//     const addressLines = doc.splitTextToSize(
//       addressText,
//       210 - startX - addressLabelWidth - 5
//     );

//     // First address line (label + first line)
//     doc.text("", startX, currentY);
//     doc.text(addressLines[0], startX + addressLabelWidth, currentY);
//     currentY += 5;

//     // Remaining address lines
//     for (let i = 1; i < addressLines.length; i++) {
//       doc.text(addressLines[i], startX + addressLabelWidth, currentY);
//       currentY += 0;
//     }

//     // Phone
//     const phoneLabel = "Phone:";
//     const phoneText = safeText(phone);
//     const phoneLabelWidth = doc.getTextWidth(phoneLabel + " ");

//     const phoneLines = doc.splitTextToSize(
//       phoneText,
//       210 - startX - phoneLabelWidth - 5
//     );

//     // First phone line (label + first line)
//     doc.text("", startX, currentY);
//     doc.text(phoneLines[0], startX + phoneLabelWidth, currentY);
//     currentY += 5;

//     // Remaining phone lines
//     for (let i = 1; i < phoneLines; i++) {
//       doc.text(phoneLines[i], startX + phoneLabelWidth, currentY);
//       currentY += 5;
//     }

//     return currentY + 3; // spacing before next block
//   }

//   // let footerStartY = finalY + 10 + summaryItems.length * 10 + 3; // start after totals

//   // // // Optional: adjust page height if footer exceeds page
//   // const pageHeight = doc.internal.pageSize.height;
//   // if (footerStartY + 40 > pageHeight) {
//   //   doc.addPage(); // Add new page if needed
//   //   footerStartY = 20; // reset Y for new page
//   //   }
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const footerReservedHeight = 25;
//   let footerStartY = pageHeight - footerReservedHeight;

//   // Optional: draw background if you want the footer to stand out
//   doc.setFillColor(33, 91, 168);
//   doc.rect(0, footerStartY - 15, 210, 50, "F"); // 60 is approx footer height

//   // Now render footer blocks
//   let footerYY = footerStartY;

//   footerYY = drawFooterBlock(
//     "Dammam Head Office:",
//     "Dammam Al-Khaleej, Street 22, Double Road Opposite Boys School Near Al-Ahli Bank ATM",
//     "+966591080611 | +966590878234 | +966590056199",
//     10,
//     footerYY -5
//   );

//   footerYY = drawFooterBlock(
//     "Al-Thuqbah Office:",
//     "",
//     "",
//     10,
//     footerYY -2
//   );

//   footerYY = drawFooterBlock(
//     "AL HASSA(-HOFUF) Office:",
//     "",
//     "",
//     10,
//     footerYY -10
//   );

//   // ========== AMOUNT IN WORDS ==========
//   // const totalsY = finalY + 10;
//   //   const amountHeading = "Amount in Words:";
//   //   const amountText = safeText(formData.AmountInWords);
//   //   const amountLines = doc.splitTextToSize(amountText, 210);
//   //   const amountHeight = 6 + amountLines.length * 6 + 6;

//   //   let amountWordsY = totalsY + summaryItems.length * 10 + 7;

//   //   if (amountWordsY + amountHeight > doc.internal.pageSize.getHeight()) {
//   //     doc.addPage();
//   //     amountWordsY = 5;
//   //   }

//   //   doc.setFont("helvetica", "bold");
//   //   doc.setFontSize(12);
//   //   doc.setTextColor(0, 0, 0);
//   //   doc.text(amountHeading, 15, amountWordsY);

//   //   doc.setFont("helvetica", "normal");
//   //   doc.setFontSize(11);
//   //   amountLines.forEach((line, i) => {
//   //     doc.text(line, 15, amountWordsY + 6 + i * 6);
//   //   });
//   const fileName = `booking_${safeText(formData.BiltyNo || "record")}`;

//   if (buttonType === "SavePDF") {
//     doc.save(`${fileName}.pdf`);
//   } else if (buttonType === "Save&PRINT") {
//     const blob = doc.output("blob");
//     const blobURL = URL.createObjectURL(blob);
//     const iframe = document.createElement("iframe");
//     iframe.style.display = "none";
//     iframe.src = blobURL;
//     document.body.appendChild(iframe);
//     iframe.onload = () => {
//       iframe.contentWindow.focus();
//       iframe.contentWindow.print();
//       URL.revokeObjectURL(blobURL);
//     };
//   } else if (buttonType === "SendToWhatsapp") {
//     const blob = doc.output("blob");
//     const file = new File([blob], `${fileName}.pdf`, {
//       type: "application/pdf",
//     });
//     // console.log(file);

//     return file;
//   }
// };


// export const handlePdfSave = (
//   formData,
//   buttonType,
//   status,
//   setwhatsappLoading
// ) => {
//   // Determine page size based on button type
//   const isA5 = buttonType === "Save&PRINT";
//   const orientation = "portrait";
  
//   // Create jsPDF with appropriate page size
//   const doc = new jsPDF({
//     orientation: orientation,
//     unit: "mm",
//     format: isA5 ? "a5" : "a4"
//   });

//   const safeText = (val) => String(val ?? "");
//   const shipmentStatus = status || "Ship?ment in Godown";

//   const formatDate = (dateStr) => {
//     const [y, m, d] = (dateStr || "").split("-");
//     return d && m && y ? `${d}/${m}/${y}` : "";
//   };

//   // Get page dimensions
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();

//   // ==== HEADER ====
  
//   const companyLines = doc.splitTextToSize("Pak Chinar Int'I Cargo", 90);

//   doc.setFontSize(15);
//   doc.setFont("helvetica", "normal");
//   const addressLines = doc.splitTextToSize(
//     "Dammam Al-Khaleej, Street 22, Double Road Opposite Boys School Near Al-Ahli Bank ATM",
//     80
//   );
//   const companyNumber = doc.splitTextToSize("+966591080611 | +966590878234 | +966590056199",
//     90
//   );

//   const companyY = 15;
//   const addressY = companyY + companyLines.length * 8;
//   const numberY = addressY + companyY + companyLines.length * 6;
//   const footerY = addressY + addressLines.length * 6;
//   const rightColumnBottom = footerY + 18;

//   const invoiceInfoY = 28;
//   const leftColumnBottom = footerY + 18;

//   const headerHeight = Math.max(50,  leftColumnBottom);

//   doc.setFillColor(33, 91, 168);
//   doc.rect(0, 0, pageWidth, headerHeight, "F");

//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(22);
//   doc.setFont("helvetica", "bold");

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(15);
//   doc.text(
//     `Booking Date: ${formatDate(formData.BookingDate)}`,
//     isA5 ? 75 : 120,
//     companyY + 0
//   );
//   doc.text(`From: ${formData.SenderArea}`, isA5 ? 75 : 147, companyY + 6);
//   doc.text(`TO: ${formData.ReceiverArea}`, isA5 ? 75 : 147, companyY + 12);
//   doc.text(`Bilty Number: ${formData.BiltyNo}`, isA5 ? 75 : 120, companyY + 18);

//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(20);
//   doc.setFont("helvetica", "bold");
//   companyLines.forEach((line, i) => doc.text(line, 10, companyY + i * 6));
//   doc.setFontSize(12);
//   addressLines.forEach((line, i) => doc.text(line, 10, addressY + i * 6));
//   companyNumber.forEach((line, i) => doc.text(line, 10, numberY + i * 6));

//   // ==== BODY START ====
//   const bodyStartY = headerHeight + 10;

//   // Sender and Receiver
//   doc.setTextColor(0, 0, 0);
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "bold");
//   doc.text("Consigner Name and Address:", 15, bodyStartY);
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "normal");
//   const senderLines = [
//     `Name:       ${safeText(formData.SenderName)}`,
//     `Mobile:      ${safeText(formData.SenderMobile)}`,
//   ];

//   let currentY = bodyStartY + 7;

//   senderLines.forEach((line) => {
//     const wrappedText = doc.splitTextToSize(line, isA5 ? 60 : 80);

//     if (line.startsWith("Address:")) {
//       doc.text(wrappedText[0], 15, currentY);
//       currentY += 5;
//       for (let i = 1; i < wrappedText.length; i++) {
//         doc.text(wrappedText[i], 37, currentY);
//         currentY += 5;
//       }
//     } else {
//       doc.text(wrappedText, 15, currentY);
//       currentY += wrappedText.length * 6;
//     }
//   });
  
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "bold");
//   doc.text("Consignee Name & Address:", isA5 ? 75 : 120, bodyStartY);
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "normal");
//   const receiverLines = [
//     `Name:         ${safeText(formData.ReceiverName)}`,
//     `Mobile 1:    ${safeText(formData.ReceiverMobile1)}`,
//     `Mobile 2:    ${safeText(formData.ReceiverMobile2)}`,
//     `Address:     ${safeText(formData.ReceiverAddress)}`,
//     `City:            ${safeText(formData.ReceiverArea)}`,
//   ];
//   let currentRY = bodyStartY + 7;

//   receiverLines.forEach((line) => {
//     const wrappedText = doc.splitTextToSize(line, isA5 ? 60 : 80);

//     if (line.startsWith("Address:")) {
//       doc.text(wrappedText[0], isA5 ? 75 : 120, currentRY);
//       currentRY += 5;
//       for (let i = 1; i < wrappedText.length; i++) {
//         doc.text(wrappedText[i], isA5 ? 98 : 143, currentRY);
//         currentRY += 5;
//       }
//     } else {
//       doc.text(wrappedText, isA5 ? 75 : 120, currentRY);
//       currentRY += wrappedText.length * 6;
//     }
//   });

//   const detailStartY =
//     bodyStartY + Math.max(senderLines.length, receiverLines.length) * 5 + 20;

//   // --- Column Positions ---
//   const col1X = 20;
//   const col2X = isA5 ? 50 : 65;
//   const col3X = isA5 ? 100 : 130;
//   const maxWidth = isA5 ? 40 : 55;
//   const lineHeight = 4;
//   let y = detailStartY;

//   // === TABLE HEADER ===
//   const headerHeight1 = 7;
//   doc.setFillColor(255, 255, 255);
//   doc.rect(15, y - 5, pageWidth - 30, headerHeight1, "F");
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "bold");

//   y += 6;

//   // === TABLE BODY ===
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(12);
//   const itemLines = doc.splitTextToSize(
//     safeText(formData.ItemDetails),
//     maxWidth
//   );
//   const otherLines = doc.splitTextToSize(
//     safeText(formData.OtherDetails),
//     maxWidth
//   );
//   doc.text(otherLines, col3X, y+2);

//   // Adjust positioning for A5 vs A4
//   const invoiceX1 = isA5 ? 10 : 12;
//   const invoiceX2 = isA5 ? 60 : 80;
//   const invoiceX3 = isA5 ? 100 : 140;
  
//   doc.text(`Invoice Number: ${formData.InvoiceNo}`, invoiceX1,  isA5 ? 90 : 120);
//   doc.text(`Total weight: ${formData.totalWeight} KG`, invoiceX2,  isA5 ? 90 : 120);
//   doc.text(`Total Charges: SAR ${formData.InvoiceTotal}`, invoiceX3,  isA5 ? 90 : 120);

//   doc.text(`Sender Id: ${formData.SenderIdNumber}`, invoiceX1,  isA5 ? 98 : 128);
//   doc.text(`Total Pieces: ${formData.NoOfPieces}`, invoiceX2,  isA5 ? 98 : 128);
//   doc.text(`Payment: Paid`, invoiceX3,  isA5 ? 98 : 128);

//   const rowHeight =
//     Math.max(itemLines.length, otherLines.length) * lineHeight + 8;
//   const tableStartY = y + rowHeight;

//   // ========== CHARGES TABLE ==========
//   autoTable(doc, {
//     head: [["No.", "Description", "QUANTITY", ]],
//     body: Object.entries(formData.Charges || {}).map(([key, value], index) => {
//       const charge = value as { unitRate: string; qty: number; total: string };
//       return [
//         index + 1,
//         safeText(key),
//         `${safeText(charge.unitRate)}`,
//         charge.qty > 0 ? `${charge.qty}` : "",
//         charge.qty > 0 ? `${safeText(charge.total)}` : "",
//       ];
//     }),
//     startY: tableStartY,
//     margin: { top: 2, bottom: 2, left: 10, right: 10 },
//     styles: {
//       cellPadding: 1.2,
//       fontSize: 12,
//     },
//     theme: "grid",
//     tableWidth: "auto",
//     columnStyles: {
//       0: { halign: "center", cellWidth: isA5 ? 10 : 15 },
//       1: { halign: "left", cellWidth: isA5 ? 90 : 130 },
//       2: { halign: "center", cellWidth: isA5 ? 25 : 35 },
//     },
//     headStyles: {
//       halign: "center",
//     },
//   });

//   const finalY = doc.lastAutoTable?.finalY+5 || tableStartY;

//   const notesBoxX = 0;
//   const notesBoxWidth = isA5 ? 100 : 120;
//   const notesY = finalY;
//   const boxHeight = 20;

//   doc.setFillColor(255, 255, 255);
//   doc.rect(notesBoxX, notesY, notesBoxWidth, boxHeight+50, "F");

//   doc.setTextColor(0, 0, 0);
//   doc.setFontSize(12);

//   const notesTitle = "Amount In Words:";
//   const thankYouMsg = formData.AmountInWords;
//   const wrappedText = doc.splitTextToSize(thankYouMsg, notesBoxWidth - 20);
//   const textHeight = wrappedText.length * lineHeight;
//   const verticalStart = notesY + (boxHeight - textHeight - lineHeight);

//   doc.setFont(undefined, "bold");
//   doc.text(notesTitle, notesBoxX + 10, verticalStart);

//   doc.setFont(undefined, "normal");
//   wrappedText.forEach((line, i) => {
//     doc.text(line, notesBoxX + 10, verticalStart + lineHeight * (i +1.5));
//   });

//   // Footer
//   const footerReservedHeight = 25;
//   let footerStartY = pageHeight - footerReservedHeight;

//   doc.setFillColor(33, 91, 168);
//   doc.rect(0, footerStartY - 15, pageWidth, 50, "F");

//   function drawFooterBlock(title, address, phone, startX, startY) {
//     doc.setFontSize(12);
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor("white");
//     doc.text(title, startX, startY);
//     let currentY = startY + 5;

//     doc.setFont("helvetica", "normal");
//     const addressLabel = "Address:";
//     const addressText = safeText(address);
//     const addressLabelWidth = doc.getTextWidth(addressLabel + " ");
//     const addressLineWidth = pageWidth - startX - addressLabelWidth - 5;

//     const addressLines = doc.splitTextToSize(addressText, addressLineWidth);

//     if (addressLines.length > 0) {
//       doc.text(addressLines[0], startX + addressLabelWidth, currentY);
//       currentY += 5;
//       for (let i = 1; i < addressLines.length; i++) {
//         doc.text(addressLines[i], startX + addressLabelWidth, currentY);
//         currentY += 5;
//       }
//     }

//     const phoneLabel = "Phone:";
//     const phoneText = safeText(phone);
//     const phoneLabelWidth = doc.getTextWidth(phoneLabel + " ");
//     const phoneLineWidth = pageWidth - startX - phoneLabelWidth - 5;
//     const phoneLines = doc.splitTextToSize(phoneText, phoneLineWidth);

//     if (phoneLines.length > 0) {
//       doc.text(phoneLines[0], startX + phoneLabelWidth, currentY);
//       currentY += 5;
//       for (let i = 1; i < phoneLines.length; i++) {
//         doc.text(phoneLines[i], startX + phoneLabelWidth, currentY);
//         currentY += 5;
//       }
//     }
//     return currentY + 3;
//   }

//   let footerYY = footerStartY;
//   footerYY = drawFooterBlock(
//     "Dammam Head Office:",
//     "Dammam Al-Khaleej, Street 22, Double Road Opposite Boys School Near Al-Ahli Bank ATM",
//     "+966591080611 | +966590878234 | +966590056199",
//     10,
//     footerYY -5
//   );

//   const fileName = `booking_${safeText(formData.BiltyNo || "record")}`;

//   if (buttonType === "SavePDF") {
//     // A4 PDF save
//     doc.save(`${fileName}.pdf`);
//   } else if (buttonType === "Save&PRINT") {
//     // A5 for printing
//     const blob = doc.output("blob");
//     const blobURL = URL.createObjectURL(blob);
//     const iframe = document.createElement("iframe");
//     iframe.style.display = "none";
//     iframe.src = blobURL;
//     document.body.appendChild(iframe);
//     iframe.onload = () => {
//       iframe.contentWindow.focus();
//       iframe.contentWindow.print();
//       URL.revokeObjectURL(blobURL);
//     };
//   } else if (buttonType === "SendToWhatsapp") {
//     const blob = doc.output("blob");
//     const file = new File([blob], `${fileName}.pdf`, {
//       type: "application/pdf",
//     });
//     return file;
//   }
// };




// export const handlePdfSave = (
//   formData,
//   buttonType,
//   status,
//   // setwhatsappLoading // unused in this flow; pass null/undefined
// ) => {
//   // ✅ A5 for PRINT, A4 for SAVE
//   const isA5 = buttonType === "Save&PRINT";
  
//   const doc = new jsPDF({
//     orientation: "portrait",
//     unit: "mm",
//     format: isA5 ? "a5" : "a4"
//   });

//   const safeText = (val) => String(val ?? "");
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();

//   const formatDate = (dateStr) => {
//     const [y, m, d] = (dateStr || "").split("-");
//     return d && m && y ? `${d}/${m}/${y}` : "";
//   };

//   // === HEADER ===
//   doc.setFillColor(33, 91, 168);
//   doc.rect(0, 0, pageWidth, 40, "F");

//   doc.setTextColor(255, 255, 255);
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(isA5 ? 16 : 20);
//   const companyLines = doc.splitTextToSize("Pak Chinar Int'I Cargo", pageWidth - 20);
//   companyLines.forEach((line, i) => {
//     doc.text(line, 10, 12 + i * 6);
//   });

//   doc.setFontSize(isA5 ? 10 : 12);
//   doc.setFont("helvetica", "normal");
//   const addressLines = doc.splitTextToSize(
//     "Dammam Al-Khaleej, Street 22, Double Road Opposite Boys School Near Al-Ahli Bank ATM",
//     pageWidth - 20
//   );
//   addressLines.forEach((line, i) => {
//     doc.text(line, 10, 22 + i * 5);
//   });

//   const companyNumber = "+966591080611 | +966590878234 | +966590056199";
//   doc.text(companyNumber, 10, 22 + addressLines.length * 5 + 2);

//   // Right-side booking info
//   doc.setFontSize(isA5 ? 10 : 12);
//   const rightStartX = isA5 ? 75 : 120;
//   doc.text(`Booking Date: ${formatDate(formData.BookingDate)}`, rightStartX, 12);
//   doc.text(`Bilty #: ${formData.BiltyNo}`, rightStartX, 16);
//   doc.text(`From: ${formData.SenderArea}`, rightStartX, 20);
//   doc.text(`To: ${formData.ReceiverArea}`, rightStartX, 24);

//   // === BODY ===
//   const bodyStartY = 45;

//   // ✅ For A5: Stack sender & receiver (no side-by-side)
//   doc.setTextColor(0, 0, 0);
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(12);
//   doc.text("Consigner:", 10, bodyStartY);

//   doc.setFont("helvetica", "normal");
//   const senderLines = [
//     `Name: ${safeText(formData.SenderName)}`,
//     `Mobile: ${safeText(formData.SenderMobile)}`,
//     // `ID: ${safeText(formData.SenderIdNumber)}`
//   ];

//   let currentY = bodyStartY + 6;
//   senderLines.forEach((line) => {
//     const wrapped = doc.splitTextToSize(line, pageWidth - 20);
//     wrapped.forEach((l) => {
//       doc.text(l, 15, currentY);
//       currentY += 5;
//     });
//   });

//   // Consignee below sender (A5-friendly)
//   currentY += 3;
//   doc.setFont("helvetica", "bold");
//   doc.text("Consignee:", 10, currentY);
//   currentY += 6;

//   doc.setFont("helvetica", "normal");
//   const receiverLines = [
//     `Name: ${safeText(formData.ReceiverName)}`,
//     `Mobile 1: ${safeText(formData.ReceiverMobile1)}`,
//     `Mobile 2: ${safeText(formData.ReceiverMobile2)}`,
//     `City: ${safeText(formData.ReceiverArea)}`
//   ];

//   receiverLines.forEach((line) => {
//     const wrapped = doc.splitTextToSize(line, pageWidth - 20);
//     wrapped.forEach((l) => {
//       doc.text(l, 15, currentY);
//       currentY += 5;
//     });
//   });

//   // === DETAILS SECTION ===
//   currentY += 6;
//   doc.setFont("helvetica", "bold");
//   doc.text("Shipment Details:", 10, currentY);
//   currentY += 6;

//   doc.setFont("helvetica", "normal");
//   const details = [
//     `Item: ${safeText(formData.ItemDetails)}`,
//     `Other: ${safeText(formData.OtherDetails)}`,
//     `Pieces: ${safeText(formData.NoOfPieces)}`,
//     `Weight: ${safeText(formData.totalWeight)} KG`,
//     `Invoice #: ${safeText(formData.InvoiceNo)}`,
//     `Total: SAR ${safeText(formData.InvoiceTotal)}`,
//     `Payment: Paid`
//   ];

//   details.forEach((line) => {
//     const wrapped = doc.splitTextToSize(line, pageWidth - 20);
//     wrapped.forEach((l) => {
//       doc.text(l, 15, currentY);
//       currentY += 5;
//     });
//   });

//   // === CHARGES TABLE (A5-optimized) ===
//   currentY += 6;
//   try {
//     autoTable(doc, {
//       head: [["#", "Description", "Qty", "Rate", "Total"]],
//       body: Object.entries(formData.Charges || {}).map(([key, value], index) => {
//         const charge = value || {};
//         return [
//           index + 1,
//           safeText(key.length > 25 ? key.substring(0, 22) + "..." : key),
//           `${charge.qty || ""}`,
//           `${charge.unitRate || ""}`,
//           `${charge.total || ""}`
//         ];
//       }),
//       startY: currentY,
//       margin: { left: 8, right: 8 },
//       styles: { fontSize: isA5 ? 8 : 10, cellPadding: isA5 ? 1 : 1.5 },
//       headStyles: { fillColor: [33, 91, 168], fontSize: isA5 ? 9 : 11 },
//       columnStyles: {
//         0: { cellWidth: 8, halign: 'center' },
//         1: { cellWidth: isA5 ? 50 : 85 },
//         2: { cellWidth: 12, halign: 'center' },
//         3: { cellWidth: 18, halign: 'center' },
//         4: { cellWidth: 18, halign: 'center' }
//       },
//       theme: 'grid',
//       tableWidth: 'auto'
//     });
//   } catch (e) {
//     console.warn("AutoTable failed, falling back to manual table");
//   }

//   const finalY = doc.lastAutoTable?.finalY || currentY + 30;

//   // === AMOUNT IN WORDS ===
//   const amountBoxHeight = 25;
//   const amountY = finalY + 8;
  
//   doc.setFillColor(240, 240, 240);
//   doc.rect(8, amountY, pageWidth - 16, amountBoxHeight, "F");
  
//   doc.setFont("helvetica", "bold");
//   doc.setTextColor(0, 0, 0);
//   doc.setFontSize(10);
//   doc.text("Amount in Words:", 12, amountY + 6);
  
//   doc.setFont("helvetica", "normal");
//   const amountLines = doc.splitTextToSize(
//     safeText(formData.AmountInWords),
//     pageWidth - 24
//   );
//   amountLines.forEach((line, i) => {
//     doc.text(line, 12, amountY + 12 + i * 5);
//   });

//   // === FOOTER ===
//   const footerY = pageHeight - 20;
//   doc.setFillColor(33, 91, 168);
//   doc.rect(0, footerY, pageWidth, 20, "F");

//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(isA5 ? 7 : 9);
//   doc.setFont("helvetica", "bold");
//   doc.text("Dammam Head Office", 10, footerY + 6);
//   doc.setFont("helvetica", "normal");
//   doc.text("Near Al-Ahli Bank ATM, Al-Khaleej St. 22", 10, footerY + 12);
//   doc.text("+966 591080611 | +966 590878234", 10, footerY + 17);

//   // === OUTPUT ===
//   const fileName = `booking_${safeText(formData.BiltyNo || "record")}.pdf`;

//   if (buttonType === "SavePDF") {
//     doc.save(fileName);
//   } else if (buttonType === "Save&PRINT") {
//     // Open in new window for clean print (A5-friendly)
//     const blob = doc.output("blob");
//     const url = URL.createObjectURL(blob);
//     const win = window.open("", "_blank");
//     win.document.write(`
//       <html>
//         <head><title>${fileName}</title></head>
//         <body style="margin:0; overflow:hidden">
//           <iframe src="${url}" width="100%" height="100%" style="border:none;"></iframe>
//         </body>
//       </html>
//     `);
//     win.document.close();
//   } else if (buttonType === "SendToWhatsapp") {
//     const blob = doc.output("blob");
//     return new File([blob], fileName, { type: "application/pdf" });
//   }
// };










export const handlePdfSave = (
  formData,
  buttonType,
  status,
  // setwhatsappLoading // unused
) => {
  const isA5 = buttonType === "Save&PRINT";
  
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: isA5 ? "a5" : "a4"
  });

  const safeText = (val) => String(val ?? "");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const formatDate = (dateStr) => {
    const [y, m, d] = (dateStr || "").split("-");
    return d && m && y ? `${d}/${m}/${y}` : "";
  };

  // =============================
  // ✅ HEADER — A4 KE LIYE ORIGINAL, A5 KE LIYE COMPACT
  // =============================
  const headerHeight = isA5 ? 55 : 60;
  doc.setFillColor(33, 91, 168);
  doc.rect(0, 0, pageWidth, headerHeight, "F");

  doc.setTextColor(255, 255, 255);

  // --- Company Name (Top Left) ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(isA5 ? 18 : 20);
  const companyLines = doc.splitTextToSize("Pak Chinar Int'I Cargo", isA5 ? 65 : 90);
  companyLines.forEach((line, i) => {
    doc.text(line, 10, 12 + i * 7);
  });

  // --- Address & Phone (Below Company) ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(isA5 ? 8.5 : 12);
  
  if (isA5) {
    // 📄 A5: Compact 2-line address + 1-line phone
    const addr1 = "Dammam Al-Khaleej, St. 22";
    const addr2 = "Opp. Boys School, Near Al-Ahli Bank ATM";
    doc.text(addr1, 10, 24);
    doc.text(addr2, 10, 29);
    doc.setFontSize(8);
    doc.text("+966 591080611 | 590878234 | 590056199", 10, 35);
  } else {
    // 📄 A4: Full original layout
    const addressLines = doc.splitTextToSize(
      "Dammam Al-Khaleej, Street 22, Double Road Opposite Boys School Near Al-Ahli Bank ATM",
      80
    );
    addressLines.forEach((line, i) => {
      doc.text(line, 10, 24 + i * 5);
    });
    const companyNumber = doc.splitTextToSize(
      "+966591080611 | +966590878234 | +966590056199",
      90
    );
    companyNumber.forEach((line, i) => {
      doc.text(line, 10, 24 + addressLines.length * 5 + 2 + i * 5);
    });
  }

  // --- Booking Info (Top Right) ---
  doc.setFontSize(isA5 ? 8.5 : 12);
  doc.setFont("helvetica", "normal");
  
  const startX = isA5 ? (pageWidth - 65) : 120;
  const startY = isA5 ? 12 : 12;

  // A5: Single column compact info
  if (isA5) {
    doc.text(`Bilty: ${formData.BiltyNo}`, startX, startY);
    doc.text(`Date: ${formatDate(formData.BookingDate)}`, startX, startY + 5);
    doc.text(`From: ${formData.SenderArea}`, startX, startY + 10);
    doc.text(`To: ${formData.ReceiverArea}`, startX, startY + 15);
  } else {
    // A4: Original clean layout
    doc.text(`Booking Date: ${formatDate(formData.BookingDate)}`, 120, 12);
    doc.text(`Bilty Number: ${formData.BiltyNo}`, 120, 18);
    doc.text(`From: ${formData.SenderArea}`, 147, 24);
    doc.text(`TO: ${formData.ReceiverArea}`, 147, 30);
  }

  // =============================
  // ✅ BODY — Original + A5-safe
  // =============================
  const bodyStartY = headerHeight + 8;

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Consigner Name and Address:", 10, bodyStartY);
  
  doc.setFont("helvetica", "normal");
  const senderLines = [
    `Name: ${safeText(formData.SenderName)}`,
    `Mobile: ${safeText(formData.SenderMobile)}`,
    // `ID: ${safeText(formData.SenderIdNumber)}`
  ];

  let currentY = bodyStartY + 6;
  senderLines.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, isA5 ? 60 : 80);
    wrapped.forEach((l) => {
      doc.text(l, 10, currentY);
      currentY += 5;
    });
  });

  // Consignee (A5: below sender | A4: right column)
  currentY += 4;
  if (isA5) {
    doc.setFont("helvetica", "bold");
    doc.text("Consignee Name & Address:", 10, currentY);
    currentY += 6;
    doc.setFont("helvetica", "normal");
    const rcvrLines = [
      `Name: ${safeText(formData.ReceiverName)}`,
      `Mobile: ${safeText(formData.ReceiverMobile1)}${formData.ReceiverMobile2 ? ` / ${formData.ReceiverMobile2}` : ''}`,
      `City: ${safeText(formData.ReceiverArea)}`
    ];
    rcvrLines.forEach((line) => {
      const wrapped = doc.splitTextToSize(line, 60);
      wrapped.forEach((l) => {
        doc.text(l, 10, currentY);
        currentY += 5;
      });
    });
  } else {
    // A4: Original side-by-side
    doc.setFont("helvetica", "bold");
    doc.text("Consignee Name & Address:", 120, bodyStartY);
    let currentRY = bodyStartY + 6;
    doc.setFont("helvetica", "normal");
    const receiverLines = [
      `Name: ${safeText(formData.ReceiverName)}`,
      `Mobile 1: ${safeText(formData.ReceiverMobile1)}`,
      `Mobile 2: ${safeText(formData.ReceiverMobile2)}`,
      `City: ${safeText(formData.ReceiverArea)}`
    ];
    receiverLines.forEach((line) => {
      const wrapped = doc.splitTextToSize(line, 80);
      wrapped.forEach((l, idx) => {
        doc.text(l, 120, currentRY + idx * 5);
      });
      currentRY += wrapped.length * 5 + 1;
    });
  }

  // =============================
  // ✅ Details & Charges — Responsive
  // =============================
  const detailStartY = isA5 ? currentY + 8 : bodyStartY + 35;
  
  // Summary line (Invoice, Weight, Total)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  const summaryY = isA5 ? detailStartY : 120;
  doc.text(`Invoice #: ${formData.InvoiceNo}`, 12, summaryY);
  doc.text(`Weight: ${formData.totalWeight} KG`, isA5 ? 60 : 120, summaryY);
  // doc.text(`Total: SAR ${formData.InvoiceTotal}`, isA5 ? 110 : 140, summaryY);
  
  if (!isA5) {
    doc.text(`Sender ID: ${formData.SenderIdNumber}`, 12, summaryY + 6);
    doc.text(`Pieces: ${formData.NoOfPieces}`,  isA5 ? 60 : 120, summaryY+6);
    // doc.text(`Payment: Paid`, 140, summaryY + 6);
  }

  // Charges Table
  const tableStartY = isA5 ? summaryY + 12 : 130;
  try {
    autoTable(doc, {
      head: isA5 
        ? [["#", "Desc", "Qty"]] 
        : [["No.", "Description", "QUANTITY"]],
      body: Object.entries(formData.Charges || {}).map(([key, value], index) => {
        const charge = value || {};
        return isA5
          ? [
              index + 1,
              key.length > 20 ? key.substring(0, 17) + "..." : key,
              `${charge.qty || ''}`
            ]
          : [
              index + 1,
              safeText(key),
              `${safeText(charge.unitRate)}`,
              charge.qty > 0 ? `${charge.qty}` : "",
              charge.qty > 0 ? `${safeText(charge.total)}` : ""
            ];
      }),
      startY: tableStartY,
      margin: { left: 8, right: 8 },
      styles: { 
        fontSize: isA5 ? 8 : 10,
        cellPadding: isA5 ? 0.8 : 1.2 
      },
      headStyles: { 
        fillColor: [33, 91, 168],
        fontSize: isA5 ? 9 : 11 
      },
      columnStyles: isA5
        ? {
            0: { cellWidth: 8, halign: 'center' },
            1: { cellWidth: 70 },
            2: { cellWidth: 18, halign: 'center' }
          }
        : {
            0: { halign: "center", cellWidth: 15 },
            1: { halign: "left", cellWidth: 130 },
            2: { halign: "center", cellWidth: 35 }
          },
      theme: "grid"
    });
  } catch (e) {
    console.warn("AutoTable failed", e);
  }

  // Amount in Words (A5: compact | A4: original)
  const finalY = doc.lastAutoTable?.finalY || tableStartY + 20;
  const notesY = finalY + 8;
  const boxWidth = isA5 ? pageWidth - 16 : 120;
  
  doc.setFillColor(255, 255, 255);
  doc.rect(8, notesY, boxWidth, isA5 ? 25 : 30, "F");
  
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(isA5 ? 10 : 12);
  doc.text("Amount In Words:", 12, notesY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(isA5 ? 9 : 11);
  const wrapped = doc.splitTextToSize(
    safeText(formData.AmountInWords),
    boxWidth - 16
  );
  wrapped.forEach((line, i) => {
    doc.text(line, 12, notesY + 12 + i * 5);
  });
  // doc.text(`Total: SAR ${formData.InvoiceTotal}`, isA5 ? 25 : 12, notesY + 24);
// Total: SAR — right-aligned inside the box for both A4 & A5
const totalText = `Total: SAR ${formData.InvoiceTotal}`;
const totalY = notesY + 18;
const totalX = 12;
doc.setFont("helvetica", "bold");
doc.setFontSize(isA5 ? 9 : 11);
doc.text(totalText, totalX, totalY);



  // Footer (A5: simple | A4: full)
  const footerY = pageHeight - (isA5 ? 18 : 25);
  doc.setFillColor(33, 91, 168);
  doc.rect(0, footerY, pageWidth, isA5 ? 18 : 25, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(isA5 ? 7 : 9);
  doc.setFont("helvetica", "bold");
  doc.text("Dammam Head Office", 10, footerY + (isA5 ? 6 : 7));
  
  // if (!isA5) {
    doc.setFont("helvetica", "normal");
    doc.text("Dammam Al-Khaleej, Street 22, Double Road...", 10, footerY + 11);
    doc.text("+966591080611 | +966590878234 | +966590056199", 10, footerY + 15);
  // }

  // =============================
  // ✅ OUTPUT
  // =============================
  const fileName = `booking_${safeText(formData.BiltyNo || "record")}.pdf`;

  if (buttonType === "SavePDF") {
    doc.save(fileName);
  } else if (buttonType === "Save&PRINT") {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const win = window.open();
    win.document.write(`
      <html>
        <head><title>${fileName}</title></head>
        <body style="margin:0">
          <iframe src="${url}" width="100%" height="100%" style="border:0"></iframe>
        </body>
      </html>
    `);
    win.document.close();
  } else if (buttonType === "SendToWhatsapp") {
    const blob = doc.output("blob");
    return new File([blob], fileName, { type: "application/pdf" });
  }
};