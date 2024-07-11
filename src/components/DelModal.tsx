import React, { useEffect } from "react";

interface DelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DelModal: React.FC<DelModalProps> = ({ isOpen, onClose, onConfirm }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-4">
          Είστε σίγουροι ότι θέλετε να διαγράψετε τη φωτογραφία?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
            onClick={onConfirm}
          >
            Ναι , Διαγραφή
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded-lg"
            onClick={onClose}
          >
            Ακύρωση
          </button>
        </div>
      </div>
    </div>
  );
};

export default DelModal;
