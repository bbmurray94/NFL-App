import { CompetitorModel } from "./competitorModel";

export class CompetitionModel
{
    constructor(
        public id: number,
        public playByPlayAvailable: boolean,
        public liveAvailable: boolean,
        public lineupAvailable: boolean,
        public timeoutsAvailable: boolean,
        public possessionArrowAvailable: boolean,
        public competitors: (CompetitorModel | undefined)[]
    ){}
}