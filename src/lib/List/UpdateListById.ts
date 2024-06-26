import { List } from "../../../interface";

export default async function UpdateListById (list: List, lid: string, bid: string) {
    const response = await fetch (`/api/list-api/update-list`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            data: list,
            lid: lid,
            bid: bid
        })
    });

    if(!response.ok) {
        throw new Error("Cannot Update");
    }
}