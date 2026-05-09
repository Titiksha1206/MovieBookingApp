import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NotificationService, Notification } from '../../services/notification-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-component',
  standalone: false,
  templateUrl: './notification-component.html',
  styleUrl: './notification-component.css',
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription!: Subscription;

  constructor(private notificationService: NotificationService, private cdr: ChangeDetectorRef) {}


  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(notification => {
      
      if (notification.duration === 0) {
        // Remove notification
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
      } else {
        // Add new notification
        this.notifications.push(notification);
      }
      this.cdr.detectChanges(); 
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  removeNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

}
