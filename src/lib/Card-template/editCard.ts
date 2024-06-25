import { Template } from "../../../interface";

export default async function UpdateCardById (card: Template) {
    const response = await fetch (`/api/card-template-api/edit-card`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            data: card
        })
    });
    if (!response.ok) {
        throw new Error("Cannot update card");
    }
}