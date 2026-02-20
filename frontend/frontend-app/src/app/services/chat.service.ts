import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private socket: Socket;
    private apiUrl = 'http://localhost:3000/api/chat';

    constructor(private http: HttpClient, private authService: AuthService) {
        this.socket = io('http://localhost:3000');
    }

    joinRoom(room: string) {
        this.socket.emit('join_room', room);
    }

    sendMessage(data: { room: string, message: string, senderId: string, senderName: string }) {
        this.socket.emit('send_message', data);
    }

    getMessages() {
        return new Observable((observer) => {
            this.socket.on('receive_message', (data) => {
                observer.next(data);
            });
        });
    }

    getChatHistory(room: string) {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.apiUrl}/${room}`, { headers });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
