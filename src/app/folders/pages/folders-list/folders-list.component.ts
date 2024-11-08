import { Component } from '@angular/core';
import {
  Folder,
  FoldersService,
} from '../../../shared-module/services/folders.service';
import { SharedModule } from '../../../shared-module/shared-module.module';
import { ToastrService } from 'ngx-toastr';
import { FolderCardComponent } from '../../components/folder-card/folder-card.component';

@Component({
  selector: 'app-folders-list',
  standalone: true,
  imports: [SharedModule, FolderCardComponent],
  templateUrl: './folders-list.component.html',
  styleUrl: './folders-list.component.css',
})
export class FoldersListComponent {
  folders?: Folder[] = undefined;
  isCreatingFolder = false;
  foldersList?: Folder[] = undefined;

  constructor(
    private foldersService: FoldersService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.refreshFolders();
  }

  refreshFolders() {
    this.foldersService.getMyFolders().subscribe({
      next: (folders) => {
        this.folders = folders;
        this.foldersList = folders;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onCreateFolder(name: string) {
    if (!name || name.trim() === '') {
      this.toastrService.error('Folder name is required');
      return;
    }

    this.isCreatingFolder = true;
    this.foldersService.createFolder(name).subscribe({
      next: (_) => {
        this.toastrService.success('Folder created successfully');
        this.isCreatingFolder = false;
        this.refreshFolders();
        this.foldersService.getMyFolders().subscribe({
          next: (folders) => {
            this.folders = folders;
          },
          error: (error) => {
            console.error(error);
          },
        });
      },
      error: (error) => {
        console.error(error);
        const errorMessage = error.error || 'Failed to create folder';
        this.toastrService.error(errorMessage);
        this.isCreatingFolder = false;
      },
    });
  }

  searchFolders(name: string) {
    this.foldersList =
      this.folders?.filter((folder) =>
        folder.name.toLowerCase().includes(name.toLowerCase())
      ) || [];
  }

  onFolderDeleted(folder: Folder) {
    this.folders = this.folders?.filter((f) => f.id !== folder.id);
    if (!this.foldersList) return;
    this.foldersList = this.foldersList.filter((f) => f.id !== folder.id);
  }
}
