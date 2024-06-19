import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DeleteBoardPopupProps {
    onClose: () => void;
    onDelete: () => void;
}

const DeleteBoardPopup: React.FC<DeleteBoardPopupProps> = ({ onClose, onDelete }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleDelete = () => {
        onDelete();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div ref={popupRef} className="bg-white p-5 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-5 text-center">Delete Board</h2>
                <p className="text-center mb-5">Are you sure you want to delete this board?</p>
                <div className="flex justify-center space-x-3">
                    <Link href="/board" passHref>
                        <button onClick={handleDelete} className="bg-red-500 text-white p-2 px-10 font-bold rounded">Delete</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DeleteBoardPopup;
