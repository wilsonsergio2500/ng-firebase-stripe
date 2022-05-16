import { NgModule } from '@angular/core';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Route, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  <Route>{
    path: '', component: AppComponent, children: [
      <Route>{ path: 'login', component: LoginComponent },
      <Route>{ path: 'register', component: RegisterComponent},
      <Route>{ path: 'main', loadChildren: () => import('./views/main/main.module').then(m => m.MainModule), ...canActivate(redirectUnauthorizedToLogin) },
      <Route> { path: '', loadChildren: () => import('./views/main/main.module').then(m => m.MainModule), ...canActivate(redirectUnauthorizedToLogin) }
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
