import { Component, OnInit } from '@angular/core';
import {
  Account,
  AccountsService,
} from '../../../shared-module/services/accounts.service';
import { SharedModule } from '../../../shared-module/shared-module.module';
import { MyRecipesComponent } from '../../components/my-recipes/my-recipes.component';
import { ProfileHeaderComponent } from '../../components/profile-header/profile-header.component';
import { DeleteMyAccountComponent } from '../../components/delete-my-account/delete-my-account.component';

@Component({
  selector: 'app-profile-overview',
  standalone: true,
  imports: [
    SharedModule,
    MyRecipesComponent,
    ProfileHeaderComponent,
    DeleteMyAccountComponent,
  ],
  templateUrl: './profile-overview.component.html',
  styleUrl: './profile-overview.component.css',
})
export class ProfileOverviewComponent implements OnInit {
  account?: Account;

  constructor(private accountsService: AccountsService) {}

  ngOnInit() {
    this.refreshMyAccount();
  }

  refreshMyAccount() {
    this.account = undefined;
    this.accountsService.getMyAccount().subscribe({
      next: (account) => {
        this.account = account;
      },
      error: (error) => {
        this.account = undefined;
        console.error('Error loading account', error);
      },
    });
  }
}
