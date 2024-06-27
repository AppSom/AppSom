import { useState, useEffect, useRef } from 'react';
import { Template } from '../../../interface';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

interface ViewTemplatePopupProps {
    onClose: () => void;
    template: Template;
}

const ViewTemplatePopup: React.FC<ViewTemplatePopupProps> = ({ onClose, template }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    console.log(template.name)

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const convertBase64ToImage = (base64: string) => {
        return (
            <div className="flex justify-center">
                <img src={base64} alt="Uploaded" className="h-32 w-auto" />
            </div>
        );
    };

    let coordinates, latitude, longitude;
    if (template.map) {
        coordinates = template.map.split(',');
        latitude = Number(coordinates[0]);
        longitude = Number(coordinates[1]);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black">
            <div ref={popupRef} className="bg-white p-5 rounded shadow-lg w-auto relative">
                <div className="flex flex-row justify-between items-center mb-3">
                    <div className="font-bold text-3xl">{template.name}</div>
                    <div className="w-40 h-8 rounded-3xl" style={{ backgroundColor: template.color }}></div>
                </div>
                <div className="flex flex-row gap-5 flex-nowrap">
                    <div>
                        <div className="mb-3 text-xl break-words">{template.description}</div>
                        <div className="mb-3">
                            <strong>Date :</strong> {new Date(template.date_start).toLocaleDateString()} - {new Date(template.date_end).toLocaleDateString()}
                        </div>
                        <div className="mb-3">{template.image && convertBase64ToImage(template.image)}</div>
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

export default ViewTemplatePopup;
