import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Board, BoardJSON, ListJSON } from '../../../../../interface';

export async function DELETE(req: Request) {
    try {
        const id = await req.json();
        // obj = JSON.parse(obj);
        const boardPath = path.resolve('./public/Storage/Board/board.json');
        const boardFileData = fs.readFileSync(boardPath, 'utf-8');
        const boardJson: BoardJSON = JSON.parse(boardFileData);

        const idx_b = boardJson.data.findIndex(b => b.id === id.bid);
        if (idx_b == -1) { // to return index of board
            return NextResponse.json({ message: 'Cannot find board to delete list' }, {status: 404});
        }
        const idx_lb = boardJson.data[idx_b].lists.findIndex(l => l.id === id.lid); 
        if (idx_lb == -1) { // to return index of list in the board
            return NextResponse.json({ message: 'Cannot find list in the board' }, {status: 404});
        }
        boardJson.data[idx_b].lists.splice(idx_lb, 1);

        fs.writeFileSync(boardPath, JSON.stringify(boardJson, null, 2));
        

        return NextResponse.json({ message: 'List deleted successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete list', error }, { status: 500 });
    }
}