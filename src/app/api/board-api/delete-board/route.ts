import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Board, BoardJSON } from '../../../../../interface';

export async function DELETE(req: Request) {
    try {
        var obj = await req.json();
        // obj = JSON.parse(obj);
        console.log(obj);

        const filePath = path.resolve('./public/Storage/Board/board.json');

        const fileData = fs.readFileSync(filePath, 'utf-8');
        const jsonData: BoardJSON = JSON.parse(fileData);

        const idx = jsonData.data.findIndex(b => b.id === obj);

        if (idx == -1) {
            return NextResponse.json({ message: 'Board not found' }, {status: 404});
        }

        jsonData.data.splice(idx, 1);

        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

        return NextResponse.json({ message: 'Board deleted successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete board', error }, { status: 500 });
    }
}