import { Logo } from "./logo";
import { Reference } from "./reference";

export interface TeamDetails 
{
    id: number;
    displayName: string;
    color: string;
    events: Reference;
    logos: Logo[];
}