export default async function RemoveMemberBoard (uid: string, bid: string) {
    const response = await fetch(`/api/board-api/remove-member-board`, {
        method: "DELETE",
        body: JSON.stringify({
            uid: uid,
            bid: bid
        })
    });
    if(!response.ok) {
        throw new Error("Cannot remove member");
    }
}