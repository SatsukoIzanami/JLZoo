import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteNav } from './layout/site-nav/site-nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteNav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
