import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { TemplateJSON } from '../../../../../interface';

export async function POST(req: Request) {
    try {
        const card = await req.json();
        const cardPath = path.resolve('./public/Storage/Card/card.json');

        const cardFileData = fs.readFileSync(cardPath, 'utf-8');
        const cardJson: TemplateJSON = JSON.parse(cardFileData);

        cardJson.data.push(card.data);

        fs.writeFileSync(cardPath, JSON.stringify(cardJson, null, 2));

        return NextResponse.json({ message: 'Card added successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to add card', error }, { status: 500 });
    }
}
