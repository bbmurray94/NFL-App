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
import { TeamEventService } from '../team-event.service';

@Component({
  selector: 'app-team-page',
  templateUrl: './team-page.component.html',
  styleUrls: ['./team-page.component.css']
})
export class TeamPageComponent {
  constructor(
    private route: ActivatedRoute, 
    private teamsService: TeamsService, 
    private teamEventService: TeamEventService,
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
    this.getTeam(Number(this.route.snapshot.paramMap.get('id')));
  }

  getTeam(id: number)
  {
    this.teamsService.getTeamDetailsById(id).subscribe(team => 
      {
        this.teamModel = this.teamEventService.getTeamDetailsModel(team);
        this.team = team;
        this.getTeamRecords();
        this.getEvents();
      });
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
                teamEventModel?.setOutcome(this.teamEventService.getOutcome(e, this.teamModel?.id as number));
                this.teamEventService.getOrderedScore(e, this.teamModel?.id as number)
                .subscribe(s => teamEventModel?.setScore(s));
                this.teamEventModels.push(teamEventModel);
              }
              catch(error){console.error("Error in adapt method:", error)}
              
            });
        });
    }   
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

  getTeamLogo(teamModel: TeamDetailsModel): string
  {
    return teamModel.logos[0]?.href || '';
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
