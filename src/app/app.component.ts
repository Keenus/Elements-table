import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ElementsTableComponent} from "../assets/components/elements-table/elements-table.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ElementsTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Elements table';
}
