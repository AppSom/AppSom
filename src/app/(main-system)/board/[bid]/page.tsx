'use client'

import { useEffect, useState } from "react";
import { Board, List, Card } from "../../../../../interface";
import GetBoardById from "@/lib/GetBoardById";
import BoardNav from "@/components/ControlSystem/boardNav";
import CreateList from "@/lib/CreateList";
import CreateCard from "@/lib/CreateCard";
import CardList from "@/components/Board/CardList";
import Image from "next/image";
import AddListPopup from "@/components/Board/AddListPopup";
import EditListPopup from "@/components/Board/EditListPopup";
import ViewListPopup from "@/components/Board/ViewListPopup";
import ListOptionsPopup from "@/components/Board/ListOptionsPopup";
import DeleteListPopup from "@/components/Board/DeleteListPopup";
import AddCardPopup from "@/components/Board/AddCardPopup";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import UpdateBoardById from "@/lib/UpdateBoardById";
import UpdateListById from "@/lib/UpdateListById";
import DeleteListById from "@/lib/DeleteListById";

interface BoardIdPageProps {
    params: {
        bid: string;
    };
}

const BoardIdPage: React.FC<BoardIdPageProps> = ({ params }) => {
    const [board, setBoard] = useState<Board | null>(null);
    const [lists, setLists] = useState<List[]>([]);
    const [showAddListPopup, setShowAddListPopup] = useState<boolean>(false);
    const [showAddCardPopup, setShowAddCardPopup] = useState<boolean>(false);
    const [showEditListPopup, setShowEditListPopup] = useState<boolean>(false);
    const [showViewListPopup, setShowViewListPopup] = useState<boolean>(false);
    const [showOptionsPopup, setShowOptionsPopup] = useState<boolean>(false);
    const [showDeleteListPopup, setShowDeleteListPopup] = useState<boolean>(false);
    const [showEditCardPopup, setShowEditCardPopup] = useState<boolean>(false);
    const [selectedList, setSelectedList] = useState<List | null>(null);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);

    useEffect(() => {
        const loadList = async () => {
            const board = await GetBoardById(params.bid);
            if (board) {
                console.log("Board loaded:", board);
                setBoard(board);
                setLists(board.lists);
            } else {
                console.error("Failed to load board");
            }
        };
        loadList();
    }, [params.bid]);

    if (!board) {
        return null;
    }

    const handleAddList = (name: string, description: string) => {
        const uuid = crypto.randomUUID();
        const newList: List = {
            id: uuid,
            name,
            description,
            cards: [],
            board: params.bid,
        };
        console.log("Adding new list:", newList);
        CreateList(newList, params.bid);
        setLists([...lists, newList]);
    };

    const handleEditList = async (id: string, name: string, description: string) => {
        const updatedLists = lists.map(list => 
            list.id === id ? { ...list, name, description } : list
        );
        const updatedList = updatedLists.find(list => list.id === id);
        setLists(updatedLists);
        const updatedBoard = { ...board, lists: updatedLists };
        setBoard(updatedBoard);

        if (updatedList) {
            await UpdateListById(updatedList, id, board.id);
        }

        await UpdateBoardById(board.id, updatedBoard);
    };

    const handleDragEnd = async (result: DropResult) => {
        const { destination, source, type } = result;
        console.log("Drag result:", result);

        if (!destination) return;

        if (type === "list") {
            const newLists = Array.from(lists);
            const [movedList] = newLists.splice(source.index, 1);
            newLists.splice(destination.index, 0, movedList);
            setLists(newLists);
            const updatedBoard = { ...board, lists: newLists };
            setBoard(updatedBoard);
            await UpdateBoardById(board.id, updatedBoard);
        } else {
            const sourceListIndex = lists.findIndex((list) => list.id === source.droppableId);
            const destinationListIndex = lists.findIndex((list) => list.id === destination.droppableId);

            if (sourceListIndex === -1 || destinationListIndex === -1) return;

            const sourceCards = Array.from(lists[sourceListIndex].cards);
            const [movedCard] = sourceCards.splice(source.index, 1);

            if (source.droppableId === destination.droppableId) {
                sourceCards.splice(destination.index, 0, movedCard);
                const newLists = lists.map((list, index) =>
                    index === sourceListIndex ? { ...list, cards: sourceCards } : list
                );
                setLists(newLists);
                const updatedBoard = { ...board, lists: newLists };
                setBoard(updatedBoard);
                await UpdateBoardById(board.id, updatedBoard);
            } else {
                const destinationCards = Array.from(lists[destinationListIndex].cards);
                destinationCards.splice(destination.index, 0, movedCard);
                const newLists = lists.map((list, index) => {
                    if (index === sourceListIndex) {
                        return { ...list, cards: sourceCards };
                    } else if (index === destinationListIndex) {
                        return { ...list, cards: destinationCards };
                    } else {
                        return list;
                    }
                });
                setLists(newLists);
                const updatedBoard = { ...board, lists: newLists };
                setBoard(updatedBoard);
                await UpdateBoardById(board.id, updatedBoard);
            }
        }
    };

    const handleOptionsClick = (list: List) => {
        setSelectedList(list);
        setShowOptionsPopup(true);
    };

    const handleViewList = () => {
        console.log("View list:", selectedList?.id);
        setShowOptionsPopup(false);
        setShowViewListPopup(true);
    };

    const handleEditListClick = () => {
        console.log("Edit list:", selectedList?.id);
        setShowOptionsPopup(false);
        setShowEditListPopup(true);
    };

    const handleAddCard = (listId: string) => {
        setSelectedList(lists.find((list) => list.id === listId) || null);
        setShowAddCardPopup(true);
    };

    const handleSaveCard = (newCard: Card) => {
        const updatedLists = lists.map((list) => {
            if (list.id === newCard.list) {
                return { ...list, cards: [...list.cards, newCard] };
            }
            return list;
        });

        setLists(updatedLists);

        const updatedBoard = { ...board, lists: updatedLists };
        setBoard(updatedBoard);

        CreateCard(newCard, newCard.list, board.id);
        UpdateBoardById(board.id, updatedBoard);

        setShowAddCardPopup(false);
    };

    const handleEditCardClick = (card: Card) => {
        setSelectedCard(card);
        setShowEditCardPopup(true);
    };

    const handleSaveEditCard = (updatedCard: Card) => {
        const updatedLists = lists.map((list) => {
            if (list.id === updatedCard.list) {
                const updatedCards = list.cards.map((card) =>
                    card.id === updatedCard.id ? updatedCard : card
                );
                return { ...list, cards: updatedCards };
            }
            return list;
        });

        setLists(updatedLists);
        const updatedBoard = { ...board, lists: updatedLists };
        setBoard(updatedBoard);
        setShowEditCardPopup(false);
    };

    const handleDeleteListClick = () => {
        console.log("Delete list:", selectedList?.id);
        setShowOptionsPopup(false);
        setShowDeleteListPopup(true);
    };

    const handleDeleteList = async (listId: string) => {
        if (!board) return;

        try {
            await DeleteListById(listId, board.id);
            const updatedLists = lists.filter(list => list.id !== listId);
            const updatedBoard = { ...board, lists: updatedLists };
            setBoard(updatedBoard);
            setLists(updatedLists);
            setShowDeleteListPopup(false);
        } catch (error) {
            console.error("Failed to delete list:", error);
        }
    };

    return (
        <main className="flex flex-col bg-somon min-h-screen ml-64">
            <BoardNav board={board} />
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="all-lists" direction="horizontal" type="list">
                    {(provided) => (
                        <div
                            className="flex flex-row justify-start items-start gap-10 p-10"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {lists.map((l, index) => (
                                <Draggable key={l.id} draggableId={l.id} index={index}>
                                    {(provided) => (
                                        <div
                                            className="relative rounded bg-[#EFEFEF] p-5 w-[200px] flex flex-col shadow-xl"
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                        >
                                            <div className="flex flex-row justify-between items-center mb-2">
                                                <h1 className="font-bold text-left text-xl">{l.name}</h1>
                                                <Image
                                                    src="/Image/dotdotdot.png"
                                                    alt="Options"
                                                    width={40}
                                                    height={30}
                                                    onClick={() => handleOptionsClick(l)}
                                                />
                                            </div>
                                            <CardList list={l} onEditCard={handleEditCardClick} onAddCard={handleAddCard} />
                                            {showOptionsPopup && selectedList?.id === l.id && (
                                                <ListOptionsPopup
                                                    onClose={() => setShowOptionsPopup(false)}
                                                    onView={handleViewList}
                                                    onEdit={handleEditListClick}
                                                    onAddCard={() => handleAddCard(l.id)}
                                                    onDelete={handleDeleteListClick}
                                                />
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            <button
                                className="p-5 bg-sombar hover:bg-som font-bold shadow-inner drop-shadow-xl rounded w-[200px]"
                                onClick={() => setShowAddListPopup(true)}
                            >
                                + Add a List
                            </button>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            {showAddListPopup && (
                <AddListPopup
                    onClose={() => setShowAddListPopup(false)}
                    onSave={handleAddList}
                />
            )}
            {showEditListPopup && selectedList && (
                <EditListPopup
                    onClose={() => setShowEditListPopup(false)}
                    onSave={(name, description) => handleEditList(selectedList.id, name, description)}
                    listId={selectedList.id}
                    listName={selectedList.name}
                    listDescription={selectedList.description}
                />
            )}
            {showViewListPopup && selectedList && (
                <ViewListPopup
                    onClose={() => setShowViewListPopup(false)}
                    listName={selectedList.name}
                    listDescription={selectedList.description}
                />
            )}
            {showDeleteListPopup && selectedList && (
                <DeleteListPopup
                    onClose={() => setShowDeleteListPopup(false)}
                    onDelete={() => handleDeleteList(selectedList.id)}
                />
            )}
            {showAddCardPopup && selectedList && (
                <AddCardPopup
                    listId={selectedList.id}
                    onClose={() => setShowAddCardPopup(false)}
                    onSave={handleSaveCard}
                />
            )}
        </main>
    );
};

export default BoardIdPage;
