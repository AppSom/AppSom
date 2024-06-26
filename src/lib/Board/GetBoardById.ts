import { Board, BoardJSON } from "../../../interface";

export default async function GetBoardById (bid: string) {
    const file = await fetch(`/Storage/Board/board.json`,
    {
        headers: {
        'Content-Type': 'application/json'
        },
        next: {
            tags: ["board"]
        }
    }
    );
    const data: BoardJSON = await file.json();
    const board = data.data.find(b => b.id === bid);
    return board;
}