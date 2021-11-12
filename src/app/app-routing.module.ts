import { AdminHotelsViewComponent } from './hotel/admin-hotels-view/admin-hotels-view.component';
import { HotelsFoundByNameComponent } from './hotel/hotels-found-by-name/hotels-found-by-name.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { ReservationFormComponent } from './reservation/reservation-form/reservation-form.component';
import { NewUserPageComponent } from './user/new-user-page/new-user-page.component';
import { UserInformationComponent } from './user/user-information/user-information.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { PostListingComponent } from './hotel/post-listing/post-listing.component';
import { ReservationCompleteFormComponent } from './reservation/reservation-complete-form/reservation-complete-form.component';

const routes: Routes = [
  {path: '', component: LandingComponent },
  {path: 'reservation-form', component: ReservationFormComponent},
  {path: 'new-user-page', component: NewUserPageComponent},
  {path: 'user-information', component: UserInformationComponent},
  {path: 'admin-hotels', component: AdminHotelsViewComponent},
  {path: 'hotels-by-name', component: HotelsFoundByNameComponent},
  {path: 'sign-in', component: SignInComponent},
  {path: 'post-listing', component: PostListingComponent},
  {path: 'reservation-complete', component: ReservationCompleteFormComponent},
  {path: '**', component: LandingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
