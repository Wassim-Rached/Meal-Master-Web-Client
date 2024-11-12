import { Component, Input } from '@angular/core';
import {
  Message,
  MessagesService,
} from '../../../shared-module/services/messages.service';
import { SharedModule } from '../../../shared-module/shared-module.module';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  @Input({ required: true }) message!: Message;

  constructor(private messagesService: MessagesService) {}

  closeMessage() {
    this.messagesService.removeMessage(this.message);
  }
}
