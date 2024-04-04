import { DispenserSpendingLine } from "../model/Dispenser";

export function parseJsonResponse(dispenser: DispenserSpendingLine){
    let dispenserObject: string;
    let spendingObject: string = '';
    let dispenserJson: JSON;
    let amount: number = 0;
    let opened_at: string | null, closed_at : string | null;

    dispenser.dispenserSpendingLine.forEach((value) =>{
        if(value.total_spent)
            amount = value.total_spent;
        if(value.opened_at){
            opened_at = value.opened_at.toISOString();
        } else {
            opened_at = null;
        }if(value.closed_at){
            closed_at = value.closed_at.toISOString();
        } else{
            closed_at = null
        }

        spendingObject += `{"opened_at": "${opened_at}","closed_at": "${closed_at}","flow_volume": ${value.flow_volume},"total_spent": ${value.total_spent}},`;
        
    });
    spendingObject = spendingObject.slice(0,-1);
    dispenserObject = `
        {
            "amount": ${amount},
            "usages": [${spendingObject}]
        }
    `;
    dispenserJson = JSON.parse(dispenserObject);

    return dispenserJson;
}