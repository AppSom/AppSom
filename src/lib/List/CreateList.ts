import { List } from "../../../interface";

export default async function CreateList (list: List, bid: string) {
    const response = await fetch (`/api/list-api/create-list`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            data: list,
            bid: bid    
        })
    });
    if (!response.ok) {
        throw new Error("Cannot create board");
    }
}