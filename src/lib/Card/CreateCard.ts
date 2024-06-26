import { Card } from "../../../interface";

export default async function CreateCard (card: Card, lid: string, bid: string) {
    const response = await fetch (`/api/card-api/create-card`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({
            data: card,
            lid: lid,
            bid: bid
        })
    });

    if (!response.ok) {
        throw new Error("Cannot create card");
    }
}