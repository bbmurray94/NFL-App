import { Injectable } from "@angular/core";
import { TeamRecordStats } from "../dtos/teamRecordStats";
import { TeamRecordStatsModel } from "../model/teamRecordStatsModel";
import { Adapter } from "./adapter";

@Injectable({
    providedIn: "root",
  })

export class TeamRecordStatsAdapter implements Adapter<TeamRecordStatsModel>
{
    
    adapt(item: TeamRecordStats): TeamRecordStatsModel | undefined {
        if(item == null)
        { 
            return undefined;
        }
        return new TeamRecordStatsModel
        (
            item.name, 
            item.displayName, 
            item.description, 
            item.abbreviation, 
            item.type, 
            item.value, 
            item.displayValue
        ); 
    }
}