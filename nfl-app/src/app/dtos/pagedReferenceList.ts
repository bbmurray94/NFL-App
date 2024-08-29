import { Reference } from "./reference";

export interface PagedReferenceList
{
    count: number;
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    items: Reference[];
}