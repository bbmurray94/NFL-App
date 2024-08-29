import { TeamRecordStatsModel } from "./teamRecordStatsModel";

export class TeamRecordModel
{
    constructor(
        public id: number,
        public name: string,
        public type: string,
        public summary: string,
        public displayValue: string,
        public value: string,
        public stats: (TeamRecordStatsModel | undefined)[]
    ){}
}