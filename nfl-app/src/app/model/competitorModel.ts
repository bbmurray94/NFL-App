import { ScoreModel } from "./scoreModel";

export class CompetitorModel
{
    constructor(
        public id: number,
        public type: string,
        public order: number,
        public homeAway: string,
        public winner?: boolean,
        public score: ScoreModel | undefined = undefined
    ){}

    addScore(scoreModel: ScoreModel)
    {
        this.score = scoreModel;
    }
}