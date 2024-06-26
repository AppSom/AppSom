import { Card } from "../../../interface";

export default async function UpdateCardById (card: Card, cid: string, lid: string, bid: string) {
    const response = await fetch (`/api/card-api/update-card`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            data: card,
            cid: cid,
            lid: lid,
            bid: bid
        })
    });
    if (!response.ok) {
        throw new Error("Cannot update card");
    }
}