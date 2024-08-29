import { Injectable } from "@angular/core";
import { TeamRecord } from "../dtos/teamRecord";
import { TeamRecordModel } from "../model/teamRecordModel";
import { Adapter } from "./adapter";
import { TeamRecordStatsAdapter } from "./teamRecordStatsAdapter";

@Injectable({
    providedIn: "root",
  })

export class TeamRecordAdapter implements Adapter<TeamRecordModel>
{
    constructor(private _teamRecordStatsAdapter: TeamRecordStatsAdapter){}
    adapt(item: TeamRecord): TeamRecordModel | undefined {
        if(item == null)
        { 
            return undefined;
        }
        return new TeamRecordModel
        (
            item.id,
            item.name,
            item.type,
            item.summary,
            item.displayValue,
            item.value,
            item.stats.map((data: any) => this._teamRecordStatsAdapter.adapt(data))
        ); 
    }
}