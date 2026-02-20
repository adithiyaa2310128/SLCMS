import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],   // 👈 THIS FIXES router-outlet
  templateUrl: './app.html'
})
export class AppComponent {}
