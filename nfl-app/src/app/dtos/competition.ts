import { Competitor } from "./competitor";

export interface Competition
{
    id: number;
    playByPlayAvailable: boolean;
    liveAvailable: boolean;
    lineupAvailable: boolean;
    timeoutsAvailable: boolean;
    possessionArrowAvailable: boolean;
    competitors: Competitor[];
}