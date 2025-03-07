import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) {}

  // Emit a message to the server
  emitEvent(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  // Listen for an event from the server
  listenForEvent(event: string): Observable<any> {
    return this.socket.fromEvent(event);
  }

  // Emit a custom event with a specific room
  joinRoom(room: string): void {
    this.emitEvent('join_room', { room });
  }

  // Leave a room
  leaveRoom(room: string): void {
    this.emitEvent('leave_room', { room });
  }

  // Send a message to a room
  sendMessage(message: string, room: string): void {
    this.emitEvent('message', { message, room });
  }

  // Disconnect from the socket
  disconnect(): void {
    this.socket.disconnect();
  }
}