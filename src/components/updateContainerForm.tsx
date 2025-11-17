import React, { useEffect, useState } from 'react';
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
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [totalInvoices, setTotalInvoices] = useState();
  const [invoices, setInvoices] = useState([]);
  const {
    Destination,
    ContainerNumber,
    Invoices,
      Status,
      _id
      
  } = editData
  // console.log(editData);
  
 
useEffect(() => {
  const invoiceMap = {};

  // Step 1: Add from remainingInvoices (objects)
  remainingInvoices.forEach((r) => {
    const [invNo] = r.InvoiceNo?.split('/') || [];
    const pcs = parseInt(r.RemainingPieces ?? 0, 10);

    invoiceMap[invNo] = {
      invNo,
      pcs,
      shipped: null,
      balance: null,
      selected: false,
    };
  });

  // Step 2: Merge with existing booked Invoices (also strings like '101/1')
  Invoices.forEach((invoiceStr) => {
    const [invNo, shippedStr] = invoiceStr.split('/');
    const shipped = parseInt(shippedStr || '0', 10);

    if (invoiceMap[invNo]) {
      // Already exists in remaining → merge pcs
      invoiceMap[invNo].pcs += shipped;
      invoiceMap[invNo].shipped = shipped;
      invoiceMap[invNo].balance = invoiceMap[invNo].pcs - shipped;
      invoiceMap[invNo].selected = shipped === invoiceMap[invNo].pcs;
    } else {
      // Not in remaining, add fresh
      invoiceMap[invNo] = {
        invNo,
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
}, [editData, Invoices, remainingInvoices]);



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

  // const handleSelectAll = (checked) => {
  //   setSelectAll(checked);
  //   setInvoices((prev) => {
  //     const updated = prev.map((inv) => ({
  //       ...inv,
  //       selected: checked,
  //       shipped: checked ? inv.pcs : null,
  //       balance: checked ? 0 : null,
  //     }));
  //     const fullyShipped = updated.filter((inv) => inv.selected && inv.balance === 0).length;
  //     setTotalInvoices(Invoices.length - fullyShipped);
  //     return updated;
  //   });
  // };
  const handleSelectAll = (checked) => {
  setSelectAll(checked);
  setInvoices((prev) => {
    const updated = prev.map((inv) => ({
      ...inv,
      selected: checked,
      shipped: checked ? inv.pcs : null,
      balance: checked ? 0 : null,
    }));
    
    // Fix here: Use updated.length instead of Invoices.length
    const fullyShipped = updated.filter((inv) => inv.selected && inv.balance === 0).length;
    setTotalInvoices(updated.length - fullyShipped);
    
    return updated;
  });
};


  const handleShippedChange = (index, value) => {
    setInvoices((prev) => {
      const updated = prev.map((inv, i) => {
        if (i !== index) return inv;
        const pcs = inv.pcs;
        const shipped = Number(value);

        if (isNaN(shipped) || shipped < 0 || shipped > pcs) {
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

  // const recalculateTotalInvoices = (invoices) => {
  //   const fullyShipped = invoices.filter(
  //     (inv) => inv.selected && inv.shipped === inv.pcs
  //   ).length;
  //   setTotalInvoices(Invoices.length - fullyShipped);
  // };
  const recalculateTotalInvoices = (invoices) => {
  const fullyShipped = invoices.filter(
    (inv) => inv.selected && inv.shipped === inv.pcs
  ).length;

  setTotalInvoices(invoices.length - fullyShipped);
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

    console.log("invoiceNumbers",invoiceNumbers);
    

    const payload = {
      containerNumber: selectedContainer,
      fromDestination: Destination.From,
      toDestination: Destination.To,
      invoices: invoiceNumbers,
      status: 'Shipment In Container',
      previousInvoices:Invoices
    };

    try {
      setLoadingSave(true);
      const response = await axios.post(`${AppRoutes.updateSingleContainerBYID}/${_id}`, payload);
      toast.success(response?.data?.data?.message || 'Saved successfully');
      navigate('/all-containers')
    } catch (error) {
      console.log(error);
      
      const err = error?.response?.data?.errors;
      if (err?.general) toast.error(err.general);
      else toast.error('Something went wrong');
    } finally {
      setLoadingSave(false);
    }
  };

// console.log(totalInvoices);

  return (
    <>
      <h3 className="text-lg font-semibold text-yellow-700 mb-2">
        {'Update Container Booking'}
      </h3>

      <div className="flex justify-between gap-4 items-center mb-4">
        <select
          className="w-full border px-3 py-2 rounded-md focus:outline-none"
          value={selectedContainer}
          onChange={(e) => setSelectedContainer(e.target.value)}
          disabled
        >
          <option value="">Select Container No</option>
            <option  value={ContainerNumber}>
              {ContainerNumber}
            </option>
          
        </select>

        {/* <div className="flex gap-2 w-full">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow cursor-pointer"
            onClick={handleSave}
            disabled={loadingSave}
          >
            {loadingSave ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
          </button>
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow cursor-pointer">Edit</button>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow cursor-pointer">Del</button>
        </div> */}
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

          <div className={`${invoices.length > 0 ? 'h-[200px]' : 'h-[100px]'} overflow-auto border rounded`}>
            <table className="w-full border border-t-0">
              <thead className="bg-gray-100 text-sm">
                <tr className="text-center">
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
                {invoices.map((b, i) => {
                    console.log(b,i);
                    
                    return <tr key={i} className="text-center text-sm">
                    <td className="border px-2 py-1">{b.invNo}</td>
                    <td className="border px-2 py-1">{b.pcs}</td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={b.shipped ?? ''}
                        disabled={b.selected}
                        onChange={(e) => handleShippedChange(i, e.target.value)}
                        className="w-16 border rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="border px-2 py-1">{b.balance ?? ''}</td>
                    <td className="border px-2 py-1">
                      <input
                        type="checkbox"
                        checked={b.selected}
                        onChange={(e) => handleSelect(i, e.target.checked)}
                      />
                    </td>
                  </tr> 
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-2">
            <button
              onClick={handleSave}
              className="bg-green-700 text-white px-3 py-1 rounded cursor-pointer"
              disabled={loadingSave}
            >
            {
                loadingSave ? (
                  <div className="flex justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ):(    
              'Update Container')
            }
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateContainerForm;
