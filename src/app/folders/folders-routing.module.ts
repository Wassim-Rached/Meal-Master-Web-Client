import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoldersListComponent } from './pages/folders-list/folders-list.component';
import { FolderDetailsComponent } from './pages/folder-details/folder-details.component';

const routes: Routes = [
  {
    path: '',
    component: FoldersListComponent,
  },
  {
    path: ':id',
    component: FolderDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoldersRoutingModule {}
