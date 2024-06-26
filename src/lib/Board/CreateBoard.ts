import { Board } from "../../../interface";
import GetDataFromJson from "../GetDataFromJson";

export default async function CreateBoard(board: Board) {
    const response = await fetch('/api/board-api/create-board', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(board)
    });

    console.log(JSON.stringify(board));

    // if (response.ok) {
    //     alert("Board created and saved to JSON file");
    //     console.log(board);
    // } else {
    //     alert("Failed to save the board to JSON file");
    // }
    const boardData = await GetDataFromJson('Storage/Board/board.json');
    console.log(boardData);
}