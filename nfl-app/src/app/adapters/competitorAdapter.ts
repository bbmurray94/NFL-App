import { Injectable } from "@angular/core";
import { Competitor } from "../dtos/competitor";
import { CompetitorModel } from "../model/competitorModel";
import { Adapter } from "./adapter";
import { ScoreAdapter } from "./scoreAdapter";

@Injectable({
    providedIn: "root",
  })

export class CompetitorAdapter implements Adapter<CompetitorModel>
{
    constructor(private _scoreAdapter: ScoreAdapter)
    {}

    adapt(item: Competitor): CompetitorModel | undefined {
        if(item == null)
        { 
            return undefined;
        }
        return new CompetitorModel(
            item.id, 
            item.type, 
            item.order, 
            item.homeAway, 
            item.winner 
        );
    }
}