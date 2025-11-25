import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppRoutes } from '../constants/AppRoutes';
import { useNavigate } from 'react-router-dom';

const AddContainer = ({
  containerList = [],
  invoiceList = [],
  bookedContainerList = [],
  refreshBookedContainer,
  refreshInvoices,
  refreshContainerNoList
}) => {
  const navigate = useNavigate();
  const [selectedContainer, setSelectedContainer] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Sync invoices when invoiceList changes — now with stable `id`
  useEffect(() => {
    const updatedInvoices = invoiceList.map((invoice) => {
      const [invNo = ''] = invoice.InvoiceNo?.split('/') || [];
      const pcs = invoice.RemainingPieces ?? 0;
      const id = `${invoice.BiltyNo || 'NO_BILTY'}-${invNo}-${invoice._id || invoice.id || Math.random()}`;
      
      return {
        ...invoice,
        id,
        invNo,
        pcs,
        shipped: null,
        balance: null,
        selected: false,
        BiltyNo: invoice.BiltyNo || '',
      };
    });

    setInvoices(updatedInvoices);
    setTotalInvoices(invoiceList.length);
  }, [invoiceList]);
  
  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice => 
    invoice.BiltyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invNo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelect = (id, checked) => {
    setInvoices((prev) => {
      const updated = prev.map((inv) =>
        inv.id === id
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

  const handleShippedChange = (id, value) => {
    setInvoices((prev) => {
      const updated = prev.map((inv) => {
        if (inv.id !== id) return inv;
        const pcs = inv.pcs;
        const shipped = value === '' ? null : Number(value);

        // Allow empty input for typing
        if (value === '' || isNaN(shipped)) {
          return { ...inv, shipped: '', balance: '' };
        }

        if (shipped < 0 || shipped > pcs) {
          return { ...inv, shipped: '', balance: '' };
        }

        const balance = pcs - shipped;

        return {
          ...inv,
          shipped,
          balance,
          selected: shipped === pcs ? true : inv.selected,
        };
      });

      recalculateTotalInvoices(updated);
      return updated;
    });
  };

  const recalculateTotalInvoices = (invoices) => {
    const fullyShipped = invoices.filter(
      (inv) => inv.selected && inv.shipped === inv.pcs
    ).length;
    setTotalInvoices(invoiceList.length - fullyShipped);
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
      toast.error('Please enter valid shipped quantities');
      return;
    }

    const invoiceNumbers = validInvoices.map((inv) => `${inv.invNo}/${inv.shipped}`);
    const biltyNo = validInvoices[0]?.BiltyNo;
    
    const payload = {
      containerNumber: selectedContainer,
      fromDestination: fromCity,
      toDestination: toCity,
      invoices: invoiceNumbers,
      BiltyNo: biltyNo,
      status: 'Shipment In Container',
    };

    try {
      setLoadingSave(true);
      const response = await axios.post(AppRoutes.addContainer, payload);
      toast.success(response?.data?.data?.message || 'Container updated successfully');
      refreshBookedContainer?.();
      refreshContainerNoList?.();
      refreshInvoices?.();
      // Optional: reset form
      setSelectedContainer('');
      setFromCity('');
      setToCity('');
      setSearchTerm('');
      setSelectAll(false);
    } catch (error) {
      const err = error?.response?.data?.errors;
      if (err?.general) toast.error(err.general);
      else toast.error('Something went wrong while saving');
    } finally {
      setLoadingSave(false);
    }
  };

  const rightTableData = invoices
    .filter(inv => inv.selected)
    .map(inv => ({
      BiltyNo: inv.BiltyNo,
      ContainerNumber: selectedContainer || 'N/A',
      InvNo: inv.invNo,
      Shipped: inv.shipped
    }));
    
  useEffect(() => {
    const cities = containerList.find((c) => c.ContainerNumber === selectedContainer);
    if (cities) {
      setFromCity(cities.From);
      setToCity(cities.To);
    }
  }, [selectedContainer, containerList]);

  const selectedBilty = bookedContainerList.filter(
    (b) => b.Status === 'Shipment In Container'
  );

  return (
    <>
      <h3 className="text-lg font-semibold text-yellow-700 mb-2">
        Attach Bilty To Container
      </h3>

      <div className="flex justify-between gap-4 items-center mb-4">
        <select
          className="w-full border px-3 py-2 rounded-md focus:outline-none"
          value={selectedContainer}
          onChange={(e) => setSelectedContainer(e.target.value)}
        >
          <option value="">Select Container No</option>
          {containerList.map((c, i) => (
            <option key={c.ContainerNumber || i} value={c.ContainerNumber}>
              {c.ContainerNumber}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        {/* Left Table */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h4 className="bg-blue-700 text-white px-4 py-2 rounded-t-md font-semibold">
              Show & Select Bookings
            </h4>
            <input
              type="text"
              disabled
              value={`Total Available Bilty: ${totalInvoices}`}
              className="border text-center rounded px-2 py-1 text-sm"
            />
          </div>
          
          {/* Search Bar */}
          <div className="mb-2">
            <input
              type="text"
              placeholder="Search by Bilty No or Inv #..."
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={`${filteredInvoices.length > 0 ? 'h-[200px]' : 'h-[100px]'} overflow-auto border rounded`}>
            <table className="w-full border border-t-0">
              <thead className="bg-gray-100 text-sm">
                <tr className="text-center">
                  <th className="border px-2 py-1">Bilty No</th>
                  <th className="border px-2 py-1">Inv #</th>
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
                {filteredInvoices.map((b) => {
                  // ✅ Use stable `id` — no index issues!
                  return (
                    <tr key={b.id} className="text-center text-sm">
                      <td className="border px-2 py-1">{b.BiltyNo}</td>
                      <td className="border px-2 py-1">{b.invNo}</td>
                      <td className="border px-2 py-1">{b.pcs}</td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          value={b.shipped ?? ''}
                          disabled={b.selected}
                          onChange={(e) => handleShippedChange(b.id, e.target.value)}
                          className="w-16 border rounded px-2 py-1 text-sm"
                          min="0"
                          max={b.pcs}
                        />
                      </td>
                      <td className="border px-2 py-1">{b.balance ?? ''}</td>
                      <td className="border px-2 py-1">
                        <input
                          type="checkbox"
                          checked={b.selected}
                          onChange={(e) => handleSelect(b.id, e.target.checked)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredInvoices.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No bookings found matching "{searchTerm}"
              </div>
            )}
          </div>

          <div className="mt-2">
            <button
              onClick={handleSave}
              className="bg-green-700 text-white px-3 py-1 rounded cursor-pointer"
              disabled={loadingSave}
            >
              {loadingSave ? (
                <div className="flex justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : 'Link to Container'}
            </button>
          </div>
        </div>

        {/* Right Table */}
        <div className="w-1/2">
          <div className="flex justify-between items-center mb-1">
            <h4 className="bg-blue-700 text-white px-4 py-2 rounded-t-md font-semibold">
              Selected Bilty
            </h4>
            <input
              type="text"
              disabled
              value={`Total Invoices: ${selectedBilty.flatMap(b => b.Invoices || []).length}`}
              className="border text-center rounded px-2 py-1 text-sm"
            />
          </div>

          <div className={`${selectedBilty.length > 0 ? 'h-[200px]' : 'h-[100px]'} overflow-auto border rounded`}>
            <table className="w-full border border-t-0">
              <thead className="bg-gray-100 text-sm">
                <tr className="text-center">
                  <th className="border px-2 py-1">Container No</th>
                  <th className="border px-2 py-1">Inv No</th>
                  <th className="border px-2 py-1">Shipped Pieces</th>
                </tr>
              </thead>
              <tbody>
                {selectedBilty.flatMap((b) => {
                  const BiltyNo = b.BiltyNo || b.BilityNo || b.Bilty_No || b.biltyNo || b['Bilty No'] || 'N/A';
                  return (b.Invoices || []).map((item) => {
                    const [inv, qty] = (item || '').split('/');
                    return (
                      <tr key={`${b.ContainerNumber}-${inv}-${BiltyNo}`} className="text-center text-sm">
                        <td className="border px-2 py-1">{b.ContainerNumber || 'N/A'}</td>
                        <td className="border px-2 py-1">{inv || 'N/A'}</td>
                        <td className="border px-2 py-1">{qty || 0}</td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
            
            {selectedBilty.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No bilty linked yet
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddContainer;