import { Injectable } from "@angular/core";
import { Adapter } from "./adapter";
import { TeamEventModel } from "../model/teamEventModel";
import { CompetitionAdapter } from "./competitionAdapter";
import { TeamEvent } from "../dtos/teamEvent";

@Injectable({
    providedIn: "root",
  })

export class TeamEventAdapter implements Adapter<TeamEventModel>
{
    constructor(private _competitionAdapter: CompetitionAdapter)
    {}
    adapt(item: TeamEvent): TeamEventModel | undefined {
        if(item == null)
        { 
            return undefined;
        }
        return new TeamEventModel(
            item.id,
            item.date,
            item.name,
            item.shortName,
            item.competitions.map((data: any) => this._competitionAdapter.adapt(data))
        );
    }
}