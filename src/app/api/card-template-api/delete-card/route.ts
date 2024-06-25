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

export async function DELETE(req: Request) {
    try {
        const { cid } = await req.json();
        const cardJson = readCards();

        const cardIndex = cardJson.data.findIndex(card => card.id === cid);
        if (cardIndex === -1) {
            return NextResponse.json({ message: 'Card not found' }, { status: 404 });
        }

        cardJson.data.splice(cardIndex, 1);
        writeCards(cardJson);

        return NextResponse.json({ message: 'Card deleted successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete card', error }, { status: 500 });
    }
}