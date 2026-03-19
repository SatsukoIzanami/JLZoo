import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-site-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-nav.html',
  styleUrl: './site-nav.css'
})
export class SiteNav {}
