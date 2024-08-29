import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamsService } from '../teams.service';
import { TeamDetailsModel } from '../model/teamDetailsModel';
import { TeamDetailsAdapter } from '../adapters/teamDetailsAdapter';
import { TeamDetails } from '../dtos/teamDetails';
import { TeamEvent } from '../dtos/teamEvent';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { TeamRecord } from '../dtos/teamRecord';
import { TeamRecordModel } from '../model/teamRecordModel';
import { TeamRecordAdapter } from '../adapters/teamRecordAdapter';
import { TeamEventModel } from '../model/teamEventModel';
import { TeamEventAdapter } from '../adapters/teamEventAdapter';

@Component({
  selector: 'app-team-page',
  templateUrl: './team-page.component.html',
  styleUrls: ['./team-page.component.css']
})
export class TeamPageComponent {
  constructor(
    private route: ActivatedRoute, 
    private teamsService: TeamsService, 
    private teamDetailsAdapter: TeamDetailsAdapter,
    private teamRecordAdapter: TeamRecordAdapter,
    private teamEventAdapter: TeamEventAdapter
  ){}

  teamModel: TeamDetailsModel | undefined;
  teamRecordModel: TeamRecordModel | undefined;
  teamEventModels: (TeamEventModel | undefined)[] = [];

  team: TeamDetails | undefined;
  // teamRecord: TeamRecord | undefined;
  events: TeamEvent[] = [];

  ngOnInit()
  {
    this.getTeam();
  }

  getTeam()
  {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.teamsService.getTeam(id).subscribe(team => 
      {
        this.teamModel = this.teamDetailsAdapter.adapt(team);
        this.team = team;
        this.getTeamRecords();
        this.getEvents();
      });
    // this.teamsService.getTeam(id).subscribe(team => {this.team = team; this.getEvents(); this.getTeamRecords()});
  }

  getEvents()
  {
    if(this.team != undefined)
    {
      this.teamsService.getAllTeamEvents(this.team.events.$ref).subscribe(events =>
        {
          this.events = events;
          events.forEach((e) => 
            {
              try{
                const teamEventModel = this.teamEventAdapter.adapt(e);
              this.getScore(e).subscribe(s => teamEventModel?.setScore(s));
              teamEventModel?.setOutcome(this.getOutcome(e));
              this.getScore(e).subscribe(s => teamEventModel?.setScore(s));
              this.teamEventModels.push(teamEventModel);
              }
              catch(error){console.error("Error in adapt method:", error)}
              
            });
        });
    }   
  }

  getOutcome(event: TeamEvent): string
  {
    const team = event.competitions?.[0].competitors?.filter(c => c.id == this.teamModel?.id)[0];
    if(team.winner == true)
    {
      return 'W';
    }
    if(team.winner == false)
    {
      return 'L';
    }
    return '';
  }

  getScore(event: TeamEvent): Observable<string>
  {
    const competitors = event.competitions[0].competitors;
    console.log(competitors);
    competitors.sort((a,b)=> {
      if(a.id === this.teamModel?.id) return -1;
      if(b.id === this.teamModel?.id) return 1;
      return 0;
    });
    const competitorScore1$ = this.teamsService.getScore(competitors[0].score.$ref);
    const competitorScore2$ = this.teamsService.getScore(competitors[1].score.$ref);

    return forkJoin([competitorScore1$, competitorScore2$]).pipe(
      map(([competitorScore1, competitorScore2]) => {
        return `${competitorScore1.displayValue}-${competitorScore2.displayValue}`;
      })
    );
  }

  getTeamRecords()
  {
    if(this.team != undefined)
    {
      let teamId = this.team.id;
      const postSeason$ = this.teamsService.getTeamPostSeasonRecords(teamId)
      .pipe(
        catchError((error) => 
          {
              return of(undefined);
          }
        )
      );
      const regularSeason$ = this.teamsService.getTeamRegularSeasonRecords(teamId)
      .pipe(
        catchError((error) => 
          {
              return of(undefined);
          }
        )
      );
      const preseason$ = this.teamsService.getTeamPreseasonRecords(teamId)
      .pipe(
        catchError((error) => 
          {
              return of(undefined);
          }
        )
      );

      forkJoin([postSeason$, regularSeason$, preseason$])
      .subscribe(([postSeasonRecord, regularSeasonRecord, preseasonRecord]) =>
        {
          if(postSeasonRecord !== undefined){ this.teamRecordModel = this.teamRecordAdapter.adapt(postSeasonRecord);}
          else if(regularSeasonRecord !== undefined){ this.teamRecordModel = this.teamRecordAdapter.adapt(regularSeasonRecord);}
          else if(preseasonRecord !== undefined){this.teamRecordModel = this.teamRecordAdapter.adapt(preseasonRecord);}
        });
    }
  }

  getTeamLogo(): string
  {
    return this.teamModel?.logos[0]?.href || '';
  }

  getTeamLogoAlt(): string
  {
    return this.teamModel?.logos[0]?.alt || '';
  }

  test()
  {
    console.log(this.events);
  }
}
