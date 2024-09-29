import { Injectable } from "@angular/core";
import { Play } from "../dtos/play";
import { PlayModel } from "../model/playModel";
import { Adapter } from "./adapter";
import { PeriodAdapter } from "./periodAdapter";
import { StartEndAdapter } from "./startEndAdapter";

@Injectable({
    providedIn: "root",
  })

  export class PlayAdapter implements Adapter<PlayModel>
  {
    constructor(private _periodAdapter: PeriodAdapter, private _startEndAdapter: StartEndAdapter){}
    
    
    adapt(item: Play): PlayModel
    {
        return new PlayModel(
            item.id,
            item.text,
            item.shortText,
            item.alternativeText,
            item.shortAlternativeText,
            item.awayScore,
            item.homeScore,
            this._periodAdapter.adapt(item.period),
            item.scoringPlay,
            this._startEndAdapter.adapt(item.start),
            item.statYardage
        );
    }
  }