export default async function AddMemberCard (uid: string, bid: string, lid: string, cid: string) {
    const response = await fetch(`/api/card-api/add-member-card`, {
        method: "PUT",
        body: JSON.stringify({
            uid: uid,
            bid: bid,
            lid: lid,
            cid: cid
        })
    });
    if(!response.ok) {
        throw new Error("Cannot add member");
    }
}