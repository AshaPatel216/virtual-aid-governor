import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThailandComponent } from './thailand/thailand.component';
import { UserLocationComponent } from './user-location/user-location.component';

const routes: Routes = [
  { path: 'thai', component: ThailandComponent },
  { path: '', redirectTo: '/thai', pathMatch: 'full' },
  { path: 'location', component: UserLocationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
