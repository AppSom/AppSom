"use client";

import { useRef, useEffect } from "react";

interface DeleteTemplatePopupProps {
    onClose: () => void;
    onDelete: () => void;
}

const DeleteTemplatePopup: React.FC<DeleteTemplatePopupProps> = ({ onClose, onDelete }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div ref={popupRef} className="bg-white p-5 rounded shadow-lg w-96 relative z-50">
                <h2 className="text-xl font-bold mb-5 text-center text-black">Delete Template</h2>
                <p className="text-center text-black mb-5">Are you sure you want to delete this template?</p>
                <div className="flex justify-center space-x-3">
                    <button
                        onClick={onDelete}
                        className="bg-red-500 text-white p-2 px-10 font-bold rounded"
                    >
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white p-2 px-10 font-bold rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteTemplatePopup;
