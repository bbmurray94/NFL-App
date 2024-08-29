import { CompetitionModel } from "./competitionModel";

export class TeamEventModel
{
    public outcome: string = "";
    public score: string = "";
    
    constructor(
        public id: number,
        public date: Date,
        public name: string,
        public shortName: string,
        public competitions: (CompetitionModel | undefined)[],
    )
    {}
    
    setOutcome(value: string)
    {
        this.outcome = value;
    }

    getOutcome(): string
    {
        return this.outcome;
    }

    setScore(value: string)
    {
        this.score = value;
    }

    getScore(): string
    {
        return this.score;
    }
}