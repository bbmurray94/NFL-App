import { Injectable } from "@angular/core";
import { Logo } from "../dtos/logo";
import { LogoModel } from "../model/logoModel";
import { Adapter } from "./adapter";

@Injectable({
    providedIn: "root",
  })

export class LogoAdaptor implements Adapter<LogoModel>{
    adapt(item: Logo): LogoModel | undefined {
        if(!item)
        {
            return undefined;
        }
        return new LogoModel(item.href, item.alt);
    }
}