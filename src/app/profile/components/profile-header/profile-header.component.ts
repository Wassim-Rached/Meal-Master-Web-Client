import { Component, Input } from '@angular/core';
import { Account } from '../../../shared-module/services/accounts.service';
import { SharedModule } from '../../../shared-module/shared-module.module';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css',
})
export class ProfileHeaderComponent {
  @Input({ required: true })
  account!: Account;
  backgroundImageUrl =
    'https://img.freepik.com/premium-vector/seamless-pattern-background-doodle-kitchen-tools-cute-drawing_43503-28.jpg?semt=ais_hybrid';
}
