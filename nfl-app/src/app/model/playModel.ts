import { StartEnd } from "../dtos/startEnd";
import { PeriodModel } from "./periodModel";

export class PlayModel {
    constructor(
        public id: number,
        public text: string,
        public shortText: string,
        public alternativeText: string,
        public shortAlternativeText: string,
        public awayScore: number,
        public homeScore: number,
        public period: PeriodModel,
        public scoringPlay: boolean,
        public start: StartEnd,
        public statYardage: number
    ){}
}