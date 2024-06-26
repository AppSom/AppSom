import { Board } from "../../../interface";

export default async function UpdateBoardById (bid: string, board: Board) {
    const response = await fetch(`/api/board-api/update-board`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            data: board,
            bid: bid
        })
    });

    if(!response.ok) {
        throw new Error("Cannot update board");
    }
}