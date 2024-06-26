export default async function DeleteCardById (cid: string, lid: string, bid: string) {
    const response = await fetch (`/api/card-api/delete-card`, {
        method: "DELETE",
        body: JSON.stringify({
            cid: cid,
            lid: lid,
            bid: bid
        })
    });
    if (!response.ok) {
        throw new Error("Cannot delete card");
    }
}