import { Injectable } from "@angular/core";
import { CompetitionModel } from "../model/competitionModel";
import { Adapter } from "./adapter";
import { CompetitorAdapter } from "./competitorAdapter";
import { Competition } from "../dtos/competition";

@Injectable({
    providedIn: "root",
  })

export class CompetitionAdapter implements Adapter<CompetitionModel>
{
    constructor(private _competitorAdapter: CompetitorAdapter)
    {}
    adapt(item: Competition): CompetitionModel | undefined {
        if(item == null)
        { 
            return undefined;
        }
        return new CompetitionModel(
            item.id,
            item.playByPlayAvailable,
            item.liveAvailable,
            item.lineupAvailable,
            item.timeoutsAvailable,
            item.possessionArrowAvailable,
            item.competitors.map((data: any) => this._competitorAdapter.adapt(data))
        );
    }
}