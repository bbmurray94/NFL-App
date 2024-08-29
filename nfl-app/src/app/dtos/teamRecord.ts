import { TeamRecordStats } from "./teamRecordStats";

export interface TeamRecord
{
    id: number;
    name: string;
    type: string;
    summary: string;
    displayValue: string;
    value: string;
    stats: TeamRecordStats[];
}