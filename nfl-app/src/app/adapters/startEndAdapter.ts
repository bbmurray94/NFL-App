import { Injectable } from "@angular/core";
import { StartEndModel } from "../model/startEndModel";
import { StartEnd } from "../dtos/startEnd";
import { Adapter } from "./adapter";

@Injectable({
    providedIn: "root",
  })

  export class StartEndAdapter implements Adapter<StartEndModel>
  {
    adapt(item: StartEnd): StartEndModel
    {
        return new StartEndModel(
            item.downDistanceText
        );
    }
  }