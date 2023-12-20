import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Ngx bootstrap components
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ThailandComponent } from './thailand/thailand.component';

@NgModule({
  declarations: [
    AppComponent,
    ThailandComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TooltipModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
