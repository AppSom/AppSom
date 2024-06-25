import { Template } from "../../../interface";

export default async function CreateCard (card: Template) {
    const response = await fetch (`/api/card-template-api/add-card`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({
            data: card
        })
    });

    if (!response.ok) {
        throw new Error("Cannot create card");
    }
}