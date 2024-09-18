import { ScoreModel } from "./scoreModel";
import { TeamDetailsModel } from "./teamDetailsModel";

export class CompetitorModel
{
    constructor(
        public id: number,
        public type: string,
        public order: number,
        public homeAway: string,
        public winner?: boolean,
        public score: ScoreModel | undefined = undefined,
        public teamDetails: TeamDetailsModel | undefined = undefined
    ){}

    addScore(scoreModel: ScoreModel)
    {
        this.score = scoreModel;
    }

    addTeamDetails(teamDetailsModel: TeamDetailsModel)
    {
        this.teamDetails = teamDetailsModel;
    }
}