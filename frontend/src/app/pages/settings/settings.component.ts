import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  userEmail: string | null = null;

  oldPassword = '';
  newPassword = '';
  passwordMessage = '';

  deleteMessage = '';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.userEmail$.subscribe(email => {
      this.userEmail = email;
    });
  }

  savePassword() {
    if (!this.oldPassword || !this.newPassword) {
      this.passwordMessage = 'Both fields are required.';
      return;
    }

    this.auth.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: () => {
        this.passwordMessage = 'Password updated successfully.';
        this.oldPassword = '';
        this.newPassword = '';
      },
      error: (err) => {
        this.passwordMessage = err.error?.message || 'Error updating password.';
      }
    });
  }

  deleteAccount() {
    if (!confirm('Are you sure you want to permanently delete your account?')) return;

    this.auth.deleteAccount().subscribe({
      next: () => {
        this.deleteMessage = 'Your account has been deleted.';
        this.auth.logout();
      },
      error: (err) => {
        this.deleteMessage = err.error?.message || 'Error deleting account.';
      }
    });
  }
}
