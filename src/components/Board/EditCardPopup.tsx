"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "../../../interface";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

interface EditCardPopupProps {
    card: Card;
    onClose: () => void;
    onSave: (name: string, description: string, dateStart: string, dateEnd: string, color: string, image: string, location: string) => void;
}

const EditCardPopup: React.FC<EditCardPopupProps> = ({ card, onClose, onSave }) => {
    const [name, setName] = useState<string>(card.name);
    const [description, setDescription] = useState<string>(card.description);
    const [dateStart, setDateStart] = useState<string>(card.date_start);
    const [dateEnd, setDateEnd] = useState<string>(card.date_end);
    const [color, setColor] = useState<string>(card.color);
    const [image, setImage] = useState<string>(card.image);
    const [location, setLocation] = useState<string>(card.map);
    const lat = parseFloat(location.split(',')[0]);
    const lon = parseFloat(location.split(',')[1]);
    const [position, setPosition] = useState([lat, lon]);
    const popupRef = useRef<HTMLDivElement>(null);

    const handleSave = () => {
        if (!name || !description) {
            toast.error('Please fill in all the Card detail', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        else if (new Date(dateEnd) < new Date(dateStart)) {
            toast.error('Your Date is Wrong', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        else{
            toast.success('Edit Card Success', {
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
        onSave( name, description, dateStart, dateEnd, color, image, location );
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

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const convertBase64ToImage = (base64: string) => {
        return (
            <div className="flex justify-center">
                <img src={base64} alt="Uploaded" className="h-24 w-auto"/>
            </div>
        )
    };

    const ClickableMarker = () => {
        const map = useMapEvents({
            click(e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
                setLocation(`${e.latlng.lat},${e.latlng.lng}`)
            }
        });

        return (
            position ? 
            <Marker position={[position[0], position[1]]}/> 
            : null
        )
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div ref={popupRef} className="bg-white p-5 rounded shadow-lg w-100 relative z-50 flex flex-col">
                <h2 className="text-xl font-bold mb-5 text-center text-black">Edit Card</h2>
                <div className="flex flex-row gap-5">
                    <div>
                        <input
                            type="text"
                            placeholder="Card Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mb-3 p-2 border rounded border-gray-500 text-black"
                        />
                        <textarea
                            placeholder="Card Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full mb-3 p-2 border rounded border-gray-500 text-black"
                        />
                        <div className="flex justify-between mb-3">
                            <input
                                type="date"
                                value={dateStart}
                                onChange={(e) => setDateStart(e.target.value)}
                                className="w-1/2 mr-1 p-2 border rounded border-gray-500 text-black"
                                max={dateEnd}
                            />
                            <input
                                type="date"
                                value={dateEnd}
                                onChange={(e) => setDateEnd(e.target.value)}
                                className="w-1/2 ml-1 p-2 border rounded border-gray-500 text-black"
                                min={dateStart}
                            />
                        </div>
                        <div className="flex justify-center space-x-2 mb-3">
                            {['orange', 'green', 'blue', 'purple', 'gray'].map((clr) => (
                                <button
                                    key={clr}
                                    onClick={() => setColor(clr)}
                                    className={`w-10 h-10 rounded-full ${clr === color ? 'border-2 border-black' : ''}`}
                                    style={{ backgroundColor: clr }}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="mb-3">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full mb-3 p-2 border rounded border-gray-500 text-black"
                            />
                            {image && convertBase64ToImage(image)}
                        </div>
                        {location && (
                            <div>
                                <MapContainer className="w-full h-36 mb-3" center={[position[0], position[1]]} zoom={16}>
                                    <ClickableMarker />
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                </MapContainer>  
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={`${position[0]},${position[1]}`}
                                    disabled
                                    className="w-full mb-3 p-2 border rounded border-gray-500 text-black"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center space-x-3">
                    <button
                        onClick={handleSave}
                        className="bg-orange-500 text-white p-2 px-10 font-bold rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default EditCardPopup;
