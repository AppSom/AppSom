export default async function DeleteListById(lid: string, bid: string) {
    const response = await fetch(`/api/list-api/delete-list`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            lid: lid,
            bid: bid,
        }),
    });

    if (!response.ok) {
        throw new Error("Cannot Delete");
    }
}
