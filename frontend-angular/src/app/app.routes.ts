import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'CS2 Zoo Project' },
  { path: 'about', component: About, title: 'About Us - JL Zoo' },
  { path: 'contact', component: Contact, title: 'Contact Us - JL Zoo' },
  { path: '**', redirectTo: '' }
];
