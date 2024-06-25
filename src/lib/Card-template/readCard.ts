import { Template, TemplateJSON } from "../../../interface";

export default async function GetTemplateCard() {
    const response = await fetch (`/Storage/Card/card.json`);
    if (!response.ok) {
        throw new Error("Cannot get card");
    }
    const cardJson: TemplateJSON = await response.json();
    const card: Template[] | undefined = cardJson.data;
    if (!card) {
        throw new Error("No card");
    }
    return card;
}