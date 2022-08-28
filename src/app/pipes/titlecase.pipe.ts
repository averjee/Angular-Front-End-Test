import { Pipe } from '@angular/core';

@Pipe({
  name: 'titlecase',
})
export class TitlecasePipe {
  transform(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
