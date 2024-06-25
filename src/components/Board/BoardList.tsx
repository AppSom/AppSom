'use client';

import { useEffect, useState } from "react";
import { Board, BoardJSON } from "../../../interface";
import GetBoards from "@/lib/GetBoards";
import CreateBoard from "@/lib/CreateBoard";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AddBoardPopup from "./AddBoardPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCrown } from "@fortawesome/free-solid-svg-icons";

export default function BoardList({ starred }: { starred: boolean }) {
    const [boards, setBoards] = useState<Board[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("a-z");
    const [showPopup, setShowPopup] = useState(false);
    const { data: session } = useSession();

    if (!session) {
        return null;
    }

    useEffect(() => {
        const LoadBoards = async () => {
            const data: BoardJSON = await GetBoards();
            const filteredBoards = starred === true ?
                data.data.filter(b => Array.isArray(b.favorite) && b.favorite.includes(session.user.id) && b.member.includes(session.user.id))
                : data.data.filter(b => b.owner === session.user.id || b.member.includes(session.user.id));
            setBoards(filteredBoards);
        };
        LoadBoards();
    }, [starred, session.user.id]);

    const sortedBoards = [...boards].sort((a, b) => {
        if (sortOrder === "a-z") {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });

    const filteredBoards = sortedBoards.filter(board =>
        board.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateBoard = async (name: string, description: string, color: string) => {
        const newBoard: Board = {
            id: crypto.randomUUID(),
            name,
            description,
            lists: [],
            favorite: [],
            owner: session.user.id,
            member: [session.user.id],
            color
        };
        await CreateBoard(newBoard);
        setBoards([...boards, newBoard]);
    };

    return (
        <div className="flex flex-col">
            <div className="p-10 text-3xl font-bold">
                Board
            </div>
            <div className="flex flex-row px-10 font-semibold text-xl justify-between">
                <div>
                    <div className="pb-2">Sort By</div>
                    <select
                        className="px-16 py-2 rounded border-2 border-gray-500"
                        onChange={(e) => setSortOrder(e.target.value)}
                        value={sortOrder} >
                        <option value="a-z">A-Z</option>
                        <option value="z-a">Z-A</option>
                    </select>
                </div>
                <div>
                    <div className="pb-2">Search</div>
                    <input
                        className="p-2 rounded border-2 border-gray-500 text-lg"
                        type="text"
                        placeholder="Search boards.."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex flex-wrap flex-row justify-start gap-10 p-10">
                <div className="bg-orange-400 rounded w-[300px] h-[150px] flex items-center justify-center">
                    <button className="w-full h-full p-5" onClick={() => setShowPopup(true)}>
                        <h1 className="text-white font-semibold">Create Board</h1>
                    </button>
                </div>
                {filteredBoards.length > 0 ?
                    filteredBoards.map((b) =>
                        <div key={b.id} className={`rounded w-[300px] h-[150px] relative z-0`} style={{ backgroundColor: b.color }}>
                            {Array.isArray(b.favorite) && b.favorite.includes(session.user.id) && (
                                <FontAwesomeIcon
                                    icon={faStar}
                                    className="absolute top-2 right-2 text-yellow-300"
                                />
                            )}
                            {b.owner === session.user.id && (
                                <FontAwesomeIcon
                                    icon={faCrown}
                                    className="absolute bottom-2 right-2 text-yellow-300"
                                />
                            )}
                            <Link href={`/board/${b.id}`}>
                                <button className="absolute inset-0 flex items-center justify-center p-5">
                                    <h1 className="text-white font-semibold">{b.name}</h1>
                                </button>
                            </Link>
                        </div>
                    ) :
                    null
                }
            </div>

            {showPopup && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="relative bg-white p-8 rounded shadow-lg z-50">
                            <AddBoardPopup
                                onClose={() => setShowPopup(false)}
                                onSave={handleCreateBoard}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
