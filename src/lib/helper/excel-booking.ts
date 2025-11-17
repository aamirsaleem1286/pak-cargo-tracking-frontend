// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// export const exportToExcel = (bookings, fileName = "Bookings.xlsx") => {
//   // ✅ clean + flatten
//   const cleanedData = bookings.map((b) => {
//     const { _id, __v, createdAt, updatedAt, RemainingPieces, Charges, ...rest } = b;

//     const flatCharges = {};
//     for (let chargeName in Charges) {
//       const charge = Charges[chargeName];
//       flatCharges[`${chargeName} Enabled`] = charge.enabled ? "Yes" : "No";
//       flatCharges[`${chargeName} Unit Rate`] = charge.unitRate;
//       flatCharges[`${chargeName} Qty`] = charge.qty;
//       flatCharges[`${chargeName} Total`] = charge.total;
//     }

//     return {
//       ...rest,
//       ...flatCharges, // ✅ sab charges expand kar diye
//     };
//   });

//   // ✅ heading keys ko readable banao (camelCase → "Camel Case")
//   const beautifyKey = (key) =>
//     key
//       .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase → camel Case
//       .replace(/_/g, " ") // underscores → spaces
//       .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letters

//   const headers = Object.keys(cleanedData[0]).map(beautifyKey);

//   // ✅ worksheet banao with readable headers
//   const ws = XLSX.utils.json_to_sheet(cleanedData, { header: Object.keys(cleanedData[0]) });

//   // ✅ pehle row me beautified headers lagao
//   XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });

//   // ✅ column width auto adjust
//   const colWidths = headers.map((h, i) => ({
//     wch: Math.max(
//       h.length,
//       ...cleanedData.map((row) => (row[Object.keys(cleanedData[0])[i]] ? row[Object.keys(cleanedData[0])[i]].toString().length : 10))
//     ),
//   }));
//   ws["!cols"] = colWidths;

//   // ✅ workbook
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Bookings");

//   // ✅ save file
//   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//   const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
//   saveAs(fileData, fileName);
// };


import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

export const exportToExcel = (bookings, fileName = "Bookings.xlsx") => {
  // ✅ clean + flatten
  const cleanedData = bookings.map((b) => {
    const { _id, __v, createdAt, updatedAt, RemainingPieces, Charges, ...rest } = b;

    const flatCharges = {};
    for (let chargeName in Charges) {
      const charge = Charges[chargeName];
      flatCharges[`${chargeName} Enabled`] = charge.enabled ? "Yes" : "No";
      flatCharges[`${chargeName} Unit Rate`] = charge.unitRate;
      flatCharges[`${chargeName} Qty`] = charge.qty;
      flatCharges[`${chargeName} Total`] = charge.total;
    }

    return {
      ...rest,
      ...flatCharges,
    };
  });

  // ✅ Beautify headings
  const beautifyKey = (key) =>
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const keys = Object.keys(cleanedData[0]);
  const headers = keys.map(beautifyKey);

  // ✅ data rows
  const data = cleanedData.map((row) => keys.map((k) => row[k]));

  // ✅ final worksheet data (headers + rows)
  // const worksheetData = [headers, ...data];

  // // ✅ apply styles (center align + bold headers)
  // const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // loop for styles
  // worksheetData.forEach((row, rowIndex) => {
  //   row.forEach((cell, colIndex) => {
  //     const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });

  //     ws[cellRef].s = {
  //       alignment: { horizontal: "center", vertical: "center", wrapText: true },
  //       font: rowIndex === 0 ? { bold: true } : {}, // header bold
  //     };
  //   });
  // });
  
// ✅ final worksheet data (headers + rows)
const worksheetData = [
  headers,
  ...data.map((row) => row.map((cell) => (cell ?? ""))),
];

// ✅ apply styles (center align + bold headers)
const ws = XLSX.utils.aoa_to_sheet(worksheetData);

// loop for styles
worksheetData.forEach((row, rowIndex) => {
  row.forEach((cell, colIndex) => {
    const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });

    if (!ws[cellRef]) {
      ws[cellRef] = { t: "s", v: "" }; // avoid undefined cell error
    }

    ws[cellRef].s = {
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      font: rowIndex === 0 ? { bold: true } : {},
    };
  });
});

  // ✅ auto column width
  ws["!cols"] = headers.map((h, i) => ({
    wch: Math.max(
      h.length,
      ...data.map((row) => (row[i] ? row[i].toString().length : 10))
    ),
  }));

  // ✅ workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Bookings");

  // ✅ save
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(fileData, fileName);
};
