import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="chat-container">
      <div class="chat-header">
        <h2>{{ roomName }} Channel</h2>
        <span class="status">● Live</span>
      </div>

      <div class="messages-area" #scrollContainer>
        <div *ngFor="let msg of messages" class="message-bubble" 
             [ngClass]="{'own-message': msg.senderId === currentUserId}">
          <div class="sender-name" *ngIf="msg.senderId !== currentUserId">{{ msg.senderName }}</div>
          <div class="message-content">{{ msg.message }}</div>
          <div class="timestamp">{{ msg.timestamp | date:'shortTime' }}</div>
        </div>
      </div>

      <div class="input-area">
        <input type="text" [(ngModel)]="newMessage" (keyup.enter)="sendMessage()" placeholder="Type a message...">
        <button (click)="sendMessage()">Send</button>
      </div>
    </div>
  `,
    styles: [`
    .chat-container {
      display: flex; flex-direction: column; height: 85vh;
      background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      overflow: hidden;
    }
    
    .chat-header {
      padding: 1rem 1.5rem; background: #2c3e50; color: white;
      display: flex; justify-content: space-between; align-items: center;
    }
    .chat-header h2 { margin: 0; font-size: 1.2rem; text-transform: capitalize; }
    .status { color: #2ecc71; font-size: 0.9rem; font-weight: 500; }

    .messages-area {
      flex: 1; padding: 1.5rem; overflow-y: auto; background: #f0f2f5;
      display: flex; flex-direction: column; gap: 1rem;
    }

    .message-bubble {
      max-width: 70%; padding: 0.8rem 1rem; border-radius: 12px;
      position: relative; animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      background: white; align-self: flex-start;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    .own-message {
      align-self: flex-end; background: #dcf8c6;
    }

    .sender-name {
      font-size: 0.75rem; color: #e58e26; font-weight: bold; margin-bottom: 0.2rem;
    }

    .message-content { color: #2c3e50; line-height: 1.4; }
    
    .timestamp {
      font-size: 0.65rem; color: #95a5a6; text-align: right; margin-top: 0.3rem;
    }

    .input-area {
      padding: 1rem; background: white; border-top: 1px solid #ddd;
      display: flex; gap: 1rem;
    }
    input {
      flex: 1; padding: 0.8rem; border: 1px solid #ddd; border-radius: 20px;
      outline: none; transition: border-color 0.2s;
    }
    input:focus { border-color: #3498db; }
    
    button {
      padding: 0 1.5rem; background: #3498db; color: white; border: none;
      border-radius: 20px; font-weight: 500; cursor: pointer;
    }
    button:hover { background: #2980b9; }
  `]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

    roomName = 'General';
    messages: any[] = [];
    newMessage = '';
    currentUserId = '';
    currentUserName = '';

    private routeSub!: Subscription;
    private chatSub!: Subscription;

    constructor(
        private route: ActivatedRoute,
        private chatService: ChatService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            if (user) {
                this.currentUserId = user._id; // Assuming user object has _id
                this.currentUserName = user.name;
            }
        });

        this.routeSub = this.route.params.subscribe(params => {
            this.roomName = params['room'] || 'general';
            this.joinRoom();
        });

        this.chatSub = this.chatService.getMessages().subscribe((msg: any) => {
            this.messages.push(msg);
            this.scrollToBottom();
        });
    }

    joinRoom() {
        this.messages = []; // Clear previous messages
        this.chatService.joinRoom(this.roomName);
        this.loadHistory();
    }

    loadHistory() {
        this.chatService.getChatHistory(this.roomName).subscribe((data: any) => {
            this.messages = data;
            this.scrollToBottom();
        });
    }

    sendMessage() {
        if (!this.newMessage.trim()) return;

        const msgData = {
            room: this.roomName,
            message: this.newMessage,
            senderId: this.currentUserId,
            senderName: this.currentUserName
        };

        this.chatService.sendMessage(msgData);
        this.newMessage = '';
    }

    scrollToBottom() {
        try {
            setTimeout(() => {
                this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
            }, 50);
        } catch (err) { }
    }

    ngAfterViewChecked() {
        // Optional: scroll on init
    }

    ngOnDestroy() {
        if (this.routeSub) this.routeSub.unsubscribe();
        if (this.chatSub) this.chatSub.unsubscribe();
        this.chatService.disconnect();
    }
}
