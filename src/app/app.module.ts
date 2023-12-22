import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Ngx bootstrap components
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ThailandComponent } from './thailand/thailand.component';
import { UserLocationComponent } from './user-location/user-location.component';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [
    AppComponent,
    ThailandComponent,
    UserLocationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TooltipModule.forRoot(),
    LeafletModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
