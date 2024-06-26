import { useState, useEffect, useRef } from 'react';
import { Card, List, Board, User, CheckList } from '../../../interface';
import GetUserProfile from '@/lib/GetUserProfile';
import GetBoards from '@/lib/Board/GetBoards';
import AddChecklistPopup from './AddChecklistPopup';
import AddCheckList from '@/lib/Card/AddCheckList';
import CheckCheckList from '@/lib/Card/CheckCheckList';
import Image from 'next/image';
import RemoveCheckList from '@/lib/Card/RemoveCheckList';

interface ViewCardPopupProps {
    onClose: () => void;
    cid: string;
    lid: string;
    updateCard: (updatedCard: Card) => void;
}

const CardChecklist: React.FC<ViewCardPopupProps> = ({ onClose, cid, lid, updateCard }) => {
    const [card, setCard] = useState<Card | null>(null);
    const [list, setList] = useState<List | null>(null);
    const [board, setBoard] = useState<Board | null>(null);
    const [members, setMembers] = useState<User[]>([]);
    const [checklists, setChecklists] = useState<CheckList[]>([]);
    const [isAddChecklistPopupOpen, setIsAddChecklistPopupOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await GetBoards();
            let foundList = null;
            let foundBoard = null;

            for (const board of data.data) {
                const list = board.lists.find((list:any) => list.id === lid);
                if (list) {
                    foundList = list;
                    foundBoard = board;
                    break;
                }
            }

            if (foundList && foundBoard) {
                setList(foundList);
                setBoard(foundBoard);
                const cardData = foundList.cards.find((c:any) => c.id === cid);
                if (cardData) {
                    setCard(cardData);
                    setChecklists(cardData.CheckList);
                    const memberProfiles = await Promise.all(
                        cardData.member.map((userId:any) => GetUserProfile(userId))
                    );
                    setMembers(memberProfiles);
                }
            }
        };

        fetchData();
    }, [cid, lid]);

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

    const handleCheckboxChange = async (id: string, show: boolean) => {
        await CheckCheckList(id, card.id, list.id, board.id, !show);
        setChecklists((prevChecklists) =>
            prevChecklists.map((checklist) =>
                checklist.id === id ? { ...checklist, show: !checklist.show } : checklist
            )
        );
        // Update card state and propagate change
        if (card) {
            const updatedCard = { ...card, CheckList: checklists };
            setCard(updatedCard);
            updateCard(updatedCard); // Pass the updated card back to the parent
        }
    };

    const handleAddChecklist = async (checklist: CheckList) => {
        await AddCheckList(checklist, cid, lid, list?.board);
        const updatedChecklists = [...checklists, checklist];
        setChecklists(updatedChecklists);
        if (card) {
            const updatedCard = { ...card, CheckList: updatedChecklists };
            setCard(updatedCard);
            updateCard(updatedCard); // Pass the updated card back to the parent
        }
    };

    const handleRemoveCheckList = async (ch_id: string) => {
        await RemoveCheckList(ch_id, cid, lid, list.board);
        const updatedChecklists = checklists.filter(ch => ch.id != ch_id);
        setChecklists(updatedChecklists);
        if (card) {
            const updatedCard = { ...card, CheckList: updatedChecklists};
            setCard(updatedCard);
            updateCard(updatedCard);
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div ref={popupRef} className="bg-white p-7 rounded shadow-lg w-auto relative">
                <div className="mb-2"> 
                    <div className="font-bold text-2xl mb-3 text-center">Checklist</div>
                        {
                            checklists.length != 0 ? 
                            <div>
                            <label htmlFor="progress" className='inline-block w-[50px] text-xl font-bold mb-3 mr-3'>{Math.round(checklists.filter(c => c.show).length / checklists.length * 100)}%</label>
                            <progress id="progress"
                            className='[&::-webkit-progress-bar]:rounded [&::-webkit-progress-value]:rounded [&::-webkit-progress-bar]:bg-slate-200 [&::-webkit-progress-value]:bg-orange-500' 
                            value={checklists.filter(c => c.show === true).length / checklists.length} max={1}></progress></div>
                             : null
                        }
                    {checklists.map((checklist) => (
                        <li key={checklist.id} className="flex flex-row mb-1 gap-3 justify-start">
                            <input
                                type="checkbox"
                                checked={checklist.show}
                                onChange={() => handleCheckboxChange(checklist.id, checklist.show)}
                            />
                            <div className='text-xl'>{checklist.name}</div>
                            <button onClick={() => {handleRemoveCheckList(checklist.id)}} className="p-0 ml-auto">
                                <Image src="/Image/delete.png" alt="Delete" width={25} height={25} />
                            </button>
                        </li>
                    ))}
                </div>
                <div className="flex justify-left space-x-3">
                    <button
                        onClick={() => setIsAddChecklistPopupOpen(true)}
                        className="bg-orange-500 text-white p-2 px-4 font-bold rounded"
                    >
                        Add Checklist
                    </button>
                </div>
                {isAddChecklistPopupOpen && (
                    <AddChecklistPopup
                        onClose={() => setIsAddChecklistPopupOpen(false)}
                        onSave={handleAddChecklist}
                    />
                )}
            </div>
        </div>
    );
};

export default CardChecklist;
