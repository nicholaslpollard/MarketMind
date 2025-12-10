import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  userEmail: string | null = null; // displayed user email

  oldPassword = ''; // old password input
  newPassword = ''; // new password input
  passwordMessage = ''; // message for password update

  deleteMessage = ''; // message for account deletion

  constructor(private auth: AuthService) {} // inject auth service

  ngOnInit() {
    // subscribe to email updates
    this.auth.userEmail$.subscribe(email => {
      this.userEmail = email;
    });
  }

  savePassword() {
    // validate both fields
    if (!this.oldPassword || !this.newPassword) {
      this.passwordMessage = 'Both fields are required.';
      return;
    }

    // send password update request
    this.auth.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: () => {
        this.passwordMessage = 'Password updated successfully.';
        this.oldPassword = ''; // reset input
        this.newPassword = ''; // reset input
      },
      error: (err) => {
        this.passwordMessage = err.error?.message || 'Error updating password.'; // show error
      }
    });
  }

  deleteAccount() {
    // confirm destructive action
    if (!confirm('Are you sure you want to permanently delete your account?')) return;

    // send delete request
    this.auth.deleteAccount().subscribe({
      next: () => {
        this.deleteMessage = 'Your account has been deleted.';
        this.auth.logout(); // log user out
      },
      error: (err) => {
        this.deleteMessage = err.error?.message || 'Error deleting account.'; // show error
      }
    });
  }
}
