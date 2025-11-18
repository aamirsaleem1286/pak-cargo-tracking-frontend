import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const statuses = [
  'Shipment at Godown',
  'Shipment In Container',
  'Shipment at Sending Port',
  'Shipment In Transit',
  'Shipment Arrived At Port',
  'Shipment Under Clearance',
  'Shipmen Arrived At Godown',
  'Out For Delivery',
  'Delivered'
];

const ContainerStatusUpdate = ({ container, onSave,loadingSave }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [manualStatus, setManualStatus] = useState('');

  useEffect(() => {
    if (container?.Status) {
      setSelectedStatus(container.Status);
      setManualStatus(container.Status);
    }
  }, [container]);

  const currentStatusIndex = statuses.findIndex(status => status === container?.Status);

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setManualStatus(status);
  };

  const handleCheckboxChange = (status, checked) => {
    if (checked) {
      setSelectedStatus(status);
      setManualStatus(status);
    }
  };

  const handleManualChange = (e) => {
    const value = e.target.value;
    const index = statuses.findIndex(status => status === value);
    if (index !== -1 && index < currentStatusIndex) return; // block going backwards
    setManualStatus(value);
    setSelectedStatus('');
  };

  const handleSave = () => {
    const updated = manualStatus.trim();
    if (!updated || updated === container?.Status) {
      return toast.error('Please select or type a new status');
    }
    onSave(updated);
  };

  const isSaveDisabled = manualStatus.trim() === '' || manualStatus.trim() === container?.Status;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-yellow-500 mb-4">Change Container Status</h2>

      <div className="flex space-x-2 mb-2">
        <select className="border px-2 py-1 bg-blue-600 text-white" disabled value={container?.ContainerNumber}>
          <option>{container?.ContainerNumber || 'Select Container No'}</option>
        </select>
        <input className="border px-2 py-1 bg-blue-600 text-white" value={container?.Destination.From || ''} readOnly />
        <input className="border px-2 py-1 bg-blue-600 text-white" value={container?.Destination.To || ''} readOnly />
      </div>

      <div className="bg-blue-600 text-white font-bold px-4 py-2 mb-2 w-fit">Default Bilty Status</div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {statuses.map((status, index) => {
          const isDisabled = index < currentStatusIndex;
          return (
            <div key={index} className="flex items-center space-x-2 border p-2">
              <input
                type="checkbox"
                checked={isDisabled ? true : selectedStatus === status}
                disabled={isDisabled}
                onChange={(e) => handleCheckboxChange(status, e.target.checked)}
              />
              <button
                className={`flex-1 text-left ${selectedStatus === status ? 'font-bold text-blue-700' : ''}`}
                onClick={() => !isDisabled && handleStatusSelect(status)}
                disabled={isDisabled}
              >
                {status}
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex space-x-2 mb-4">
        <div className="bg-blue-600 text-white font-bold px-4 py-2">Change Status Manually</div>
        <button
          onClick={handleSave}
          className={`px-4 py-2 text-white ${isSaveDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 cursor-pointer'}`}
          disabled={isSaveDisabled}
        >
          {loadingSave?(
            <div className="flex justify-center">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          ):("Save")}
        </button>
      </div>

      <input
        className="w-full border px-2 py-2"
        value={manualStatus}
        onChange={handleManualChange}
        placeholder="Type status manually"
      />
    </div>
  );
};

export default ContainerStatusUpdate;
