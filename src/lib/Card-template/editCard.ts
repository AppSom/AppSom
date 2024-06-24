import { Card } from "../../../interface";

export default async function UpdateCardById (card: Card, cid: string) {
    const response = await fetch (`/api/card-template-api/edit-card`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            data: card,
            cid: cid
        })
    });
    if (!response.ok) {
        throw new Error("Cannot update card");
    }
}