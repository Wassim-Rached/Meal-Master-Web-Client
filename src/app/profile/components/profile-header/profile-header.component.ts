import { Component, Input } from '@angular/core';
import { Account } from '../../../shared-module/services/accounts.service';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css',
})
export class ProfileHeaderComponent {
  @Input({ required: true })
  account!: Account;
}
