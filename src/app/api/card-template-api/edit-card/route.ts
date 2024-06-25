import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { TemplateJSON } from '../../../../../interface';

const cardPath = path.resolve('./public/Storage/Card/card.json');
const readCards = (): TemplateJSON => {
    const cardFileData = fs.readFileSync(cardPath, 'utf-8');
    return JSON.parse(cardFileData);
};

const writeCards = (data: TemplateJSON) => {
    fs.writeFileSync(cardPath, JSON.stringify(data, null, 2));
};

export async function PUT(req: Request) {
    try {
        const card = await req.json();
        const cardJson = readCards();
        const myCard = card.data;
        console.log("card hehe", myCard)

        const cardIndex = cardJson.data.findIndex(card => card.id === myCard.id);
        console.log("card index", cardIndex)
        if (cardIndex === -1) {
            return NextResponse.json({ message: 'Card not found' }, { status: 404 });
        }

        cardJson.data[cardIndex] = card.data;
        writeCards(cardJson);

        return NextResponse.json({ message: 'Card updated successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to update card', error }, { status: 500 });
    }
}