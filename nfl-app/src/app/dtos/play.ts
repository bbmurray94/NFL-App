import { Period } from "./period";
import { Reference } from "./reference";
import { StartEnd } from "./startEnd";

export interface Play 
{
    id: number;
    // type: PlayType
    text: string;
    shortText: string;
    alternativeText: string;
    shortAlternativeText: string;
    awayScore: number;
    homeScore: number;
    period: Period;
    // clock: Clock { value: number; displayValue: string; }
    scoringPlay: boolean;
    team: Reference;
    // participants 
    // drive
    start: StartEnd;
    // end: End
    statYardage: number;
}