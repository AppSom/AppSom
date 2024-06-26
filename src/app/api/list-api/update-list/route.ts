import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { BoardJSON, ListJSON } from '../../../../../interface';

export async function PUT(req: Request) {
    try {
        const obj = await req.json();
        // obj = JSON.parse(obj);
        const boardPath = path.resolve('./public/Storage/Board/board.json');
        const boardFileData = fs.readFileSync(boardPath, 'utf-8');
        const boardJson: BoardJSON = JSON.parse(boardFileData);

        const idx_b = boardJson.data.findIndex(b => b.id === obj.bid);
        if (idx_b == -1) { // to return index of board
            return NextResponse.json({ message: 'Cannot find board to update list' }, {status: 404});
        }
        const idx_lb = boardJson.data[idx_b].lists.findIndex(l => l.id === obj.lid); 
        if (idx_lb == -1) { // to return index of list in the board
            return NextResponse.json({ message: 'Cannot find list in the board' }, {status: 404});
        }

        boardJson.data[idx_b].lists[idx_lb] = obj.data;
        fs.writeFileSync(boardPath, JSON.stringify(boardJson, null, 2));
        

        return NextResponse.json({ message: 'List updated successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to update list', error }, { status: 500 });
    }
}