import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})
export class AppComponent implements OnInit{
  
  title = 'timesheet';

  constructor(private tokenService: TokenService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.tokenService.message.subscribe((message: { notification: any; }) => {
      if (message) {
        this.messageService.add({ severity: 'success', summary: message.notification!.title, detail: '', life: 30000 });
      }
    })
  }

}
