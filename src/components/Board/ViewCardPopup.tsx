import { useState, useEffect, useRef } from 'react';
import { Card, List, Board, User, CheckList } from '../../../interface';
import GetUserProfile from '@/lib/GetUserProfile';
import GetBoards from '@/lib/Board/GetBoards';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

interface ViewCardPopupProps {
    onClose: () => void;
    cid: string;
    lid: string;
    updateCard: (updatedCard: Card) => void;
}

const ViewCardPopup: React.FC<ViewCardPopupProps> = ({ onClose, cid, lid, updateCard }) => {
    const [card, setCard] = useState<Card | null>(null);
    const [list, setList] = useState<List | null>(null);
    const [board, setBoard] = useState<Board | null>(null);
    const [members, setMembers] = useState<User[]>([]);
    const [checklists, setChecklists] = useState<CheckList[]>([]);
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

    const convertBase64ToImage = (base64: string) => {
        return (
            <div className="flex justify-center">
                <img src={base64} alt="Uploaded" className="h-32 w-auto" />
            </div>
        );
    };

    let coordinates, latitude, longitude;
    if (card.map != "" && card.map) {
        coordinates = card.map.split(',');
        latitude = Number(coordinates[0]);
        longitude = Number(coordinates[1]);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div ref={popupRef} className="bg-white p-5 rounded shadow-lg w-auto relative">
                <div className="flex flex-row justify-between items-center mb-3">
                    <div className="font-bold text-3xl">{card.name}</div>
                    <div className="w-40 h-8 rounded-3xl" style={{ backgroundColor: card.color }}></div>
                </div>
                <div className="flex flex-row gap-5 flex-nowrap">
                    <div>
                        <div className="mb-3 text-xl break-words">{card.description}</div>
                        <div className="mb-3">
                            <strong>Date :</strong> {new Date(card.date_start).toLocaleDateString()} - {new Date(card.date_end).toLocaleDateString()}
                        </div>
                        <div className="mb-3 font-bold">Members</div>
                        <ul className="mb-3">
                            {members.map((member) => (
                                <li key={member.id} className="flex items-center mb-2">
                                    <img src={member.image} alt={member.name} className="w-8 h-8 rounded-full mr-2" />
                                    <div className="text-xl">{member.name}</div>
                                </li>
                            ))}
                        </ul>
                        <div className="mb-3">{card.image && convertBase64ToImage(card.image)}</div>
                    </div>
                    <div>
                        <div className="mb-3 font-bold text-center">Location</div>
                        {latitude && longitude ? (
                            <MapContainer className="w-[25vw] h-64 mb-3" center={[latitude, longitude]} zoom={16}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[latitude, longitude]}></Marker>
                            </MapContainer>
                        ) : (
                            <div className="text-center">* No map available *</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCardPopup;
