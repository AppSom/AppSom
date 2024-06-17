import { useState, useEffect, useRef } from 'react';
import { Board, User, UserJSON } from '../../../interface';
import GetUserProfile from '@/lib/GetUserProfile';
import UpdateBoardById from '@/lib/UpdateBoardById';

interface MemberListPopupProps {
    board: Board;
    onClose: () => void;
}

const MemberListPopup: React.FC<MemberListPopupProps> = ({ board, onClose }) => {
    const [members, setMembers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMembers = async () => {
            const memberProfiles = await Promise.all(
                board.member.map((userId) => GetUserProfile(userId))
            );
            setMembers(memberProfiles);
        };

        fetchMembers();
    }, [board.member]);

    const handleSearch = async (username: string) => {
        const response = await fetch('/Storage/User/user.json', {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error('Cannot get user profile');
        }
        const userJson: UserJSON = await response.json();
        const user: User[] = userJson.data.filter(u => 
            u.username.toLowerCase().includes(username.toLowerCase()) && 
            !board.member.includes(u.id)
        );
        setSearchResults(user);
    };

    const handleAddMember = async (user: User) => {
        const updatedBoard = { ...board, member: [...board.member, user.id] };
        await UpdateBoardById(board.id, updatedBoard);
        setMembers([...members, user]);
        setSearchResults([]);
        setSearchTerm('');
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
            <div ref={popupRef} className="bg-white p-5 rounded shadow-lg w-96 z-50">
                <h2 className="text-xl font-bold mb-5 text-center">Board Members</h2>
                <ul className="mb-3">
                    {members.map(member => (
                        <li key={member.id} className="flex items-center mb-2">
                            <img src={member.image} alt={member.name} className="w-8 h-8 rounded-full mr-2" />
                            <span>{member.name}</span>
                        </li>
                    ))}
                </ul>
                <input
                    type="text"
                    placeholder="Search username..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    className="w-full mb-3 p-2 border rounded border-gray-500"
                />
                <ul className="mb-3">
                    {searchResults.map(user => (
                        <li key={user.id} className="flex items-center mb-2">
                            <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full mr-2" />
                            <span>{user.name}</span>
                            <button
                                onClick={() => handleAddMember(user)}
                                className="ml-auto bg-blue-500 text-white p-2 rounded"
                            >
                                Add
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-center space-x-3">
                    <button onClick={onClose} className="bg-red-500 text-white p-2 px-10 font-bold rounded">Close</button>
                </div>
            </div>
        </div>
    );
};

export default MemberListPopup;
