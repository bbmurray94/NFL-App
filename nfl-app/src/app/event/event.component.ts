import { Component } from '@angular/core';
import { TeamEvent } from '../dtos/teamEvent';
import { TeamsService } from '../teams.service';
import { TeamEventService } from '../team-event.service';
import { ActivatedRoute } from '@angular/router';
import { CompetitorModel } from '../model/competitorModel';
import { ScoreModel } from '../model/scoreModel';
import { TeamEventModel } from '../model/teamEventModel';
import { forkJoin, map, Observable, switchMap, timer } from 'rxjs';
import { Play } from '../dtos/play';
import { PlayModel } from '../model/playModel';
import { PlayAdapter } from '../adapters/playAdapter';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {
  
  constructor(
    private route: ActivatedRoute, 
    private teamsService: TeamsService,
    private teamEventService: TeamEventService,
    private playAdapter: PlayAdapter
  ){}
  
  event: TeamEvent | undefined = undefined;
  teamEventModel: TeamEventModel | undefined = undefined;
  homeTeam: CompetitorModel | undefined = undefined;
  awayTeam: CompetitorModel | undefined = undefined;
  playModels: PlayModel[] = [];
  play: Play[] = [];
  
  ngOnInit()
  {
    this.teamsService.getEventById(Number(this.route.snapshot.paramMap.get('id')))
    .subscribe(e => 
      {
        this.event = e;
        this.setUpTeamEventModel(e).subscribe(t => 
          {
            this.teamEventModel = t;
            this.homeTeam = this.teamEventService.getHomeAwayTeam(this.teamEventModel, "home");
            this.awayTeam = this.teamEventService.getHomeAwayTeam(this.teamEventModel, "away");
            this.teamsService.getEventPlays(this.teamEventModel.id, this.teamEventModel.competitions[0]?.id as number)
              .subscribe(ps => {this.playModels = ps.map(p => this.playAdapter.adapt(p));
                this.refreshPlays();
              });

          });
      });
  }

  setUpTeamEventModel(teamEvent: TeamEvent): Observable<TeamEventModel>
  {
    const teamEventModel = this.teamEventService.getTeamEventModel(teamEvent);
    
    const observables = [];
    for( let i = 0; i<2; i++)
    {
      const competitor = teamEvent.competitions?.[0]?.competitors?.[i];
      if(competitor)
      {
        const score$ = this.teamEventService.getScore(competitor).pipe(
          map((s: ScoreModel) => {
            teamEventModel.competitions?.[0]?.competitors?.[i]?.addScore(s);
          })
        );

        const teamDetails$ = this.teamsService.getTeamDetailsByUrl(competitor.team.$ref)
          .pipe(
            map(t => 
              {
                const model = this.teamEventService.getTeamDetailsModel(t);
                teamEventModel.competitions?.[0]?.competitors?.[i]?.addTeamDetails(model);
              })
          );

        observables.push(score$);
        observables.push(teamDetails$);
      }
    }
    return forkJoin(observables).pipe(map(()=> teamEventModel));
  }

  refreshPlays()
  {
    timer(5000, 5000)
      .pipe(
        switchMap(() => this.teamsService.getEventPlays(this.teamEventModel?.id as number, this.teamEventModel?.competitions[0]?.id as number))
      )
      .subscribe(newPlays => {
        newPlays.forEach(play => {
          // Only add if it's a new play (e.g., comparing by play ID)
          if (!this.playModels.find(p => p.id === play.id)) {
            this.playModels.push(this.playAdapter.adapt(play));
          }
        });
      });
  }

  getTeamLogo(competitor: CompetitorModel): string
  {
    return competitor?.teamDetails?.logos[0]?.href || "";
  }

  getTeamLogoAlt(competitor: CompetitorModel): string
  {
    return competitor?.teamDetails?.logos[0]?.alt || '';
  }

  test()
  {
    console.log(this.playModels);
  }
}
