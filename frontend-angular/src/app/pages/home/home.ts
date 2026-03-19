import { Component } from '@angular/core';
import { AnimalExhibit } from '../../components/animal-exhibit/animal-exhibit';

@Component({
  selector: 'app-home',
  imports: [AnimalExhibit],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}
