import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared-module/shared-module.module';
import { AuthService } from './shared-module/services/auth-service.service';
import {
  Message,
  MessagesService,
} from './shared-module/services/messages.service';
import { MessageComponent } from './schedules/components/message/message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule, MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'meal-master-web-client';

  // messages
  messages: Message[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private messagesService: MessagesService
  ) {}

  ngOnInit() {
    this.authService.refreshAccount();

    this.messagesService.messages$.subscribe((messages) => {
      console.log('new messages', messages);
      this.messages = messages;
    });

    this.messagesService.pushMessage({
      content: 'Welcome to Meal Master!',
      type: 'info',
    });

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
