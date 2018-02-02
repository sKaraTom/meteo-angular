import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { MeteoComponent } from './components/meteo/meteo.component';
import { ClearComponent } from './components/clear/clear.component';
import { AppComponent } from './components/app.component';

const routes: Routes = [
  { path: 'accueil', component: MeteoComponent },
  { path: 'clear', component: ClearComponent },
  { path: '', redirectTo: '/accueil', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
