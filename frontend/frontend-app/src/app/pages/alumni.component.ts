import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlumniService } from '../services/alumni.service';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alumni',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="header">
        <h2>Alumni Network</h2>
        <div class="search-bar">
          <input type="text" placeholder="Search by Company (e.g. Google)"
                 [(ngModel)]="searchCompany" (keyup.enter)="search()">
          <button class="btn-primary" (click)="search()">Search</button>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading" *ngIf="loading">
        <p>Loading alumni...</p>
      </div>

      <div class="main-content" *ngIf="!loading">
        <!-- Alumni Cards Grid -->
        <div class="alumni-section" [class.with-chat]="chatOpen">
          <div class="alumni-grid">
            <div class="alumni-card" *ngFor="let alum of alumni"
                 [class.active]="selectedAlumni?._id === alum._id">
              <div class="avatar" [style.background]="getAvatarColor(alum.name)">
                {{ alum.name.charAt(0).toUpperCase() }}
              </div>
              <h3>{{ alum.name }}</h3>
              <p class="role">{{ alum.jobRole }}</p>
              <p class="company">@ {{ alum.company }}</p>
              <p class="batch">Batch: {{ alum.batch }} · {{ alum.department }}</p>
              <div class="skills-row" *ngIf="alum.skills?.length > 0">
                <span class="skill-tag" *ngFor="let skill of alum.skills.slice(0, 3)">{{ skill }}</span>
              </div>
              <p class="bio" *ngIf="alum.bio">{{ alum.bio }}</p>
              <div class="card-actions">
                <span class="availability" [class.online]="alum.available">
                  {{ alum.available ? '🟢 Available' : '🔴 Unavailable' }}
                </span>
                <button class="btn-chat" (click)="openChat(alum)"
                        [disabled]="!alum.available">
                  💬 Chat
                </button>
              </div>
              <a *ngIf="alum.linkedin" [href]="alum.linkedin" target="_blank" class="linkedin-link">
                🔗 LinkedIn
              </a>
            </div>

            <div *ngIf="alumni.length === 0" class="empty-state">
              <p>No alumni found. Try searching for a specific company or check back later!</p>
            </div>
          </div>
        </div>

        <!-- Inline Chat Panel -->
        <div class="chat-panel" *ngIf="chatOpen">
          <div class="chat-header">
            <div class="chat-title">
              <h3>{{ selectedAlumni?.company }} Chat</h3>
              <span class="chat-subtitle">Talking with {{ selectedAlumni?.name }}</span>
            </div>
            <button class="btn-close" (click)="closeChat()">✕</button>
          </div>

          <div class="messages-area" #scrollContainer>
            <div class="chat-info">
              <p>👋 Welcome to the <strong>{{ selectedAlumni?.company }}</strong> alumni channel!</p>
              <p>Ask about work culture, interview tips, or career advice.</p>
            </div>
            <div *ngFor="let msg of messages" class="message-bubble"
                 [ngClass]="{'own-message': msg.senderId === currentUserId}">
              <div class="sender-name" *ngIf="msg.senderId !== currentUserId">{{ msg.senderName }}</div>
              <div class="message-content">{{ msg.message }}</div>
              <div class="timestamp">{{ msg.timestamp | date:'shortTime' }}</div>
            </div>
          </div>

          <div class="input-area">
            <input type="text" [(ngModel)]="newMessage"
                   (keyup.enter)="sendMessage()"
                   placeholder="Type a message...">
            <button (click)="sendMessage()" [disabled]="!newMessage.trim()">Send</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
    }
    h2 { color: #2c3e50; margin: 0; }

    .search-bar { display: flex; gap: 0.5rem; }
    .search-bar input {
      padding: 0.6rem; border: 1px solid #ddd; border-radius: 6px; width: 250px;
      font-size: 0.95rem;
    }
    .search-bar input:focus { outline: none; border-color: #3498db; }

    .btn-primary {
      padding: 0.6rem 1.2rem; background: #3498db; color: white;
      border: none; border-radius: 6px; cursor: pointer; font-weight: 500;
    }
    .btn-primary:hover { background: #2980b9; }

    .loading { text-align: center; padding: 2rem; color: #7f8c8d; }

    /* Main Layout */
    .main-content {
      display: flex; gap: 1.5rem; align-items: flex-start;
    }

    .alumni-section { flex: 1; transition: all 0.3s ease; }
    .alumni-section.with-chat { flex: 0 0 45%; }

    .alumni-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    .alumni-section.with-chat .alumni-grid {
      grid-template-columns: 1fr;
    }

    /* Alumni Card */
    .alumni-card {
      background: white; padding: 1.5rem; border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 2px solid transparent;
    }
    .alumni-card:hover { transform: translateY(-3px); box-shadow: 0 8px 16px rgba(0,0,0,0.1); }
    .alumni-card.active { border-color: #3498db; box-shadow: 0 4px 12px rgba(52,152,219,0.2); }

    .avatar {
      width: 56px; height: 56px; color: white;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem; font-weight: bold; margin: 0 auto 0.8rem;
    }

    h3 { margin: 0.4rem 0; color: #2c3e50; font-size: 1.05rem; }
    .role { color: #7f8c8d; font-size: 0.85rem; margin: 0.15rem 0; }
    .company { color: #2c3e50; font-weight: 600; margin: 0.15rem 0; font-size: 0.95rem; }
    .batch { color: #95a5a6; font-size: 0.78rem; margin: 0.3rem 0; }

    .skills-row {
      display: flex; gap: 0.4rem; flex-wrap: wrap; justify-content: center;
      margin: 0.6rem 0;
    }
    .skill-tag {
      padding: 0.2rem 0.5rem; background: #eef2ff; color: #3b5998;
      border-radius: 12px; font-size: 0.72rem; font-weight: 500;
    }

    .bio {
      font-size: 0.8rem; color: #7f8c8d; margin: 0.5rem 0;
      line-height: 1.4; overflow: hidden; text-overflow: ellipsis;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    }

    .card-actions {
      display: flex; justify-content: space-between; align-items: center;
      margin-top: 0.8rem; gap: 0.5rem;
    }
    .availability { font-size: 0.78rem; color: #7f8c8d; }
    .availability.online { color: #27ae60; }

    .btn-chat {
      padding: 0.45rem 1rem; background: #2ecc71; color: white;
      border: none; border-radius: 6px; cursor: pointer; font-weight: 500;
      font-size: 0.85rem; transition: background 0.2s;
    }
    .btn-chat:hover:not(:disabled) { background: #27ae60; }
    .btn-chat:disabled { opacity: 0.5; cursor: not-allowed; }

    .linkedin-link {
      display: inline-block; margin-top: 0.5rem;
      font-size: 0.78rem; color: #0077b5; text-decoration: none;
    }
    .linkedin-link:hover { text-decoration: underline; }

    .empty-state {
      grid-column: 1 / -1; text-align: center; color: #95a5a6; padding: 3rem;
    }

    /* Chat Panel */
    .chat-panel {
      flex: 0 0 50%; display: flex; flex-direction: column;
      height: 75vh; background: white; border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;
      animation: slideIn 0.3s ease;
      position: sticky; top: 1rem;
    }
    @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

    .chat-header {
      padding: 1rem 1.2rem; background: linear-gradient(135deg, #2c3e50, #34495e);
      color: white; display: flex; justify-content: space-between; align-items: center;
    }
    .chat-header h3 { margin: 0; font-size: 1rem; text-transform: capitalize; }
    .chat-subtitle { font-size: 0.75rem; color: #bdc3c7; }
    .chat-title { display: flex; flex-direction: column; }

    .btn-close {
      background: rgba(255,255,255,0.15); border: none; color: white;
      width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
      font-size: 1rem; display: flex; align-items: center; justify-content: center;
    }
    .btn-close:hover { background: rgba(255,255,255,0.25); }

    .messages-area {
      flex: 1; padding: 1rem; overflow-y: auto; background: #f0f2f5;
      display: flex; flex-direction: column; gap: 0.6rem;
    }

    .chat-info {
      background: #e8f4fd; padding: 0.8rem 1rem; border-radius: 10px;
      margin-bottom: 0.5rem; text-align: center;
    }
    .chat-info p { margin: 0.2rem 0; font-size: 0.82rem; color: #2c3e50; }

    .message-bubble {
      max-width: 80%; padding: 0.6rem 0.9rem; border-radius: 12px;
      position: relative; animation: popIn 0.2s ease;
      background: white; align-self: flex-start;
      box-shadow: 0 1px 2px rgba(0,0,0,0.08);
    }
    @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    .own-message { align-self: flex-end; background: #dcf8c6; }
    .sender-name { font-size: 0.7rem; color: #e58e26; font-weight: bold; margin-bottom: 0.15rem; }
    .message-content { color: #2c3e50; line-height: 1.4; font-size: 0.9rem; }
    .timestamp { font-size: 0.6rem; color: #95a5a6; text-align: right; margin-top: 0.2rem; }

    .input-area {
      padding: 0.8rem; background: white; border-top: 1px solid #eee;
      display: flex; gap: 0.6rem;
    }
    .input-area input {
      flex: 1; padding: 0.6rem 1rem; border: 1px solid #ddd; border-radius: 20px;
      outline: none; font-size: 0.9rem;
    }
    .input-area input:focus { border-color: #3498db; }
    .input-area button {
      padding: 0.5rem 1.2rem; background: #3498db; color: white; border: none;
      border-radius: 20px; font-weight: 500; cursor: pointer; font-size: 0.85rem;
    }
    .input-area button:hover:not(:disabled) { background: #2980b9; }
    .input-area button:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class AlumniComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  alumni: any[] = [];
  searchCompany = '';
  loading = true;

  // Chat
  chatOpen = false;
  selectedAlumni: any = null;
  messages: any[] = [];
  newMessage = '';
  currentUserId = '';
  currentUserName = '';
  private chatSub!: Subscription;

  // Color palette for avatars
  private colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#2c3e50'];

  constructor(
    private alumniService: AlumniService,
    private chatService: ChatService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.currentUserId = user._id;
        this.currentUserName = user.name;
      }
    });

    this.search();

    // Listen for incoming messages
    this.chatSub = this.chatService.getMessages().subscribe((msg: any) => {
      this.messages.push(msg);
      this.scrollToBottom();
    });
  }

  search() {
    this.loading = true;
    this.alumniService.getAlumni(this.searchCompany).subscribe({
      next: (data: any) => {
        this.alumni = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load alumni:', err);
        this.loading = false;
      }
    });
  }

  getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return this.colors[Math.abs(hash) % this.colors.length];
  }

  openChat(alum: any) {
    this.selectedAlumni = alum;
    this.chatOpen = true;
    this.messages = [];

    const room = alum.company.toLowerCase().replace(/\s+/g, '-');
    this.chatService.joinRoom(room);

    // Load chat history
    this.chatService.getChatHistory(room).subscribe({
      next: (data: any) => {
        this.messages = data;
        this.scrollToBottom();
      },
      error: (err: any) => {
        console.error('Failed to load chat history:', err);
      }
    });
  }

  closeChat() {
    this.chatOpen = false;
    this.selectedAlumni = null;
    this.messages = [];
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedAlumni) return;

    const room = this.selectedAlumni.company.toLowerCase().replace(/\s+/g, '-');
    const msgData = {
      room,
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
        if (this.scrollContainer) {
          this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        }
      }, 50);
    } catch (err) { }
  }

  ngOnDestroy() {
    if (this.chatSub) this.chatSub.unsubscribe();
    if (this.chatOpen) {
      this.chatService.disconnect();
    }
  }
}
