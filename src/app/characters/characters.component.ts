import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css'],
  host: {
    class: 'flex-container',
  },
})
export class CharactersComponent {
  @Input() characters$: Observable<unknown>;
  @Input() openDialog: (a: unknown) => void;
  @Input() setStatusColor: (a: string) => 'green' | 'red';

  trackById(_, { id }) {
    return id;
  }
}
