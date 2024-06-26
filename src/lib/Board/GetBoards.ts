export default async function GetBoards () {
    const file = await fetch(`/Storage/Board/board.json`,
    {
        headers: {
        'Content-Type': 'application/json'
        },
        next: {
            tags: ["board"]
        }
    }
    );
    const data = await file.json();
    return data;
}