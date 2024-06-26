import { BoardJSON } from "../../../interface";

export default async function GetListById (bid: string, lid: string) {
    const file = await fetch(`/Storage/Board/board.json`,
    {
        headers: {
        'Content-Type': 'application/json'
        },
        next: {
            tags: ["list"]
        }
    }
    );
    const data: BoardJSON = await file.json();
    const list = data.data.find(b => b.id === bid)?.lists.find(l => l.id === lid);
    if (!list) {
        throw new Error("Status 404: No list is found");
    }
    return list;
}