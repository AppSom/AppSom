export default async function AddMemberBoard (uid: string, bid: string) {
    const response = await fetch(`/api/board-api/add-member-board`, {
        method: "PUT",
        body: JSON.stringify({
            uid: uid,
            bid: bid
        })
    });
    if(!response.ok) {
        throw new Error("Cannot add member");
    }
}