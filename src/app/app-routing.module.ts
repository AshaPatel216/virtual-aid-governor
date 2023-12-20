import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThailandComponent } from './thailand/thailand.component';

const routes: Routes = [
  { path: 'thai', component: ThailandComponent },
  { path: '', redirectTo: '/thai', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
