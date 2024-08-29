import { Injectable } from "@angular/core";
import { TeamDetails } from "../dtos/teamDetails";
import { TeamDetailsModel } from "../model/teamDetailsModel";
import { Adapter } from "./adapter";
import { LogoAdaptor } from "./logoAdapter";

@Injectable({
    providedIn: "root",
  })

export class TeamDetailsAdapter implements Adapter<TeamDetailsModel>
{
    constructor(
        private _logoAdapter: LogoAdaptor
    ){}
    
    adapt(item: TeamDetails): TeamDetailsModel | undefined {
        if(item == null)
        { 
            return undefined;
        }
        return new TeamDetailsModel
        (
            item.id, 
            item.displayName, 
            item.color, 
            [], 
            item.logos.map((data: any) => this._logoAdapter.adapt(data))
        ); 
    }
}