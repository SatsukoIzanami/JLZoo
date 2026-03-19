import { Component } from '@angular/core';
import { AboutCalendar } from '../../components/about-calendar/about-calendar';

@Component({
  selector: 'app-about',
  imports: [AboutCalendar],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {}
