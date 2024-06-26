'use client'

import { useEffect, useState } from "react";
import { Board, List, Card } from "../../../../../interface";
import GetBoardById from "@/lib/Board/GetBoardById";
import BoardNav from "@/components/ControlSystem/boardNav";
import CreateList from "@/lib/List/CreateList";
import CreateCard from "@/lib/Card/CreateCard";
import CardList from "@/components/Board/CardList";
import Image from "next/image";
import AddListPopup from "@/components/Board/AddListPopup";
import EditListPopup from "@/components/Board/EditListPopup";
import ViewListPopup from "@/components/Board/ViewListPopup";
import ListOptionsPopup from "@/components/Board/ListOptionsPopup";
import DeleteListPopup from "@/components/Board/DeleteListPopup";
import AddCardPopup from "@/components/Board/AddCardPopup";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import UpdateBoardById from "@/lib/Board/UpdateBoardById";
import UpdateListById from "@/lib/List/UpdateListById";
import DeleteListById from "@/lib/List/DeleteListById";
import CheckOwner from "@/lib/CheckOwner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EditCardPopup from "@/components/Board/EditCardPopup";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdateCardById from "@/lib/Card/UpdateCardById";
import GetListById from "@/lib/List/GetListById";
import 'leaflet/dist/leaflet.css';

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
    const {data: session} = useSession();
    const router = useRouter();
    if (!session) {
        return null;
    }

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
        if (!CheckOwner(board.owner, session.user.id)) {
            return;
        }
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
        if (!CheckOwner(board.owner, session.user.id)) {
            return;
        }
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
        if (!CheckOwner(board.owner, session.user.id)) {
            return;
        }
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
        if (!CheckOwner(board.owner, session.user.id)) {
            return;
        }
        console.log("Edit list:", selectedList?.id);
        setShowOptionsPopup(false);
        setShowEditListPopup(true);
    };

    const handleAddCard = (listId: string) => {
        if (!CheckOwner(board.owner, session.user.id)) {
            return;
        }
        setSelectedList(lists.find((list) => list.id === listId) || null);
        setShowAddCardPopup(true);
    };

    const handleSaveCard = async (newCard: Card) => {
        if (!CheckOwner(board.owner, session.user.id)) {
            return;
        }
        await CreateCard(newCard, newCard.list, board.id);
        const updatedBoard = await GetBoardById(params.bid);
        if (!updatedBoard) {
            return;
        }
        setLists(updatedBoard.lists);
        setBoard(updatedBoard);
        setShowAddCardPopup(false);
    };

    const handleEditCardClick = (card: Card) => {
        if (!CheckOwner(board.owner, session.user.id)) {
            return;
        }
        setSelectedCard(card);
        setShowEditCardPopup(true);
        console.log(card);
    };

    const handleSaveEditCard = async (name: string, description: string, dateStart: string, dateEnd: string, color: string, image: string, location: string) => {
        if (!CheckOwner(board.owner, session.user.id)) {
            return;
        }
        if (!selectedCard) {
            return;
        }
        const updatedCard: Card = {
            id: selectedCard.id,
            name: name,
            description: description,
            date_start: dateStart,
            date_end: dateEnd,
            color: color,
            member: selectedCard.member,
            list: selectedCard.list,
            image: image,
            map: location,
            CheckList: selectedCard.CheckList
        }
        await UpdateCardById(updatedCard, selectedCard.id, selectedCard.list, params.bid);
        const updatedBoard = await GetBoardById(params.bid);
        if (!updatedBoard) {
            return;
        }
        setLists(updatedBoard.lists);
        setBoard(updatedBoard);
        setShowEditCardPopup(false);
    };

    const handleDeleteListClick = () => {
        if (!CheckOwner(board.owner, session.user.id)) {
            return;
        }
        console.log("Delete list:", selectedList?.id);
        setShowOptionsPopup(false);
        setShowDeleteListPopup(true);
    };

    const handleDeleteList = async (listId: string) => {
        if (!CheckOwner(board.owner, session.user.id)) {
            return;
        }
        if (!board) return;

        try {
            await DeleteListById(listId, board.id);
            const updatedBoard = await GetBoardById(params.bid);
            if (!updatedBoard) {
                return;
            }
            setLists(updatedBoard.lists);
            setBoard(updatedBoard);
            setShowDeleteListPopup(false);
        } catch (error) {
            console.error("Failed to delete list:", error);
        }
    };

    if (!board.member.includes(session.user.id)) {
        router.push('/board');
    }

    return (
        <div className="flex flex-col flex-wrap bg-somon min-h-screen ml-64 overflow-auto">
            {
                board.member.includes(session.user.id) ?

            
            <div>
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
                                            <CardList list={l} onEditCard={handleEditCardClick} onAddCard={handleAddCard} permission={CheckOwner(board.owner, session.user.id)} />
                                            {showOptionsPopup && selectedList?.id === l.id && (
                                                <ListOptionsPopup
                                                    onClose={() => setShowOptionsPopup(false)}
                                                    onView={handleViewList}
                                                    onEdit={handleEditListClick}
                                                    onAddCard={() => handleAddCard(l.id)}
                                                    onDelete={handleDeleteListClick}
                                                    permission={CheckOwner(board.owner, session.user.id)}
                                                />
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            {
                                CheckOwner(board.owner, session.user.id) ? 
                                <button
                                    className="p-5 bg-sombar hover:bg-som font-bold shadow-inner drop-shadow-xl rounded w-[200px] text-xl"
                                    onClick={() => setShowAddListPopup(true)}
                                >
                                    + Add a List
                                </button> : null
                            }
                            
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            {showAddListPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15">
                <AddListPopup
                    onClose={() => setShowAddListPopup(false)}
                    onSave={handleAddList}
                />
                </div>
            )}
            {showEditListPopup && selectedList && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15">
                <EditListPopup
                    onClose={() => setShowEditListPopup(false)}
                    onSave={(name, description) => handleEditList(selectedList.id, name, description)}
                    listId={selectedList.id}
                    listName={selectedList.name}
                    listDescription={selectedList.description}
                />
                </div>
            )}
            {showViewListPopup && selectedList && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15">
                <ViewListPopup
                    onClose={() => setShowViewListPopup(false)}
                    listName={selectedList.name}
                    listDescription={selectedList.description}
                />
                </div>
            )}
            {showDeleteListPopup && selectedList && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15">
                <DeleteListPopup
                    onClose={() => setShowDeleteListPopup(false)}
                    onDelete={() => handleDeleteList(selectedList.id)}
                />
                </div>
            )}
            {showAddCardPopup && selectedList && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15">
                <AddCardPopup
                    listId={selectedList.id}
                    onClose={() => setShowAddCardPopup(false)}
                    onSave={handleSaveCard}
                />
                </div>
            )}
            {
            showEditCardPopup && selectedCard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15">
                <EditCardPopup
                    card={selectedCard}
                    onClose={() => setShowEditCardPopup(false)}
                    onSave={handleSaveEditCard}
                />
                </div>
            )}            
        </div> 
            : null
        }
        <ToastContainer />
        </div>
    );
};

export default BoardIdPage;
