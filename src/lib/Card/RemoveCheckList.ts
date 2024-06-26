import { CheckList } from "../../../interface";


export default async function RemoveCheckList (ch_id: string, cid: string, lid: string, bid: string ) {
    const response = await fetch(`/api/card-api/remove-checklist`, {
        method: "DELETE",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            ch_id: ch_id,
            cid: cid,
            lid: lid,
            bid: bid
        })
    });
    if (!response.ok) {
        throw new Error("Cannot remove checklist");
    }
}