import { useEffect, useState } from "react";
import { Card, List, Template } from "../../../interface";
import { Droppable, Draggable } from "react-beautiful-dnd";
import CardOptionsPopup from "./CardOptionsPopup";
import ViewCardPopup from "./ViewCardPopup";
import DeleteCardPopup from "./DeleteCardPopup";
import CardMemberPopup from "./CardMemberPopup";
import DeleteCardById from "@/lib/Card/DeleteCardById";
import CardChecklist from "./CardChecklist";
import AddCardToTemplatePopup from "../Template/AddCardToTemplatePopup";
import { useSession } from "next-auth/react";

interface CardListProps {
    list: List;
    onEditCard: (card: Card) => void;
    onAddCard: (listId: string) => void;
    permission: boolean;
}

export default function CardList({ list, onEditCard, onAddCard, permission }: CardListProps) {
    const [cards, setCards] = useState<Card[]>(list.cards);
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupPosition, setPopupPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [viewPopupVisible, setViewPopupVisible] = useState(false);
    const [deletePopupVisible, setDeletePopupVisible] = useState(false);
    const [memberPopupVisible, setMemberPopupVisible] = useState(false);
    const [checklistPopupVisible, setChecklistPopupVisible] = useState(false);
    const [addCardToTemplatePopupVisible, setAddCardToTemplatePopupVisible] = useState(false);
    const { data: session } = useSession();
    if (!session) {
        return null;
      }

    useEffect(() => {
        setCards(list.cards);
    }, [list.cards]);

    const handleCardClick = (card: Card, event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
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
        setViewPopupVisible(true);
        handleClosePopup();
    };

    const handleCloseViewPopup = () => {
        setViewPopupVisible(false);
    };

    const handleEdit = () => {
        if (selectedCard) {
            onEditCard(selectedCard);
        }
        handleClosePopup();
    };

    const handleDelete = () => {
        console.log("Delete card:", selectedCard);
        setDeletePopupVisible(true);
        handleClosePopup();
    };

    const onDeleteHandler = async () => {
        if (!selectedCard) {
            return;
        }
        await DeleteCardById(selectedCard.id, selectedCard.list, list.board);
        setCards(cards.filter(c => c.id !== selectedCard.id));
        setDeletePopupVisible(false);
    };

    const handleMemberCard = () => {
        setMemberPopupVisible(true);
        handleClosePopup();
    };

    const handleCloseMemberPopup = () => {
        setMemberPopupVisible(false);
    };

    const handleCardUpdate = (updatedCard: Card) => {
        setCards(prevCards => prevCards.map(card => card.id === updatedCard.id ? updatedCard : card));
    };

    const handleChecklist = () => {
        setChecklistPopupVisible(true);
        handleClosePopup();
    };

    const handleCloseChecklistPopup = () => {
        setChecklistPopupVisible(false);
    };

    const handleSaveAsTemplate = () => {
        setAddCardToTemplatePopupVisible(true);
        handleClosePopup();
    };

    const handleCloseAddCardToTemplatePopup = () => {
        setAddCardToTemplatePopupVisible(false);
    };

    const templateCard = (card: Card) => {
        const myCard: Template = {
            id: crypto.randomUUID(),
            name: card.name,
            description: card.description,
            date_start: card.date_start,
            date_end: card.date_end,
            color: card.color,
            image: card.image || "",
            map: card.map,
            userId: session.user.id
        }
        return myCard;
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
                    {viewPopupVisible && selectedCard && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15">
                            <ViewCardPopup
                                onClose={handleCloseViewPopup}
                                cid={selectedCard.id}
                                lid={selectedCard.list}
                                updateCard={handleCardUpdate}
                            />
                        </div>
                    )}
                    {deletePopupVisible && selectedCard && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15">
                            <DeleteCardPopup
                                onClose={() => setDeletePopupVisible(false)}
                                onDelete={onDeleteHandler}
                            />
                        </div>
                    )}
                    {memberPopupVisible && selectedCard && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15">
                            <CardMemberPopup
                                cid={selectedCard.id}
                                lid={selectedCard.list}
                                onClose={handleCloseMemberPopup}
                            />
                        </div>
                    )}
                    {checklistPopupVisible && selectedCard && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15">
                            <CardChecklist
                                onClose={handleCloseChecklistPopup}
                                cid={selectedCard.id}
                                lid={selectedCard.list}
                                updateCard={handleCardUpdate}
                            />
                        </div>
                    )}
                    {addCardToTemplatePopupVisible && selectedCard && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15">
                            <AddCardToTemplatePopup
                                onClose={handleCloseAddCardToTemplatePopup}
                                card={templateCard(selectedCard)}
                            />
                        </div>
                    )}
                </div>
            )}
        </Droppable>
    );
}
