import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedReferenceList } from './dtos/pagedReferenceList';
import { expand, forkJoin, map, Observable, of, reduce, switchMap, takeWhile } from 'rxjs';
import { Reference } from './dtos/reference';
import { TeamDetails } from './dtos/teamDetails';
import { TeamEvent } from './dtos/teamEvent';
import { TeamRecord } from './dtos/teamRecord';
import { Score } from './dtos/score';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(private httpClient: HttpClient) { }

  private teamsUrl = "https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2024/teams";
  private teamOverallRecord = 
    (typeId: number, teamId: number) => 
      `http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2024/types/${typeId}/teams/${teamId}/records/0`;
  private eventUrl = (eventId: number) => `http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${eventId}`

  
  getTeamDetailsById(id: number): Observable<TeamDetails>
  {
    return this.httpClient.get<TeamDetails>(`${this.teamsUrl}/${id}`);
  }

  getTeamDetailsByUrl(url: string): Observable<TeamDetails>
  {
    console.log("service call");
    return this.httpClient.get<TeamDetails>(url);
  }

  getAllTeamsDetails(): Observable<TeamDetails[]>
  {
    return this.getAllReferences(this.teamsUrl).pipe(switchMap(refs => 
      { 
        const requests = refs.map(ref => this.getTeamDetailsByUrl(ref.$ref));
      return forkJoin(requests);
    }));
  }

  getTeamEvent(url: string): Observable<TeamEvent>
  {
    return this.httpClient.get<TeamEvent>(url);
  }

  getEventById(id: number): Observable<TeamEvent>
  {
    return this.httpClient.get<TeamEvent>(this.eventUrl(id));
  }

  getAllTeamEvents(url: string): Observable<TeamEvent[]>
  {
    return this.getAllReferences(url).pipe(switchMap(refs => {const requests = refs.map(ref => this.getTeamEvent(ref.$ref)); 
      return forkJoin(requests);
    }));
  }
  
  getTeamPostSeasonRecords(teamId: number)
  {
    const url = this.teamOverallRecord(3, teamId);
    return this.httpClient.get<TeamRecord>(url);
  }

  getTeamPreseasonRecords(teamId: number): Observable<TeamRecord>
  {
    const url = this.teamOverallRecord(1, teamId);
    return this.httpClient.get<TeamRecord>(url);
  }

  getTeamRegularSeasonRecords(teamId: number)
  {
    const url = this.teamOverallRecord(2, teamId);
    return this.httpClient.get<TeamRecord>(url);
  }

  getScore(url: string)
  {
    return this.httpClient.get<Score>(url);
  }

  private getReferences(url: string, page: number = 1) : Observable<PagedReferenceList>
  {
    return this.httpClient.get<PagedReferenceList>(`${url}?page=${page}`);
  }

  private getAllReferences(url: string): Observable<Reference[]>
  {
    return this.getReferences(url).pipe(
      expand(response => response.pageIndex < response.pageCount ? this.getReferences(url, response.pageIndex + 1) : of(null)
    
    ),
    takeWhile(response => response != null),
    map(response => response?.items ?? []),
    reduce((allItems, items) => allItems.concat(items), [] as Reference[]));
  }
}
