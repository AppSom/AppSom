import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Board, BoardJSON } from '../../../../../interface';

export async function PUT(req: Request) {
    try {
        const obj = await req.json();
        // obj = {
        //     data: board data,
        //     bid: board id
        // }

        const filePath = path.resolve('./public/Storage/Board/board.json');

        const fileData = fs.readFileSync(filePath, 'utf-8');
        const jsonData: BoardJSON = JSON.parse(fileData);

        const idx = jsonData.data.findIndex(b => b.id === obj.bid);

        if (idx == -1) {
            return NextResponse.json({ message: 'Board not found' }, {status: 404});
        }

        jsonData.data[idx] = obj.data;

        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

        return NextResponse.json({ message: 'Board updated successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to update board', error }, { status: 500 });
    }
}