import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HashService } from './hash.service';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LandingComponent } from './landing/landing.component';
import { ReservationFormComponent } from './reservation/reservation-form/reservation-form.component';
import { NewUserPageComponent } from './user/new-user-page/new-user-page.component';
import { UserInformationComponent } from './user/user-information/user-information.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { HotelsViewAllComponent } from './hotel/hotels-view-all/hotels-view-all.component';
import { ReservationCompleteFormComponent } from './reservation/reservation-complete-form/reservation-complete-form.component';
import { PostListingComponent } from './hotel/post-listing/post-listing.component';
import { HotelSearchByNameComponent } from './hotel/hotel-search-by-name/hotel-search-by-name.component';
import { HotelsFoundByNameComponent } from './hotel/hotels-found-by-name/hotels-found-by-name.component';
import { AdminHotelsViewComponent } from './hotel/admin-hotels-view/admin-hotels-view.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LandingComponent,
    ReservationFormComponent,
    NewUserPageComponent,
    UserInformationComponent,
    SignInComponent,
    HotelsViewAllComponent,
    ReservationCompleteFormComponent,
    PostListingComponent,
    HotelSearchByNameComponent,
    HotelsFoundByNameComponent,
    AdminHotelsViewComponent  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
  ],
  providers: [HashService],
  bootstrap: [AppComponent]
})
export class AppModule { }
