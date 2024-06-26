import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { BoardJSON, CardJSON, ListJSON } from '../../../../../interface';

export async function PUT(req: Request) {
    try {
        const checkList = await req.json();
        // card = {
        //     cid: card id,
        //     lid: list id,
        //     bid: board id, uid: member id
        // }
        const boardPath = path.resolve('./public/Storage/Board/board.json');

        const boardFileData = fs.readFileSync(boardPath, 'utf-8');
        const boardJson: BoardJSON = JSON.parse(boardFileData);

        const idx_b = boardJson.data.findIndex(b => b.id === checkList.bid);
        if (idx_b == -1) { // find board
            return NextResponse.json({ message: 'Cannot find board to update card' }, {status: 404});
        }

        const idx_lb = boardJson.data[idx_b].lists.findIndex(l => l.id === checkList.lid);
        if (idx_lb == -1) { // find list in the board
            return NextResponse.json({ message: 'Cannot find list-board to update card' }, {status: 404});
        }

        const idx_clb = boardJson.data[idx_b].lists[idx_lb].cards.findIndex(c => c.id === checkList.cid);
        if (idx_clb == -1) { // find card in list-board
            return NextResponse.json({ message: 'Cannot find card in list-baord to update' }, {status: 404});
        }

        boardJson.data[idx_b].lists[idx_lb].cards[idx_clb].CheckList.push(checkList.data);
        fs.writeFileSync(boardPath, JSON.stringify(boardJson, null, 2));

        return NextResponse.json({ message: 'Card updated successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to update card', error }, { status: 500 });
    }
}
