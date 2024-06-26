import { CheckList } from "../../../interface";


export default async function AddCheckList (checkList: CheckList, cid: string, lid: string, bid: string ) {
    const response = await fetch(`/api/card-api/add-checklist`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            data: checkList,
            cid: cid,
            lid: lid,
            bid: bid
        })
    });
    if (!response.ok) {
        throw new Error("Cannot add checklist");
    }
}