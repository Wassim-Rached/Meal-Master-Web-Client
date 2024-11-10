import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulesPageComponent } from './pages/schedules-page/schedules-page.component';

const routes: Routes = [
  {
    path: '',
    component: SchedulesPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchedulesRoutingModule {}
