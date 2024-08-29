import { Injectable } from "@angular/core";
import { ScoreModel } from "../model/scoreModel";
import { Adapter } from "./adapter";
import { Score } from "../dtos/score";

@Injectable({
    providedIn: "root",
  })

export class ScoreAdapter implements Adapter<ScoreModel>
{
    adapt(item: Score): ScoreModel | undefined {
        if(item == null)
        { 
            return undefined;
        }
        return new ScoreModel(
            item.value, 
            item.displayValue, 
            item.winner
        );
    }
}