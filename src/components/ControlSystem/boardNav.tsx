import { useEffect, useState } from "react";
import { Board } from "../../../interface";
import Image from "next/image";
import UpdateBoardById from "@/lib/Board/UpdateBoardById";
import DeleteBoardById from "@/lib/Board/DeleteBoardById";
import { useSession } from "next-auth/react";
import EditBoardPopup from "../Board/EditBoardPopup";
import DeleteBoardPopup from "../Board/DeleteBoardPopup";
import MemberListPopup from "../Board/MemberListPopup";
import { useRouter } from "next/navigation";
import CheckOwner from "@/lib/CheckOwner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BoardNav({ board }: { board: Board }) {
    const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
    const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
    const [showMemberPopup, setShowMemberPopup] = useState<boolean>(false);
    const [currentBoard, setCurrentBoard] = useState<Board>(board);
    const router = useRouter();
    const { data: session } = useSession();

    if (!session) {
        return null;
    }
    const init = Object.values(board.favorite).includes(session.user.id);
    const [isStarActive, setIsStarActive] = useState<boolean>(init);

    useEffect(() => {
        board = currentBoard;
    }, [currentBoard]);

    const handleStarClick = async () => {
        const userId = session.user.id;
        const updatedFavorite = isStarActive
            ? board.favorite.filter((id) => id !== userId)
            : [...board.favorite, userId];

        const updatedBoard: Board = {
            ...board,
            favorite: updatedFavorite,
        };

        setIsStarActive(!isStarActive);
        await UpdateBoardById(board.id, updatedBoard);
        setCurrentBoard(updatedBoard);
    };

    const handleEditSave = async (updatedBoard: Board) => {
        if (!CheckOwner(board.owner, session.user.id)) {
            return alert("not owner");
        }
        await UpdateBoardById(board.id, updatedBoard);
        setShowEditPopup(false);
        setCurrentBoard(updatedBoard);
    };

    const handleDelete = async () => {
        if (!CheckOwner(board.owner, session.user.id)) {
            return alert("not owner");
        }
        await DeleteBoardById(board.id);
        setShowDeletePopup(false);
        router.push('/board');
        toast.success('Delete Board Success', {
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

    return (
        <div className="bg-sombar w-full h-8 flex flex-row justify-between items-center px-8 py-9">
            <div className="flex flex-row gap-3 items-center">
                <h1 className="font-semibold text-3xl">{currentBoard.name} {currentBoard.owner === session.user.id ? " (Owner)" : " (Member)"}</h1>
                <Image 
                    src={isStarActive ? "/Image/star_Active.png" : "/Image/star_notActive.png"} 
                    alt="Star" 
                    width={40} 
                    height={40} 
                    onClick={handleStarClick}
                />
            </div>
            {
                CheckOwner(board.owner, session.user.id) ? 
                    <div className="flex flex-row gap-3"> 
                    
                    <div 
                        className="flex flex-row gap-2 items-center bg-gray-300 py-2 px-3 rounded cursor-pointer"
                        onClick={() => setShowMemberPopup(true)}
                    >
                        <Image src="/Image/member.png" alt="Member" width={32} height={32}/>
                        <div className="font-semibold">Member</div>
                    </div>
                    <button onClick={() => setShowEditPopup(true)} className="p-0">
                        <Image src="/Image/edit.png" alt="Edit" width={50} height={50} />
                    </button>
                    <button onClick={() => setShowDeletePopup(true)} className="p-0">
                        <Image src="/Image/delete.png" alt="Delete" width={50} height={50} />
                    </button>
                    </div> :
                    null
            }
            {showEditPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15">
                    <EditBoardPopup
                        board={currentBoard}
                        onClose={() => setShowEditPopup(false)}
                        onSave={handleEditSave}
                    />
                </div>
            )}
            {showDeletePopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15">
                    <DeleteBoardPopup
                        onClose={() => setShowDeletePopup(false)}
                        onDelete={handleDelete}
                    />
                </div>
            )}
            {showMemberPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15">
                    <MemberListPopup
                        bid={currentBoard.id}
                        onClose={() => setShowMemberPopup(false)}
                    />
                </div>
            )}
        </div>
    );
}
