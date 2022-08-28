import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DialogComponent } from './dialog/dialog.component';
import { StatusColorPipe } from './status-color.pipe';
import { MaterialModule } from './material/material.module';
import { CharactersComponent } from './characters/characters.component';
import { TitlecasePipe } from './pipes/titlecase.pipe';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  declarations: [AppComponent, DialogComponent, StatusColorPipe, CharactersComponent, TitlecasePipe],
  entryComponents: [DialogComponent],
  bootstrap: [AppComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
