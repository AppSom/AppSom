import { useEffect, useState } from "react";
import { Board } from "../../../interface";
import Image from "next/image";
import UpdateBoardById from "@/lib/UpdateBoardById";
import DeleteBoardById from "@/lib/DeleteBoardByID";
import { useSession } from "next-auth/react";
import EditBoardPopup from "../Board/EditBoardPopup";
import DeleteBoardPopup from "../Board/DeleteBoardPopup";
import MemberListPopup from "../Board/MemberListPopup";

export default function BoardNav({ board }: { board: Board }) {
    
    const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
    const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
    const [showMemberPopup, setShowMemberPopup] = useState<boolean>(false);
    const { data: session } = useSession();

    if (!session) {
        return null;
    }
    
    const [isStarActive, setIsStarActive] = useState<boolean>(board.favorite.includes(session?.user?.id || ""));

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
    };

    const handleEditSave = async (updatedBoard: Board) => {
        await UpdateBoardById(board.id, updatedBoard);
        setShowEditPopup(false);
    };

    const handleDelete = async () => {
        await DeleteBoardById(board.id);
        setShowDeletePopup(false);
    };

    return (
        <div className="bg-orange-300 w-full h-8 flex flex-row justify-between items-center px-8 py-9">
            <div className="flex flex-row gap-3 items-center">
                <h1 className="font-semibold text-3xl">{board.name} {board.owner === session.user.id ? " (Owner)" : " (Member)"}</h1>
                <Image 
                    src={isStarActive ? "/Image/star_Active.png" : "/Image/star_notActive.png"} 
                    alt="Star" 
                    width={40} 
                    height={40} 
                    onClick={handleStarClick}
                />
            </div>
            
            <div className="flex flex-row gap-3">
                <div 
                    className="flex flex-row gap-2 items-center bg-gray-300 py-2 px-3 rounded cursor-pointer"
                    onClick={() => setShowMemberPopup(true)}
                >
                    <Image src="/Image/member.png" alt="Member" width={32} height={32}/>
                    <div className="font-semibold">Member</div>
                </div>
                <Image src="/Image/edit.png" alt="Edit" width={50} height={50} onClick={() => setShowEditPopup(true)}/>
                <Image src="/Image/delete.png" alt="Delete" width={50} height={50} onClick={() => setShowDeletePopup(true)}/>
            </div>

            {showEditPopup && (
                <EditBoardPopup
                    board={board}
                    onClose={() => setShowEditPopup(false)}
                    onSave={handleEditSave}
                />
            )}
            {showDeletePopup && (
                <DeleteBoardPopup
                    onClose={() => setShowDeletePopup(false)}
                    onDelete={handleDelete}
                />
            )}
            {showMemberPopup && (
                <MemberListPopup
                    board={board}
                    onClose={() => setShowMemberPopup(false)}
                />
            )}
        </div>
    );
}
