
export default async function DeleteCardById (cid: string) {
    const response = await fetch (`/api/card-template-api/delete-card`, {
        method: "DELETE",
        body: JSON.stringify({
            cid: cid
        })
    });
    if (!response.ok) {
        throw new Error("Cannot delete card");
    }
}