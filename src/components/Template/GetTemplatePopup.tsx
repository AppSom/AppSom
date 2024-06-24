import React, { useEffect, useState } from 'react';
import GetTemplateCard from '@/lib/Card-template/readCard';
import { Card } from '../../../interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface GetTemplatePopupProps {
    onClose: () => void;
}

const GetTemplatePopup: React.FC<GetTemplatePopupProps> = ({ onClose }) => {
    const [templates, setTemplates] = useState<Card[]>([]);

    useEffect(() => {
        const fetchTemplates = async () => {
            const data = await GetTemplateCard();
            setTemplates(data);
        };
        fetchTemplates();
    }, []);

    const handleAddTemplate = () => {
        // Add your add template logic here
        console.log("Add template button clicked");
    };

    return (
        <div className="fixed inset-0 left-64 z-50 bg-white shadow-lg p-4 w-80 max-h-3/4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Templates</h2>
                <button onClick={onClose} className="text-gray-600 text-xl hover:text-red-500">
                    X
                </button>
            </div>
            <div className="space-y-4">
                {templates.map((template) => (
                    <div key={template.id} className="bg-gray-400 p-3 rounded shadow-md">
                        <h3 className="font-semibold">{template.name}</h3>
                        <p>{template.description}</p>
                    </div>
                ))}
            </div>
            <button 
                onClick={handleAddTemplate} 
                className="flex items-center justify-center mt-4 p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 w-full"
            >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Template
            </button>
        </div>
    );
};

export default GetTemplatePopup;
