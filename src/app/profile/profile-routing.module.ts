import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileOverviewComponent } from './pages/profile-overview/profile-overview.component';

const routes: Routes = [
  {
    path: 'my-profile',
    component: ProfileOverviewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
