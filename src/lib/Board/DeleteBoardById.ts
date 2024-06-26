export default async function DeleteBoardById(id: string) {
    const response = await fetch('/api/board-api/delete-board', {
        method: "DELETE",
        body: JSON.stringify(id),
    });

    if(!response.ok) {
        throw new Error("Cannot Delete");
    }
}