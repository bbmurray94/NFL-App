import { Component } from '@angular/core';
import { TeamsService } from '../teams.service';
import { TeamDetailsAdapter } from '../adapters/teamDetailsAdapter';
import { TeamDetailsModel } from '../model/teamDetailsModel';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent {
  constructor(private teamsService: TeamsService, private teamDetailsAdapter: TeamDetailsAdapter)
  {

  }
  teamDetailsModel: (TeamDetailsModel | undefined)[] = [];

  ngOnInit()
  {
    this.getTeamDetails();
  }

  getTeamDetails()
  {
    this.teamsService.getAllTeamsDetails().subscribe(t => {
      this.teamDetailsModel = t.map(teamDetail => this.teamDetailsAdapter.adapt(teamDetail))
    });
  }
}
