import React from 'react';

const TopModal = ({ onClose, children }) => {
  return (
    <div className="top-modal">
      <div className="top-modal-content">
        <div className="cross-sign" onClick={onClose}>×</div>
          {children}
        </div>
    </div>
  );
};

export default TopModal;
