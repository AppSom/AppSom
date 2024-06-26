import React, { useEffect, useRef } from "react";

interface CardOptionsPopupProps {
    onClose: () => void;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onMember: () => void;
    onChecklist: () => void;
    position: { top: number; left: number };
    permission: boolean;
}

const CardOptionsPopup: React.FC<CardOptionsPopupProps> = ({ onClose, onView, onEdit, onDelete, onMember, onChecklist, position, permission }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div
            ref={popupRef}
            className="absolute left-32 bg-white border rounded shadow-md z-10 w-36"
        >
            <button className="block w-full text-left p-2 hover:bg-gray-200" onClick={onView}>
                View
            </button>
            {
                permission ? 
                <div>
                    <button className="block w-full text-left p-2 hover:bg-gray-200" onClick={onEdit}>Edit</button>
                    <button className="block w-full text-left p-2 hover:bg-gray-200" onClick={onMember}>Member</button>
                    <button className="block w-full text-left p-2 hover:bg-gray-200" onClick={onChecklist}>Checklist</button>
                    <button className="block w-full text-left p-2 hover:bg-gray-200" onClick={onDelete}>Delete</button>
                </div> : null
            }
            
        </div>
    );
};

export default CardOptionsPopup;
