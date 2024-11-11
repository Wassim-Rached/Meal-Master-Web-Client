import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedModule } from '../../../shared-module/shared-module.module';
import {
  Folder,
  FoldersService,
} from '../../../shared-module/services/folders.service';
import { ToastrService } from 'ngx-toastr';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-search-folders',
  standalone: true,
  imports: [SharedModule, FontAwesomeModule],
  templateUrl: './search-folders.component.html',
  styleUrl: './search-folders.component.css',
})
export class SearchFoldersComponent implements OnInit {
  folders?: Folder[];
  allFolders?: Folder[];
  @Output() folderSelected = new EventEmitter<Folder>();

  constructor(
    private foldersService: FoldersService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAllFolders();
  }

  refreshFolders(searchTerm?: string): void {
    this.folders = this.allFolders?.filter((folder) =>
      folder.name.includes(searchTerm || '')
    );
  }

  // this is used because the client mostlikely will not have a lot of folders
  // so this is a simple way to refresh the folders
  private loadAllFolders(): void {
    this.foldersService.getMyFolders().subscribe({
      next: (folders) => {
        this.allFolders = folders;
      },
      error: (error) => {
        this.folders = undefined;
        console.error(error);
        this.toastService.error('Failed to load folders');
      },
    });
  }

  selectFolder(folder: Folder): void {
    this.folderSelected.emit(folder);
  }

  get faSearch() {
    return faSearch;
  }

  get faFolder() {
    return faFolder;
  }
}
