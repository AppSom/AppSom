import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { BoardJSON } from '../../../../../interface';

export async function PUT(req: Request) {
    try {
        var obj = await req.json();
        // obj = JSON.parse(obj);
        console.log(obj);

        const boardPath = path.resolve('./public/Storage/Board/board.json');

        const boardData = fs.readFileSync(boardPath, 'utf-8');
        const boardJson: BoardJSON = JSON.parse(boardData);

        const idx_b = boardJson.data.findIndex(b => b.id === obj.bid);

        if (idx_b == -1) {
            return NextResponse.json({ message: 'Board not found' }, {status: 404});
        }

        if (boardJson.data[idx_b].member.includes(obj.uid)) {
            return;
        }

        boardJson.data[idx_b].member.push(obj.uid);

        fs.writeFileSync(boardPath, JSON.stringify(boardJson, null, 2));

        return NextResponse.json({ message: 'Member removed successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to remove member', error }, { status: 500 });
    }
}