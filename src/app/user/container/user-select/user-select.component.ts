import { Component, OnInit } from '@angular/core';
import { User } from '../../../interface';
import { NgForOf } from '@angular/common';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-select',
  imports: [NgForOf],
  templateUrl: './user-select.component.html',
  styleUrl: './user-select.component.scss',
})
export class UserSelectComponent implements OnInit {
  users: User[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  selectUser(userId: string): void {
    this.router.navigate(['/dashboard', userId]);
  }
}
