import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { DialogComponent } from './dialog/dialog.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { StringHelper } from './utils/string-helper';
import { OrderBy } from './utils/order-by';

export interface Origin {
  [key: string]: any;
}

export interface Location {
  [key: string]: any;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: 'female' | 'male' | 'unknown';
  origin: Origin;
  location: Location;
  image: string;
  episode: any[];
  url: string;
  created: Date;
}

export interface HttpRequest {
  info?: {
    count: number;
    pages: number;
    next: string;
    prev: string;
  };
  results?: Character[];
}
export type TOrderTypes = Character['gender'] | 'appearance' | 'default';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  characters$: Observable<any>;
  characterDataSource: MatTableDataSource<Character[]>;
  characterDatabase = new HttpDatabase(this.httpClient);
  searchTerm$ = new BehaviorSubject<string>('');
  resultsEmpty$ = new BehaviorSubject<boolean>(false);
  status = '';
  resultsLength = 0;

  filterFormGroup: FormGroup;
  searchField = new FormControl('');

  dialogRef: MatDialogRef<DialogComponent>;
  orderQuery: TOrderTypes = 'default';


  applyOrder() {
    this.characters$ = of(this.getOrderedChars());
  }

  private setResponse = (response: HttpRequest) => {
    if (!response.info || !response.results) {
      this.resultsEmpty$.next(true);
      return;
    }
    this.resultsEmpty$.next(false);
    this.resultsLength = response.info?.count;
    this.characterDataSource = new MatTableDataSource(this.getOrderedChars(response.results) as any[]);
    this.characterDataSource.paginator = this.paginator;
    this.characters$ = this.characterDataSource.connect();
    this.characterDataSource.filter = this.status;
  };

  constructor(private httpClient: HttpClient, public dialog: MatDialog, private fb: FormBuilder) {}

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.characterDatabase.getCharacters('', '', this.paginator.pageIndex).subscribe((response: HttpRequest) => {
        this.characterDataSource = new MatTableDataSource(response.results as any[]);
        this.resultsLength = response.info?.count;
        this.characters$ = this.characterDataSource.connect();
        this.characterDataSource.filter = this.status;
      });
    });
  }

  ngOnInit() {
    this.filterFormGroup = this.fb.group({});
    this.loadData();
  }

  ngOnDestroy() {
    if (this.characterDataSource) {
      this.characterDataSource.disconnect();
    }
  }

  loadData() {
    this.characterDatabase.search(this.searchTerm$).subscribe(this.setResponse);
  }

  openDialog = char => {
    this.dialogRef = this.dialog.open(DialogComponent, {
      data: {
        c: char,
      },
    });

    this.dialogRef.afterClosed().subscribe((res: string) => {
      if (!res) {
        return;
      }
      this.searchField.patchValue(res);
      this.searchTerm$.next(res);
    });
  };

  applyFilter() {
    this.characterDatabase
      .getCharacters(StringHelper.trimAndLower(this.searchField.value), this.status, this.paginator.pageIndex)
      .subscribe(this.setResponse);

    this.characterDataSource.paginator = this.paginator;
    if (this.characterDataSource.paginator) {
      this.characterDataSource.paginator.firstPage();
    }
  }

  setStatusColor(status: string) {
    if (status === 'Alive') {
      return 'green';
    }
    if (status === 'Dead') {
      return 'red';
    }
  }

  getOrderedChars(chars?: Character[]): Character[] {
    chars ??= this.characterDataSource.connect().value as any as Character[];

    if (this.orderQuery === 'default') return chars;
    if (this.orderQuery === 'appearance') return OrderBy.appearance([...chars]);
    return OrderBy.gender([...chars], this.orderQuery);
  }
}

export class HttpDatabase {
  constructor(private _httpClient: HttpClient) {}

  search(terms: Observable<string>) {
    return terms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term =>
        this.getCharacters(term).pipe(
          catchError(() => {
            return of({ info: null, results: null });
          })
        )
      )
    );
  }

  getCharacters(name: string = '', status: string = '', page: number = 0): Observable<HttpRequest> {
    const apiUrl = 'https://rickandmortyapi.com/api/character';
    return this._httpClient.get<HttpRequest>(apiUrl, {
      params: new HttpParams()
        .set('name', name)
        .set('status', status)
        .set('page', (page + 1).toString()),
    });
  }
}
