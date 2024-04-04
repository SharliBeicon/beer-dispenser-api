import DispenserRepo, {dispenserState} from "../model/Dispenser";
import {Request, Response} from 'express'
import Config from '../config/Config';
import { parseJsonResponse } from "../util/Parser";

export default class DispenserHandler{
    private dispenserRepo : DispenserRepo;

    constructor(){
        this.dispenserRepo =  new DispenserRepo();
    }
    public createDispenser = (req: Request, res: Response) => {
        const { flow_volume } = req.body;

        if(flow_volume){
            this.dispenserRepo.create({
                dispenserSpendingLine: [
                    {flow_volume: req.body.flow_volume}
                ]
            })
            .then((dispenser) => {
                res.status(201).json({
                    id: dispenser._id,
                    flow_volume: dispenser.dispenserSpendingLine[0].flow_volume
                });
            })
            .catch(() => {
                res.status(500).json("Something went wrong!");
            });
        } else {
            res.status(400).json("Body is not formated properly");
        }
    }

    public changeStatus = (req: Request, res: Response) => {
        const id = req.params.id;
        
        this.checkState(id).then((value) =>{
            if(req.body.status){
                const selectedState : dispenserState = req.body.status;

                if(selectedState === value){
                    res.status(409).json("Dispenser is already " + selectedState);
                } else {
                    this.dispenserRepo.findById(id).then((document)=>{
                        if(document){
                            const lastIndex = document.dispenserSpendingLine.length - 1;
                            if(selectedState === 'open'){
                                if(lastIndex === 0 && !document.dispenserSpendingLine[lastIndex].closed_at){
                                    document.dispenserSpendingLine[lastIndex].opened_at = new Date(Date.now());
                                } else {
                                    document.dispenserSpendingLine.push({
                                        flow_volume: document.dispenserSpendingLine[0].flow_volume,
                                        opened_at: new Date(Date.now())
                                    });
                                }
                            } else if(selectedState === 'close') {
                                const opened_at = document.dispenserSpendingLine[lastIndex].opened_at as Date;
                                const closed_at = new Date(Date.now());
                                const flow_volume = document.dispenserSpendingLine[lastIndex].flow_volume;
                                const timeElapsed = this.timeElapsed(opened_at, closed_at);
                
                                document.dispenserSpendingLine[lastIndex].closed_at = closed_at;
                                document.dispenserSpendingLine[lastIndex].total_spent = flow_volume * timeElapsed * Config.beerPrice;
                            }
                
                            this.dispenserRepo.update(id, document).then(()=>{
                                res.status(201).json("Status " + selectedState + " properly setted");
                            });
                        }
                    });
                }
            }else{
                res.status(500).json("Dispenser body is not properly built");
            }
            
        });
    }

    public getDispenser = (req: Request, res: Response) => {
        if(req.params.id){
            this.dispenserRepo.findByIdParsed(req.params.id).then((dispenser) => {
                if(dispenser){
                    const dispenserJson = parseJsonResponse(dispenser);
                    res.status(200).json(dispenserJson);
                } else {
                    res.status(404).json("Dispenser not found");
                }
            });
        } else {
            res.status(400).json("URL is not built correctly");
        }
    }

    public deleteDispenser = (req: Request, res: Response) => {
        if(req.params.id){
            this.dispenserRepo.delete(req.params.id);
            res.status(200).json("Dispenser deleted succesfully");
        } else {
            res.status(400).json("URL is not built correctly");
        }
    }

    private async checkState(id: string): Promise<dispenserState>{
        const document = await this.dispenserRepo.findById(id);
        let state: dispenserState = 'unknown';
        if(document){
            const lastIndex = document.dispenserSpendingLine.length - 1;

            const closed_at : Date | undefined = document.dispenserSpendingLine[lastIndex].closed_at;
            const opened_at : Date | undefined = document.dispenserSpendingLine[lastIndex].opened_at;

            if(!opened_at || (closed_at && opened_at)){
                state = 'close';
            } else {
                state = 'open';
            }
        }

        return state;
    }

    private timeElapsed(init: Date, end: Date): number {
        const diffMs = end.getTime() - init.getTime();
        return Math.floor(diffMs / 1000);
    }
}