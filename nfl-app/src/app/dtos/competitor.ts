import { Reference } from "./reference";

export interface Competitor 
{
    $ref: string;
    id: number;
    type: string;
    order: number;
    homeAway: string;
    winner?: boolean;
    score: Reference;
}
