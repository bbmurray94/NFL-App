export class TeamRecordStatsModel
{
    constructor(
        public name: string,
        public displayName: string,
        public description: string,
        public abbreviation: string,
        public type: string,
        public value: number,
        public displayValue: string
    ){}
}