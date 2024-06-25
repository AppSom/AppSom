import React, { useEffect, useState, useRef } from 'react';
import GetTemplateCard from '@/lib/Card-template/readCard';
import { Card } from '../../../interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddTemplatePopup from './AddTemplatePopup';
import EditTemplatePopup from './EditTemplatePopup';
import DeleteTemplatePopup from './DeleteTemplatePopup';
import CreateCard from '@/lib/Card-template/createCard';
import DeleteCardById from '@/lib/Card-template/deleteCard';
import UpdateCardById from '@/lib/Card-template/editCard';

interface GetTemplatePopupProps {
    onClose: () => void;
}

const GetTemplatePopup: React.FC<GetTemplatePopupProps> = ({ onClose }) => {
    const [templates, setTemplates] = useState<Card[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Card[]>([]);
    const [showAddTemplatePopup, setShowAddTemplatePopup] = useState<boolean>(false);
    const [showEditTemplatePopup, setShowEditTemplatePopup] = useState<boolean>(false);
    const [showDeleteTemplatePopup, setShowDeleteTemplatePopup] = useState<boolean>(false);
    const [templateToEdit, setTemplateToEdit] = useState<Card | null>(null);
    const [templateToDelete, setTemplateToDelete] = useState<Card | null>(null);
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

    const handleAddTemplate = async (newTemplate: Card) => {
        await CreateCard(newTemplate);
        const updatedTemplates = await GetTemplateCard();
        setTemplates(updatedTemplates);
        toast.success('Template Added Successfully', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const handleEditTemplate = (template: Card) => {
        setTemplateToEdit(template);
        setShowEditTemplatePopup(true);
    };

    const handleSaveEditTemplate = async (updatedCard: Card) => {
        const updatedTemplates = templates.map((template) =>
            template.id === updatedCard.id ? updatedCard : template
        );
        await UpdateCardById(updatedCard)
        setTemplates(updatedTemplates);
        toast.success('Template Updated Successfully', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const handleDeleteTemplate = (template: Card) => {
        setTemplateToDelete(template);
        setShowDeleteTemplatePopup(true);
    };

    const confirmDeleteTemplate = async () => {
        if (templateToDelete) {
            await DeleteCardById(templateToDelete.id);
            const updatedTemplates = templates.filter(template => template.id !== templateToDelete.id);
            setTemplates(updatedTemplates);
            setShowDeleteTemplatePopup(false);
            toast.error('Template Deleted Successfully', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const handleCloseAddTemplate = () => {
        setShowAddTemplatePopup(false);
    };

    const handleCloseEditTemplate = () => {
        setShowEditTemplatePopup(false);
    };

    const handleCloseDeleteTemplate = () => {
        setShowDeleteTemplatePopup(false);
    };

    const displayedTemplates = searchTerm ? searchResults : templates;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div ref={popupRef} className="bg-white p-5 rounded shadow-lg w-96 z-50">
                <h2 className="text-xl font-bold mb-5 text-center text-black">Templates</h2>
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
                            <button onClick={() => handleEditTemplate(template)} className="text-blue-500 mx-2">
                                <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button onClick={() => handleDeleteTemplate(template)} className="text-red-500">
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center">
                    <button onClick={() => setShowAddTemplatePopup(true)} className="bg-green-500 text-white p-2 rounded flex items-center">
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Add Template
                    </button>
                    <button onClick={onClose} className="bg-red-500 text-white p-2 px-10 font-bold rounded">
                        Close
                    </button>
                </div>
                {showAddTemplatePopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15">
                        <AddTemplatePopup
                            onClose={handleCloseAddTemplate}
                            onSave={handleAddTemplate}
                        />
                    </div>
                )}
                {showEditTemplatePopup && templateToEdit && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15">
                        <EditTemplatePopup
                            card={templateToEdit}
                            onClose={handleCloseEditTemplate}
                            onSave={handleSaveEditTemplate}
                        />
                    </div>
                )}
                {showDeleteTemplatePopup && templateToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15">
                        <DeleteTemplatePopup
                            onClose={handleCloseDeleteTemplate}
                            onDelete={confirmDeleteTemplate}
                        />
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default GetTemplatePopup;
