import { Play } from "./play";

export interface PagedPlayList 
{
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    items: Play[];
}