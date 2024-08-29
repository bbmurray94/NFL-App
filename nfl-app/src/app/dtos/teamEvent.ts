import { Competition } from "./competition";

export interface TeamEvent
{
    id: number;
    date: Date;
    name: string;
    shortName: string;
    competitions: Competition[];  
}