import React, { useState, useRef, useEffect } from 'react';
import { CheckList } from '../../../interface';

interface AddChecklistPopupProps {
    onClose: () => void;
    onSave: (checklist: CheckList) => void;
}

const AddChecklistPopup: React.FC<AddChecklistPopupProps> = ({ onClose, onSave }) => {
    const [checklistName, setChecklistName] = useState<string>('');
    const popupRef = useRef<HTMLDivElement>(null);

    const handleSave = () => {
        if (checklistName.trim() === '') {
            alert('Checklist name cannot be empty');
            return;
        }
        const newChecklist: CheckList = {
            id: Date.now().toString(),
            name: checklistName,
            show: false,
        };
        onSave(newChecklist);
        onClose();
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div ref={popupRef} className="bg-white p-5 rounded shadow-lg w-96 relative">
                <h2 className="text-xl font-bold mb-5 text-center">Add Checklist</h2>
                <input
                    type="text"
                    placeholder="Checklist Name"
                    value={checklistName}
                    onChange={(e) => setChecklistName(e.target.value)}
                    className="w-full mb-3 p-2 border rounded border-gray-500"
                />
                <div className="flex justify-center space-x-3">
                    <button onClick={handleSave} className="bg-orange-500 text-white p-2 px-4 font-bold rounded">
                        Save
                    </button>
                    <button onClick={onClose} className="bg-gray-300 text-black p-2 px-4 font-bold rounded">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddChecklistPopup;
