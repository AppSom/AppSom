import { useState, useEffect, useRef } from 'react';
import { Card, List, Board, User, UserJSON, BoardJSON } from '../../../interface';
import GetUserProfile from '@/lib/GetUserProfile';
import GetBoards from '@/lib/GetBoards';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

interface ViewCardPopupProps {
    onClose: () => void;
    cid: string;
    lid: string;
}

const ViewCardPopup: React.FC<ViewCardPopupProps> = ({ onClose, cid, lid }) => {
    const [card, setCard] = useState<Card | null>(null);
    const [list, setList] = useState<List | null>(null);
    const [board, setBoard] = useState<Board | null>(null);
    const [members, setMembers] = useState<User[]>([]);
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
                        cardData.member.map((userId) => GetUserProfile(userId))
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
        return <img src={base64} alt="Uploaded" />;
    };

    let coordinates = card.map.split(',');
    let latitude = Number(coordinates[0]);
    let longitude = Number(coordinates[1]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div ref={popupRef} className="bg-white p-5 rounded shadow-lg w-96 relative">
                <div className="flex flex-row justify-between items-center mb-3">
                    <div className="font-bold text-3xl">{card.name}</div>
                    <div
                        className="w-28 h-8 rounded-3xl"
                        style={{ backgroundColor: card.color }}
                    ></div>
                </div>
                <div className="mb-3 text-xl">{card.description}</div>
                <div className="mb-3">
                    <strong>Date :</strong> {new Date(card.date_start).toLocaleDateString()} - {new Date(card.date_end).toLocaleDateString()}
                </div>
                <div className="mb-3">
                    {card.image && convertBase64ToImage(card.image)}
                </div>
                <div className='mb-3 font-bold text-center'>Location</div>
                {
                    latitude && longitude ? <MapContainer className="w-full h-64" center={[latitude, longitude]} zoom={16}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[latitude, longitude]}></Marker>
                    </MapContainer> 
                    : 
                    <div className='text-center'>
                        * No map available *
                    </div>
                }
                
            </div>
        </div>
    );
};

export default ViewCardPopup;
