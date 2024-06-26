"use client";

import { useState, useEffect, useRef } from "react";
import { Template } from "../../../interface";
import GetTemplateCard from "@/lib/Card-template/readCard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UseTemplatePopupProps {
    onClose: () => void;
    onSelect: (template: Template) => void;
}

const UseTemplatePopup: React.FC<UseTemplatePopupProps> = ({ onClose, onSelect }) => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Template[]>([]);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            const data = await GetTemplateCard();
            setTemplates(data);
        };
        fetchTemplates();
    }, []);

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

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const results = templates.filter(template =>
            template.name.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(results);
    };

    const handleSelectTemplate = (template: Template) => {
        toast.success('Template Selected Successfully', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        onSelect(template);
        onClose();
    };

    const displayedTemplates = searchTerm ? searchResults : templates;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div ref={popupRef} className="bg-white p-5 rounded shadow-lg w-96 z-50">
                <h2 className="text-xl font-bold mb-5 text-center">Templates</h2>
                <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full mb-3 p-2 border rounded border-gray-500"
                />
                <div className="mb-3 max-h-64 overflow-y-auto">
                    {displayedTemplates.map(template => (
                        <div key={template.id} className="bg-gray-400 p-3 rounded shadow-md mb-2 flex items-center">
                            <div className="flex-grow">
                                <h3 className="font-semibold">{template.name}</h3>
                                <p>{template.description}</p>
                            </div>
                            <button
                                onClick={() => handleSelectTemplate(template)}
                                className="bg-blue-500 text-white p-2 rounded"
                            >
                                Add
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center">
                    <button onClick={onClose} className="bg-red-500 text-white p-2 px-10 font-bold rounded">
                        Close
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default UseTemplatePopup;
