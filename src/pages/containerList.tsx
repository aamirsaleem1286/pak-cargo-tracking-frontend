import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import { AppRoutes } from '../constants/AppRoutes';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const ContainerList = () => {
  const [deletingId, setDeletingId] = useState(null);
  const [containerList, setContainerList] = useState([]);
  const [containerLoading, setContainerLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // 🔁 Fetch container list
  useEffect(() => {
    const getContainerList = async () => {
      try {
        setContainerLoading(true);
        const response = await axios.get(AppRoutes.allContainersList);
        setContainerList(response?.data?.data?.containersList || []);
      } catch (error) {
        console.error('❌ Failed to fetch containers:', error);
        toast.error('Failed to load container data.');
      } finally {
        setContainerLoading(false);
      }
    };
    getContainerList();
  }, []);

  // 🔑 Group containers by ContainerNumber (case-insensitive)
  const groupedContainers = useMemo(() => {
    const map = new Map();

    containerList.forEach((container) => {
      const key = (container.ContainerNumber || '').toString().trim().toLowerCase();
      if (!key) return;

      if (!map.has(key)) {
        map.set(key, {
          _ids: [],
          ContainerNumber: container.ContainerNumber,
          Destination: container.Destination,
          Status: container.Status,
          Invoices: [], // will store {invoiceNo, qty}
        });
      }

      const group = map.get(key);
      group._ids.push(container._id);

      // Parse invoices: supports ["INV101/5", "INV102/3"] or "INV101/5, INV102/3"
      let rawInvoices = [];
      if (Array.isArray(container.Invoices)) {
        rawInvoices = container.Invoices;
      } else if (typeof container.Invoices === 'string') {
        rawInvoices = container.Invoices.split(',').map((s) => s.trim()).filter(Boolean);
      }

      rawInvoices.forEach((item) => {
        const [invNo, qtyStr] = item.split('/');
        const qty = parseInt(qtyStr, 10) || 0;
        if (invNo) {
          group.Invoices.push({ invoiceNo: invNo.trim(), qty });
        }
      });

      // Prefer more advanced status (Delivered > Shipment in Container > Booked > Pending)
      const statusOrder = {
        delivered: 3,
        'shipment in container': 2,
        booked: 1,
        pending: 0,
      };
      const currentPriority = statusOrder[group.Status?.toLowerCase()] || -1;
      const newPriority = statusOrder[container.Status?.toLowerCase()] || -1;
      if (newPriority > currentPriority) {
        group.Status = container.Status;
      }
    });

    // Convert to array & compute totals
    return Array.from(map.values()).map((group) => {
      const totalShipped = group.Invoices.reduce((sum, inv) => sum + inv.qty, 0);
      const invoiceNumbers = [...new Set(group.Invoices.map((inv) => inv.invoiceNo))].join(', ');
      return {
        ...group,
        totalShipped,
        invoiceNumbers,
        _id: group._ids[0], // representative ID
        __allIds: group._ids,
      };
    });
  }, [containerList]);

  // 🔍 Filter by Container No or Invoice No
  const filteredContainers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return groupedContainers;
    return groupedContainers.filter(
      (c) =>
        c.ContainerNumber?.toLowerCase().includes(q) ||
        c.invoiceNumbers?.toLowerCase().includes(q)
    );
  }, [groupedContainers, searchQuery]);

  // 🖊️ Handlers
  const handleEdit = (id) => {
    navigate(`/update-container/edit/${id}`);
  };

  const handleEditContainer = (id, containerStatus) => {
    if (containerStatus?.toLowerCase() === 'shipment in container') {
      navigate(`/edit-container/edit/${id}`);
    } else {
      toast.error(`This container cannot be edited. Status: ${containerStatus}`);
    }
  };

  const handleDelete = async (id, containerStatus, allIds) => {
    if (
      containerStatus?.toLowerCase() === 'shipment in container' ||
      containerStatus?.toLowerCase() === 'delivered'
    ) {
      if (!window.confirm('Are you sure you want to delete this container?')) return;

      try {
        setDeletingId(id);
        await axios.delete(`${AppRoutes.deleteSingleContainer}/${id}`);
        toast.success('Container deleted successfully.');
        setContainerList((prev) => prev.filter((c) => c._id !== id));
      } catch (error) {
        console.error('Delete error:', error);
        const errMsg = error?.response?.data?.errors?.general || 'Something went wrong';
        toast.error(errMsg);
      } finally {
        setDeletingId(null);
      }
    } else {
      toast.error(`This container cannot be deleted. Status: ${containerStatus}`);
    }
  };

  // 📥 Export ONE container’s invoices (one row per invoice)
  // const handleExportInvoiceExcel = async (containerNumber) => {
  //   if (!containerNumber) {
  //     toast.error('Invalid container number.');
  //     return;
  //   }

  //   try {
  //     // Find all containers with this number (original list)
  //     const matchingContainers = containerList.filter(
  //       (c) =>
  //         c.ContainerNumber &&
  //         c.ContainerNumber.toString().trim().toLowerCase() ===
  //           containerNumber.toString().trim().toLowerCase()
  //     );

  //     if (matchingContainers.length === 0) {
  //       toast.error('No container found with this number.');
  //       return;
  //     }

  //     // Extract all unique invoice numbers
  //     const invoiceSet = new Set();
  //     matchingContainers.forEach((container) => {
  //       let invoices = [];
  //       if (typeof container.Invoices === 'string') {
  //         invoices = container.Invoices.split(',').map((i) => i.trim());
  //       } else if (Array.isArray(container.Invoices)) {
  //         invoices = container.Invoices;
  //       }
  //       invoices.forEach((item) => {
  //         const [invNo] = item.split('/');
  //         if (invNo) invoiceSet.add(invNo.trim());
  //       });
  //     });

  //     const invoiceNumbers = Array.from(invoiceSet);
  //     if (invoiceNumbers.length === 0) {
  //       toast.warn('No invoices found in this container.');
  //       return;
  //     }

  //     // Fetch bookings
  //     const response = await axios.get(AppRoutes.allBookings);
  //     const allBookings = response?.data?.data?.bookings || [];

  //     // Match bookings by invoice number (before `/`)
  //     const matchingBookings = allBookings.filter((b) =>
  //       invoiceNumbers.includes((b.InvoiceNo?.split('/')[0] || '').trim())
  //     );

  //     if (matchingBookings.length === 0) {
  //       toast.warn('No bookings found for the invoices in this container.');
  //       return;
  //     }

  //     // Build Excel rows: one per booking/invoice
  //     const excelData = matchingBookings.map((b) => {
  //       const container = matchingContainers[0]; // use first for common fields
  //       return {
  //         'Company Name':'Pak Chinar Cargo',
  //         'Container No': container.ContainerNumber || '-',
  //         'Bilty No': b.BiltyNo || '-',
  //         'Booking Date': b.BookingDate || '-',
  //         'No Of Pieces': b.NoOfPieces || '-',
  //         'Sender Name': b.SenderName || '-',
  //         'Receiver Name': b.ReceiverName || '-',
  //         'Sender Mobile': b.SenderMobile || '-',
  //        'Receiver Mobile1': b.ReceiverMobile1 || '-',
  //         'Receiver Mobile2': b.ReceiverMobile2 || '-',
  //         'Receiver Address': b.ReceiverAddress || '-',
  //         'Receiver Area': b.ReceiverArea || '-',
  //         // Status: b.status || '-',
  //         // From: container.Destination?.From || '-',
  //         // To: container.Destination?.To || '-',
  //         // // 'Sender Id Number': b.SenderIdNumber || '-',
  //         // 'Sender Address': b.SenderAddress || '-',
  //         // 'Sender Area': b.SenderArea || '-',
       
         
  //         // 'Item Details': b.ItemDetails || '-',
  //         // 'Other Details': b.OtherDetails || '-',
  //         // Branch: b.Branch || '-',
  //         // 'Sub Total': b.SubTotal || '-',
  //         // Vat: b.Vat || '-',
  //         // 'Vat Total': b.VatTotal || '-',
  //         // 'Invoice Total': b.InvoiceTotal || '-',
  //         // 'Amount In Words': b.AmountInWords || '-',
  //         // 'Invoice No': b.InvoiceNo || '-',
  //         // City: b.City || '-',
  //         // 'Tracking Details': JSON.stringify(b.tracking_details || []),
  //         // 'Tracking History': JSON.stringify(b.tracking_history || []),

  //         // Charges
  //         // 'Freight Charges Enabled': b.Charges?.FreightCharges?.enabled ?? '-',
  //         // 'Freight Charges Unit Rate': b.Charges?.FreightCharges?.unitRate ?? '-',
  //         // 'Freight Charges Qty': b.Charges?.FreightCharges?.qty ?? '-',
  //         // 'Freight Charges Total': b.Charges?.FreightCharges?.total ?? '-',
  //         // 'Insurance Enabled': b.Charges?.Insurance?.enabled ?? '-',
  //         // 'Insurance Unit Rate': b.Charges?.Insurance?.unitRate ?? '-',
  //         // 'Insurance Qty': b.Charges?.Insurance?.qty ?? '-',
  //         // 'Insurance Total': b.Charges?.Insurance?.total ?? '-',
  //         // 'Packing Enabled': b.Charges?.Packing?.enabled ?? '-',
  //         // 'Packing Unit Rate': b.Charges?.Packing?.unitRate ?? '-',
  //         // 'Packing Qty': b.Charges?.Packing?.qty ?? '-',
  //         // 'Packing Total': b.Charges?.Packing?.total ?? '-',
  //         // 'Customs Enabled': b.Charges?.Customs?.enabled ?? '-',
  //         // 'Customs Unit Rate': b.Charges?.Customs?.unitRate ?? '-',
  //         // 'Customs Qty': b.Charges?.Customs?.qty ?? '-',
  //         // 'Customs Total': b.Charges?.Customs?.total ?? '-',
  //         // 'Clearance Enabled': b.Charges?.Clearance?.enabled ?? '-',
  //         // 'Clearance Unit Rate': b.Charges?.Clearance?.unitRate ?? '-',
  //         // 'Clearance Qty': b.Charges?.Clearance?.qty ?? '-',
  //         // 'Clearance Total': b.Charges?.Clearance?.total ?? '-',
  //         // 'Other Charges Enabled': b.Charges?.OtherCharges?.enabled ?? '-',
  //         // 'Other Charges Unit Rate': b.Charges?.OtherCharges?.unitRate ?? '-',
  //         // 'Other Charges Qty': b.Charges?.OtherCharges?.qty ?? '-',
  //         //'Other Charges Total': b.Charges?.OtherCharges?.total ?? '-',
  //         //'Discount Enabled': b.Charges?.Discount?.enabled ?? '-',
  //         //'Discount Unit Rate': b.Charges?.Discount?.unitRate ?? '-',
  //         //'Discount Qty': b.Charges?.Discount?.qty ?? '-',
  //         //'Discount Total': b.Charges?.Discount?.total ?? '-',
  //       };
  //     });

  //     // Export
  //     const ws = XLSX.utils.json_to_sheet(excelData);
  //     const wb = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
  //     const fileName = `Container_${containerNumber}_Invoices.xlsx`;
  //     XLSX.writeFile(wb, fileName);
  //     toast.success(`✅ Exported ${excelData.length} invoice(s)`);
  //   } catch (error) {
  //     console.error('Export error:', error);
  //     toast.error('❌ Failed to export invoice data.');
  //   }
  // };
const handleExportInvoiceExcel = async (containerNumber) => {
  if (!containerNumber) {
    toast.error('Invalid container number.');
    return;
  }

  try {
    // Find all containers with this number (original list)
    const matchingContainers = containerList.filter(
      (c) =>
        c.ContainerNumber &&
        c.ContainerNumber.toString().trim().toLowerCase() ===
          containerNumber.toString().trim().toLowerCase()
    );

    if (matchingContainers.length === 0) {
      toast.error('No container found with this number.');
      return;
    }

    // Extract all unique invoice numbers
    const invoiceSet = new Set();
    matchingContainers.forEach((container) => {
      let invoices = [];
      if (typeof container.Invoices === 'string') {
        invoices = container.Invoices.split(',').map((i) => i.trim());
      } else if (Array.isArray(container.Invoices)) {
        invoices = container.Invoices;
      }
      invoices.forEach((item) => {
        const [invNo] = item.split('/');
        if (invNo) invoiceSet.add(invNo.trim());
      });
    });

    const invoiceNumbers = Array.from(invoiceSet);
    if (invoiceNumbers.length === 0) {
      toast.warn('No invoices found in this container.');
      return;
    }

    // Fetch bookings
    const response = await axios.get(AppRoutes.allBookings);
    const allBookings = response?.data?.data?.bookings || [];

    // Match bookings by invoice number (before `/`)
    const matchingBookings = allBookings.filter((b) =>
      invoiceNumbers.includes((b.InvoiceNo?.split('/')[0] || '').trim())
    );

    if (matchingBookings.length === 0) {
      toast.warn('No bookings found for the invoices in this container.');
      return;
    }

    // Build Excel rows: one per booking/invoice
    const excelData = matchingBookings.map((b) => {
      const container = matchingContainers[0]; // use first for common fields
      return {
        'Company Name': 'Pak Chinar Cargo',
        'Container No': container.ContainerNumber || '-',
        'Bilty No': b.BiltyNo || '-',
        'Booking Date': b.BookingDate || '-',
        'No Of Pieces': b.NoOfPieces || '-',
        'Sender Name': b.SenderName || '-',
        'Receiver Name': b.ReceiverName || '-',
        'Sender Mobile': b.SenderMobile || '-',
        'Receiver Mobile1': b.ReceiverMobile1 || '-',
        'Receiver Mobile2': b.ReceiverMobile2 || '-',
        'Receiver Address': b.ReceiverAddress || '-',
        'Receiver Area': b.ReceiverArea || '-',
      };
    });

    // Convert to worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Auto-fit columns
    const colWidths = [];
    const headerKeys = Object.keys(excelData[0] || {});

    headerKeys.forEach((key, index) => {
      // Start with header cell width
      let maxLength = key.length;

      // Check each row's value in this column
      excelData.forEach((row) => {
        const value = row[key] != null ? String(row[key]) : '';
        maxLength = Math.max(maxLength, value.length);
      });

      // Clamp width (min 8, max 50)
      const width = Math.min(50, Math.max(8, maxLength));
      colWidths.push({ wch: width });
    });

    ws['!cols'] = colWidths;

    // Build workbook and export
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
    const fileName = `Container_${containerNumber}_Invoices.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success(`✅ Exported ${excelData.length} invoice(s)`);
  } catch (error) {
    console.error('Export error:', error);
    toast.error('❌ Failed to export invoice data.');
  }
};

  // 📥 Download All Containers Excel (one row per invoice)
  const handleDownloadExcel = async () => {
    try {
      const response = await axios.get(AppRoutes.allBookings);
      const allBookings = response?.data?.data?.bookings || [];
      const excelData = [];

      filteredContainers.forEach((container) => {
        container.Invoices.forEach(({ invoiceNo, qty }) => {
          const booking = allBookings.find(
            (b) => (b.InvoiceNo?.split('/')[0] || '').trim() === invoiceNo
          );
          const actualPieces = booking?.NoOfPieces || qty;

          excelData.push({
            'Container No': container.ContainerNumber || '-',
            From: container.Destination?.From || '-',
            To: container.Destination?.To || '-',
            'Invoice No': invoiceNo,
            'No of Pieces': actualPieces,
            'Total Shipped': container.totalShipped,
            Status: container.Status || '-',
          });
        });
      });

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Containers');
      XLSX.writeFile(wb, 'All_Containers_Invoice_Wise.xlsx');
      toast.success('✅ Full container-invoice list exported.');
    } catch (error) {
      console.error('Full export error:', error);
      toast.error('❌ Failed to export full container list.');
    }
  };

  // 🖥️ Render
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      {containerLoading ? (
        <div className="flex items-center justify-center h-screen bg-gray-50 text-purple-600 text-xl">
          Loading containers...
        </div>
      ) : (
        <>
          <h1 className="text-center text-2xl font-bold text-blue-800 px-4 pt-6 pb-2">
            All Container Details
          </h1>

          <div className="p-4">
            {/* Search & Buttons */}
            <div className="px-4 mb-4 flex flex-col sm:flex-row justify-between gap-3">
              <input
                type="text"
                placeholder="Search by Container No or Invoice No..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/all-container-bulk-status')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Bulk Status
                </button>
                <button
                  onClick={handleDownloadExcel}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Download All Excel
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto shadow-md rounded-lg border">
              <table className="w-full text-sm text-left text-gray-700 bg-white">
                <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-center">S.No</th>
                    <th className="px-4 py-3 text-center">Container No</th>
                    <th className="px-4 py-3 text-center">Destination</th>
                    <th className="px-4 py-3 text-center">Invoices</th>
                    <th className="px-4 py-3 text-center">Total Shipped</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContainers.length > 0 ? (
                    filteredContainers.map((container, index) => {
                      const dest = container.Destination
                        ? `From: ${container.Destination.From} → To: ${container.Destination.To}`
                        : '-';

                      return (
                        <tr
                          key={container._id || index}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-3 text-center">{index + 1}</td>
                          <td className="px-4 py-3 text-center font-medium">
                            {container.ContainerNumber || '-'}
                          </td>
                          <td className="px-4 py-3 text-center">{dest}</td>
                          <td className="px-4 py-3 text-center">{container.invoiceNumbers || '-'}</td>
                          <td className="px-4 py-3 text-center">{container.totalShipped}</td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                container.Status?.toLowerCase() === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : container.Status?.toLowerCase() === 'shipment in container'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {container.Status || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex flex-wrap justify-center gap-2">
                              <button
                                onClick={() => handleEdit(container._id)}
                                className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm whitespace-nowrap"
                              >
                                Update Status
                              </button>
                              <button
                                onClick={() => handleEditContainer(container._id, container.Status)}
                                className="text-green-600 hover:text-green-800 text-xs sm:text-sm whitespace-nowrap"
                              >
                                Edit Container
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(container._id, container.Status, container.__allIds)
                                }
                                disabled={deletingId === container._id}
                                className={`text-red-600 hover:text-red-800 text-xs sm:text-sm whitespace-nowrap ${
                                  deletingId === container._id ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                {deletingId === container._id ? 'Deleting...' : 'Delete'}
                              </button>
                              <button
                                onClick={() => handleExportInvoiceExcel(container.ContainerNumber)}
                                className="text-purple-600 hover:text-purple-800 text-xs sm:text-sm whitespace-nowrap"
                              >
                                Invoices Excel
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-red-600 font-medium">
                        No containers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ContainerList;