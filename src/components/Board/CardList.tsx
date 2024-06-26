import { useEffect, useState } from "react";
import { Card, List } from "../../../interface";
import { Droppable, Draggable } from "react-beautiful-dnd";
import CardOptionsPopup from "./CardOptionsPopup";
import { useSession } from "next-auth/react";

interface CardListProps {
    list: List;
    onEditCard: (card: Card) => void;
    onAddCard: (listId: string) => void;
    onViewCard: (card: Card) => void;
    onDeleteCard: (card: Card) => void;
    onMemberCard: (card: Card) => void;
    onChecklist: (card: Card) => void;
    onSaveAsTemplate: (card: Card) => void;
    permission: boolean;
}

export default function CardList({ list, onEditCard, onAddCard, onViewCard, onDeleteCard, onMemberCard, onChecklist, onSaveAsTemplate, permission }: CardListProps) {
    const [cards, setCards] = useState<Card[]>(list.cards);
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupPosition, setPopupPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const { data: session } = useSession();
    if (!session) {
        return null;
    }

    useEffect(() => {
        setCards(list.cards);
    }, [list.cards]);

    const handleCardClick = (card: Card, event: React.MouseEvent) => {
        setPopupPosition({
            top: event.clientY,
            left: event.clientX
        });
        setSelectedCard(card);
        setPopupVisible(true);
    };

    const handleClosePopup = () => {
        setPopupVisible(false);
    };

    const handleView = () => {
        if (selectedCard) {
            onViewCard(selectedCard);
        }
        handleClosePopup();
    };

    const handleEdit = () => {
        if (selectedCard) {
            onEditCard(selectedCard);
        }
        handleClosePopup();
    };

    const handleDelete = () => {
        if (selectedCard) {
            onDeleteCard(selectedCard);
        }
        handleClosePopup();
    };

    const handleMemberCard = () => {
        if (selectedCard) {
            onMemberCard(selectedCard);
        }
        handleClosePopup();
    };

    const handleChecklist = () => {
        if (selectedCard) {
            onChecklist(selectedCard);
        }
        handleClosePopup();
    };

    const handleSaveAsTemplate = () => {
        if (selectedCard) {
            onSaveAsTemplate(selectedCard);
        }
        handleClosePopup();
    };

    return (
        <Droppable droppableId={list.id} type="card">
            {(provided) => (
                <div
                    className="flex flex-col items-start gap-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                >
                    {cards.map((c, index) => (
                        <Draggable key={c.id} draggableId={c.id} index={index}>
                            {(provided) => (
                                <div
                                    className="bg-white shadow-lg w-full px-3 py-2 rounded flex flex-row items-center gap-2 hover:bg-gray-400"
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    onClick={(event) => handleCardClick(c, event)}
                                >
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: c.color }}
                                    ></div>
                                    <h1 className="font-semibold text-md">{c.name}</h1>
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                    {permission && (
                        <button onClick={() => onAddCard(list.id)}>
                            <h1 className="font-semibold text-lg">+ Add a Card</h1>
                        </button>
                    )}

                    {popupVisible && selectedCard && (
                        <CardOptionsPopup
                            onClose={handleClosePopup}
                            onView={handleView}
                            onEdit={handleEdit}
                            onMember={handleMemberCard}
                            onDelete={handleDelete}
                            onChecklist={handleChecklist}
                            onSaveAsTemplate={handleSaveAsTemplate}
                            position={popupPosition}
                            permission={permission}
                        />
                    )}
                </div>
            )}
        </Droppable>
    );
}
