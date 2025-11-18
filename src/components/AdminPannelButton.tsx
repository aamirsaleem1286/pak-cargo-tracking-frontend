import React from 'react';

const AdminPanelButton = ({ label, onClick, disabled }) => {
  return (
    <div className="space-y-4 w-96">
      <button
        disabled={disabled}
        onClick={onClick}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded font-medium hover:bg-blue-700 transition-colors mt-6 cursor-pointer"
      
      >
        {label}
      </button>
    </div>
  );
};

export default AdminPanelButton;
