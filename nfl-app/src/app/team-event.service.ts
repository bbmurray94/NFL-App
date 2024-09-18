import { Injectable } from '@angular/core';
import { TeamEvent } from './dtos/teamEvent';
import { forkJoin, map, Observable } from 'rxjs';
import { TeamsService } from './teams.service';
import { TeamEventAdapter } from './adapters/teamEventAdapter';
import { TeamEventModel } from './model/teamEventModel';
import { CompetitorModel } from './model/competitorModel';
import { Competitor } from './dtos/competitor';
import { ScoreModel } from './model/scoreModel';
import { ScoreAdapter } from './adapters/scoreAdapter';
import { TeamDetailsAdapter } from './adapters/teamDetailsAdapter';
import { TeamDetails } from './dtos/teamDetails';
import { TeamDetailsModel } from './model/teamDetailsModel';

@Injectable({
  providedIn: 'root'
})
export class TeamEventService {

  constructor(
    private teamsService: TeamsService,
    private teamDetailsAdapter: TeamDetailsAdapter,
    private teamEventAdapter: TeamEventAdapter,
    private scoreAdapter: ScoreAdapter
  ) { }

  
  getTeamDetailsModel(teamDetails: TeamDetails): TeamDetailsModel
  {
    const model = this.teamDetailsAdapter.adapt(teamDetails);
    return model as TeamDetailsModel
  }
  getTeamEventModel(teamEvent: TeamEvent): TeamEventModel
  {
    const teamEventModel = this.teamEventAdapter.adapt(teamEvent);
    return teamEventModel as TeamEventModel;
  }
  
  getScore(competitor: Competitor): Observable<ScoreModel>
  {
    return this.teamsService.getScore(competitor.score.$ref)
      .pipe(
        map(s => 
          this.scoreAdapter.adapt(s) as ScoreModel
        ));

  }

  getOrderedScore(event: TeamEvent, id: number): Observable<string>
  {
    const competitors = event.competitions[0].competitors;
    competitors.sort((a,b)=> {
      if(a.id === id) return -1;
      if(b.id === id) return 1;
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

  getOutcome(event: TeamEvent, id: number): string
  {
    const team = event.competitions?.[0].competitors?.filter(c => c.id == id)[0];
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

  getHomeAwayTeam(event: TeamEventModel, homeAway: string): CompetitorModel | undefined
  {
    const team = event.competitions?.[0]?.competitors?.filter(c => c?.homeAway == homeAway)[0];
    return team;
  }
}
