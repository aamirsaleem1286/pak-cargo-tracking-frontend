import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppRoutes } from '../constants/AppRoutes';
import { useNavigate } from 'react-router-dom';

const UpdateContainerForm = ({
  editData,
  remainingInvoices
}) => {
  const navigate = useNavigate();
  const [selectedContainer, setSelectedContainer] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [invoices, setInvoices] = useState([]);

  const {
    Destination = {},
    ContainerNumber = '',
    Invoices = [],
    Status,
    _id
  } = editData;

  // 🔁 Merge remainingInvoices + booked Invoices
  useEffect(() => {
    const invoiceMap = {};

    // Step 1: Add from remainingInvoices (objects)
    remainingInvoices.forEach((r) => {
      const [invNo] = (r.InvoiceNo || '').split('/') || [];
      const pcs = parseInt(r.RemainingPieces ?? 0, 10) || 0;
      const biltyNo = r.BiltyNo || '';

      if (!invNo) return; // Skip invalid

      invoiceMap[invNo] = {
        invNo,
        biltyNo,
        pcs,
        shipped: null,
        balance: null,
        selected: false,
      };
    });

    // Step 2: Merge with existing booked Invoices (strings like '101/10')
    Invoices.forEach((invoiceStr) => {
      const [invNo, shippedStr] = invoiceStr?.split('/') || [];
      const shipped = parseInt(shippedStr || '0', 10) || 0;

      if (!invNo) return;

      if (invoiceMap[invNo]) {
        // Exists in remaining → merge
        invoiceMap[invNo].pcs += shipped;
        invoiceMap[invNo].shipped = shipped;
        invoiceMap[invNo].balance = invoiceMap[invNo].pcs - shipped;
        invoiceMap[invNo].selected = shipped === invoiceMap[invNo].pcs;
      } else {
        // Not in remaining, add fresh (biltyNo unknown)
        invoiceMap[invNo] = {
          invNo,
          biltyNo: '', // unknown
          pcs: shipped,
          shipped,
          balance: 0,
          selected: true,
        };
      }
    });

    const mergedList = Object.values(invoiceMap);
    setInvoices(mergedList);
    setTotalInvoices(mergedList.length);
    setSelectedContainer(ContainerNumber);
  }, [editData, Invoices, remainingInvoices, ContainerNumber]);

  // 🔍 Filter invoices based on searchTerm (invNo or biltyNo)
  const filteredInvoices = useMemo(() => {
    if (!searchTerm.trim()) return invoices;

    const term = searchTerm.toLowerCase().trim();
    return invoices.filter((inv) =>
      inv.invNo.toLowerCase().includes(term) ||
      inv.biltyNo?.toLowerCase().includes(term)
    );
  }, [invoices, searchTerm]);

  const handleSelect = (index, checked) => {
    setInvoices((prev) => {
      const updated = prev.map((inv, i) =>
        i === index
          ? {
              ...inv,
              selected: checked,
              shipped: checked ? inv.pcs : null,
              balance: checked ? 0 : null,
            }
          : inv
      );
      recalculateTotalInvoices(updated);
      return updated;
    });
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    setInvoices((prev) => {
      const updated = prev.map((inv) => ({
        ...inv,
        selected: checked,
        shipped: checked ? inv.pcs : null,
        balance: checked ? 0 : null,
      }));
      recalculateTotalInvoices(updated);
      return updated;
    });
  };

  const handleShippedChange = (index, value) => {
    setInvoices((prev) => {
      const updated = prev.map((inv, i) => {
        if (i !== index) return inv;

        const pcs = inv.pcs;
        const shipped = value === '' ? null : Number(value);

        // Allow empty string (user clearing input), but validate on save
        if (shipped === null || isNaN(shipped) || shipped < 0 || shipped > pcs) {
          return { ...inv, shipped: '', balance: '' };
        }

        const balance = pcs - shipped;
        return {
          ...inv,
          shipped,
          balance,
          selected: shipped === pcs,
        };
      });

      recalculateTotalInvoices(updated);
      return updated;
    });
  };

  const recalculateTotalInvoices = (invoicesList) => {
    const fullyShipped = invoicesList.filter(
      (inv) => inv.selected && inv.shipped === inv.pcs
    ).length;
    setTotalInvoices(invoicesList.length - fullyShipped);
  };

  const handleSave = async () => {
    if (!selectedContainer) {
      toast.error('Please select a container number');
      return;
    }

    const validInvoices = invoices.filter((inv) => {
      const shipped = inv.shipped;
      return typeof shipped === 'number' && shipped > 0 && shipped <= inv.pcs;
    });

    if (validInvoices.length === 0) {
      toast.error('Please enter valid shipped quantities (at least one invoice)');
      return;
    }

    const invoiceNumbers = validInvoices.map((inv) => `${inv.invNo}/${inv.shipped}`);

    const payload = {
      containerNumber: selectedContainer,
      fromDestination: Destination.From || '',
      toDestination: Destination.To || '',
      invoices: invoiceNumbers,
      status: 'Shipment In Container',
      previousInvoices: Invoices,
    };

    try {
      setLoadingSave(true);
      const response = await axios.post(`${AppRoutes.updateSingleContainerBYID}/${_id}`, payload);
      toast.success(response?.data?.data?.message || 'Container updated successfully');
      navigate('/all-containers');
    } catch (error) {
      console.error('Save error:', error);
      const errMsg = error?.response?.data?.errors?.general || 'Something went wrong';
      toast.error(errMsg);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <>
      <h3 className="text-lg font-semibold text-yellow-700 mb-2">
        Update Container Booking
      </h3>

      <div className="flex justify-between gap-4 items-center mb-4">
        <select
          className="w-full border px-3 py-2 rounded-md focus:outline-none"
          value={selectedContainer}
          onChange={(e) => setSelectedContainer(e.target.value)}
          disabled
        >
          <option value="">Select Container No</option>
          <option value={ContainerNumber}>{ContainerNumber}</option>
        </select>
      </div>

      <div className="flex gap-4">
        {/* Left Table */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <div className='flex gap-24'>
            <h4 className="bg-blue-700 text-white px-4 py-2 rounded-t-md font-semibold">
              Show & Select Bookings
            </h4>
          <div className="mb-2 flex items-center gap-4">
  <h1 className="whitespace-nowrap font-medium">Search Bilty</h1>
  <input
    type="text"
    placeholder="Search by Inv # or Bilty No..."
    className="flex-1 min-w-0 border px-3 lg:w-[490px] py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>
            </div>
            <input
              type="text"
              disabled
              value={`Total Available: ${totalInvoices}`}
              className="border text-center rounded px-2 py-1 text-sm w-32"
            />
          </div>

          <div className={`${filteredInvoices.length > 0 ? 'h-[200px]' : 'h-[100px]'} overflow-auto border rounded`}>
            <table className="w-full border border-t-0">
              <thead className="bg-gray-100 text-sm">
                <tr className="text-center">
                  <th className="border px-2 py-1">Inv #</th>
                  <th className="border px-2 py-1">Bilty No</th>
                  <th className="border px-2 py-1">Pieces</th>
                  <th className="border px-2 py-1">Shipped</th>
                  <th className="border px-2 py-1">Balance</th>
                  <th className="border px-2 py-1">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((b, i) => (
                    <tr key={i} className="text-center text-sm">
                      <td className="border px-2 py-1">{b.invNo}</td>
                      <td className="border px-2 py-1">{b.biltyNo || '—'}</td>
                      <td className="border px-2 py-1">{b.pcs}</td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          value={b.shipped ?? ''}
                          disabled={b.selected}
                          onChange={(e) => handleShippedChange(i, e.target.value)}
                          className="w-16 border rounded px-2 py-1 text-sm text-center"
                          min="0"
                          max={b.pcs}
                        />
                      </td>
                      <td className="border px-2 py-1">{b.balance ?? (b.selected ? 0 : '')}</td>
                      <td className="border px-2 py-1">
                        <input
                          type="checkbox"
                          checked={b.selected}
                          onChange={(e) => handleSelect(i, e.target.checked)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-3 text-gray-500">
                      No bookings match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3">
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded font-medium ${
                loadingSave
                  ? 'bg-green-500 cursor-not-allowed'
                  : 'bg-green-700 hover:bg-green-800'
              } text-white flex items-center justify-center`}
              disabled={loadingSave}
            >
              {loadingSave ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Update Container'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateContainerForm;