import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Folder,
  FoldersService,
} from '../../../shared-module/services/folders.service';
import { SharedModule } from '../../../shared-module/shared-module.module';
import { ToastrService } from 'ngx-toastr';
// folder icon
import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// faTrash
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-folder-card',
  standalone: true,
  imports: [SharedModule, FontAwesomeModule],
  templateUrl: './folder-card.component.html',
  styleUrl: './folder-card.component.css',
})
export class FolderCardComponent {
  @Input({ required: true }) folder!: Folder;
  @Output() folderDeleted = new EventEmitter<Folder>();

  isDeleting = false;

  constructor(
    private foldersService: FoldersService,
    private toastrService: ToastrService
  ) {}

  onDeleteFolder() {
    const confirmDelete = confirm(
      'Are you sure you want to delete "' + this.folder.name + '" folder?'
    );
    if (!confirmDelete) return;

    this.isDeleting = true;
    this.foldersService.deleteFolder(this.folder.id).subscribe({
      next: (_) => {
        this.toastrService.success('Folder deleted successfully');
        this.isDeleting = false;
        this.folderDeleted.emit(this.folder);
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error('Failed to delete folder');
        this.isDeleting = false;
      },
    });
  }

  get faFolder() {
    return faFolder;
  }

  get faTrash() {
    return faTrash;
  }
}
