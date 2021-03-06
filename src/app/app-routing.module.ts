import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeteoComponent } from './components/meteo/meteo.component';
import { ClearComponent } from './components/clear/clear.component';

const routes: Routes = [
  { path: 'accueil', component: MeteoComponent },
  { path: 'clear', component: ClearComponent },
  { path: '', redirectTo: '/accueil', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
