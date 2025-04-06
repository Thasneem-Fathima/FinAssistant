import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LanderComponent } from './lander/lander.component';
import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'finmate', component: LanderComponent },
    { path: 'chat', component: ChatComponent },
    { path: '', redirectTo: '/finmate', pathMatch: 'full' },
];
