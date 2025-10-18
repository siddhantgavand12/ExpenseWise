import React from 'react';

interface ConfirmationToastProps {
  isVisible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
}

const ConfirmationToast: React.FC<ConfirmationToastProps> = ({ isVisible, message, onConfirm, onCancel, confirmText = 'Delete' }) => {
  if (!isVisible) return null;

  return (
    // This outer container handles the fixed positioning and centers the toast itself.
    <div className="fixed bottom-5 left-4 right-4 z-50 flex justify-center">
      {/* This inner container is the visible toast notification. */}
      <div className="w-full max-w-sm bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center justify-between animate-fade-in-up">
        <p className="text-sm mr-4">{message}</p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={onConfirm}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ConfirmationToast;