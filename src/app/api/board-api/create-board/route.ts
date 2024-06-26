import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Board, BoardJSON, List } from '../../../../../interface';

export async function POST(req: Request) {
    try {
        var board: Board = await req.json();

        const to_do: List = {
            id: crypto.randomUUID(),
            name: "To-Do",
            description: "To-Do List",
            cards: [],
            board: board.id
        }
        const doing: List = {
            id: crypto.randomUUID(),
            name: "In Progress",
            description: "Doing List",
            cards: [],
            board: board.id
        }
        const done: List = {
            id: crypto.randomUUID(),
            name: "Done",
            description: "Done List",
            cards: [],
            board: board.id
        }

        board.lists.push(to_do, doing, done);

        const filePath = path.resolve('./public/Storage/Board/board.json');

        const fileData = fs.readFileSync(filePath, 'utf-8');
        const jsonData: BoardJSON = JSON.parse(fileData);

        jsonData.data.push(board);

        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

        return NextResponse.json({ message: 'Board added successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to add board', error }, { status: 500 });
    }
}
