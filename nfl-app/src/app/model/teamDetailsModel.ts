import { LogoModel } from "./logoModel";
import { TeamEventModel } from "./teamEventModel";

export class TeamDetailsModel
{
    constructor(
        public id: number,
        public displayName: string,
        public color: string,
        public events: TeamEventModel[] = [],
        public logos: (LogoModel | undefined)[] 
        
    ){}

    addTeamEvents(teamEventModels: TeamEventModel[])
    {
        this.events = teamEventModels;
    }
}