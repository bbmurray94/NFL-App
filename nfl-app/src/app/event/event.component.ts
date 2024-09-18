import { Component } from '@angular/core';
import { TeamEvent } from '../dtos/teamEvent';
import { TeamsService } from '../teams.service';
import { TeamEventService } from '../team-event.service';
import { ActivatedRoute } from '@angular/router';
import { CompetitorModel } from '../model/competitorModel';
import { ScoreModel } from '../model/scoreModel';
import { TeamEventModel } from '../model/teamEventModel';
import { forkJoin, map, Observable } from 'rxjs';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {
  
  constructor(
    private route: ActivatedRoute, 
    private teamsService: TeamsService,
    private teamEventService: TeamEventService
  ){}
  
  event: TeamEvent | undefined = undefined;
  teamEventModel: TeamEventModel | undefined = undefined;
  homeTeam: CompetitorModel | undefined = undefined;
  awayTeam: CompetitorModel | undefined = undefined;
  
  ngOnInit()
  {
    this.teamsService.getEventById(Number(this.route.snapshot.paramMap.get('id')))
    .subscribe(e => 
      {
        this.event = e;
        this.setUpTeamEventModel(e).subscribe(t => 
          {
            this.teamEventModel = t;
            console.log(t);
            this.homeTeam = this.teamEventService.getHomeAwayTeam(this.teamEventModel, "home");
            this.awayTeam = this.teamEventService.getHomeAwayTeam(this.teamEventModel, "away");
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
      console.log(competitor);
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
                console.log("t1");
                const model = this.teamEventService.getTeamDetailsModel(t);
                console.log("t2");
                teamEventModel.competitions?.[0]?.competitors?.[i]?.addTeamDetails(model);
              })
          );

        observables.push(score$);
        observables.push(teamDetails$);
      }
    }
    return forkJoin(observables).pipe(map(()=> teamEventModel));
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
    console.log(this.teamEventModel);
    console.log(this.homeTeam);
    console.log(this.awayTeam);
  }
}
