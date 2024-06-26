import { useState, useEffect, useRef } from 'react';
import { Card, List, Board, User, UserJSON, BoardJSON } from '../../../interface';
import GetUserProfile from '@/lib/GetUserProfile';
import GetBoards from '@/lib/Board/GetBoards';
import AddMemberCard from '@/lib/Card/AddMemberCard';
import RemoveMemberCard from '@/lib/Card/RemoveMemberCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CardMemberPopupProps {
    onClose: () => void;
    cid: string;
    lid: string;
}

const CardMemberPopup: React.FC<CardMemberPopupProps> = ({ onClose, cid, lid }) => {
    const [card, setCard] = useState<Card | null>();
    const [list, setList] = useState<List | null>(null);
    const [board, setBoard] = useState<Board | null>(null);
    const [members, setMembers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data: BoardJSON = await GetBoards();

            let foundList: List | null = null;
            let foundBoard: Board | null = null;

            for (const board of data.data) {
                const list = board.lists.find((list) => list.id === lid);
                if (list) {
                    foundList = list;
                    foundBoard = board;
                    break;
                }
            }

            if (foundList && foundBoard) {
                setList(foundList);
                setBoard(foundBoard);

                const cardData = foundList.cards.find(c => c.id === cid);
                if (cardData) {
                    setCard(cardData);
                    const memberProfiles = await Promise.all(
                    cardData.member.map((userId) => GetUserProfile(userId)));
                    setMembers(memberProfiles);
                }
                
            }
        };

        fetchData();
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

    if (!board || !list || !card) {
        return null;
    }

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
            board && board.member.includes(u.id) && 
            !card.member.includes(u.id)
        );
        setSearchResults(user);
    };

    const handleAddMember = async (user: User) => {
        await AddMemberCard(user.id, board.id, list.id, card.id);
        setMembers([...members, user]);
        setCard({ ...card, member: [...card.member, user.id]});
        setSearchResults([]);
        setSearchTerm('');
        toast.success('Add Member Success', {
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

    const handleRemoveMember = async (uid: string) => {
        await RemoveMemberCard(uid, board.id, list.id, card.id);
        setMembers(members.filter(u => u.id != uid));
        setCard({ ...card, member: card.member.filter(m => m != uid)});
        setSearchResults([]);
        setSearchTerm('');
        toast.success('Delete Member Success', {
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

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div ref={popupRef} className="bg-white p-5 rounded shadow-lg w-96 relative">
                <div className="mb-3">
                    <div className='mb-3 text-3xl font-bold'>Members</div>
                    <ul className="mb-7">
                        {members.map(member => (
                            <li key={member.id} className="flex items-center mb-2">
                                <img src={member.image} alt={member.name} className="w-8 h-8 rounded-full mr-2" />
                                <div className='text-xl'>{member.name}</div>
                                <button className='rounded bg-red-600 px-2 text-white ml-auto hover:bg-red-800' onClick={() => handleRemoveMember(member.id)} >X</button>
                            </li>
                        ))}
                    </ul>
                    <div className='mb-3 text-2xl font-bold'>Add Members</div>
                </div>
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
                                className="ml-auto bg-orange-500 text-white p-2 rounded"
                            >
                                Add
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CardMemberPopup;
