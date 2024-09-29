import { Injectable } from "@angular/core";
import { PeriodModel } from "../model/periodModel";
import { Adapter } from "./adapter";
import { Period } from "../dtos/period";

@Injectable({
    providedIn: "root",
  })

export class PeriodAdapter implements Adapter<PeriodModel>
{
    adapt(item: Period): PeriodModel{
        return new PeriodModel(
            item.number
        );
    }
}