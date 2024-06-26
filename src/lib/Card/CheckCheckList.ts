export default async function CheckCheckList (ch_id: string, cid: string, lid: string, bid: string, check: boolean) {
    const response = await fetch('/api/card-api/check', {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            ch_id: ch_id,
            cid: cid,
            lid: lid,
            bid: bid,
            check: check
        })
    });
    if (!response.ok) {
        throw new Error("Cannot check");
    }
}