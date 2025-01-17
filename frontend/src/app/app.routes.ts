import { Routes } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import {RegisterComponent} from "./components/register/register.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {AuthGuard} from "./auth/auth.guard";
import {AdminComponent} from "./components/admin/admin.component";
import {AdminGuard} from "./components/admin/admin.guard";
import {RoomsComponent} from "./components/rooms/rooms.component";
import {RoomDetailsComponent} from "./components/room-details/room-details.component";
import {RoomIntroComponent} from "./components/room-intro/room-intro.component";
import {PaintingsComponent} from "./components/painting/painting.component";

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'paintings', component: PaintingsComponent },
  { path: 'roomintro/:id', component: RoomIntroComponent },
  { path: 'room/:id', component: RoomDetailsComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // default route to home
];
