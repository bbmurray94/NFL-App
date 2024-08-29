import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TeamsComponent } from './teams/teams.component';
import { TeamPageComponent } from './team-page/team-page.component';

const routes: Routes = [
  { path: 'teams', component: TeamsComponent },
  { path: 'teams/:id', component: TeamPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
