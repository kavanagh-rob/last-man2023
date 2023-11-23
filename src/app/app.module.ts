import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { GameweekComponent } from './components/gameweek/gameweek.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { ContactComponent } from './components/contact/contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { InfoComponent } from './components/info/info.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input' 
import { DataResolver } from './shared/resolvers/data-resolver';
import { EventResolver } from './shared/resolvers/event-resolver';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StatsComponent } from './components/stats/stats.component';
import { LivescoresComponent } from './components/livescores/livescores.component';
import { Ng2SearchPipe } from './shared/pipes/ng2-filter.pipe';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { LoginComponent } from './components/login/login.component'; 
import { authGuard } from './shared/guards/authguard.guard';
import { FormComponent } from './components/form/form.component';
import { ResultsComponent } from './components/results/results.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';


const appRoutes: Routes = [
  {
    path: '',
    resolve: {
      resolvedGameweek: DataResolver,
      resolvedEventInfo: EventResolver
    },
    children: [
      { path: '',
        redirectTo: '/players',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: InfoComponent
      },
      {
        path: 'players',
        component: LeaderboardComponent
      },
      {
        path: 'gameweek',
        component: GameweekComponent
      },
      {
        path: 'stats',
        component: StatsComponent
      },
      {
        path: 'form',
        component: FormComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'login',
        component:LoginComponent,
      },
      {
        path: 'admin',
        component: AdminHomeComponent,
        canActivate: [authGuard],
      },
      {
        path: 'upload',
        component: FileUploadComponent,
        canActivate: [authGuard],
      },
      {
        path: 'results',
        component: ResultsComponent,
        canActivate: [authGuard],
      },
    ]
  },
  { path: '',
    redirectTo: '/players',
    pathMatch: 'full'
  },
  { path: 'pageNotFound', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'players'},

];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    GameweekComponent,
    LeaderboardComponent,
    ContactComponent,
    InfoComponent,
    StatsComponent,
    LivescoresComponent,
    Ng2SearchPipe,
    FileUploadComponent,
    LoginComponent,
    FormComponent,
    ResultsComponent,
    AdminHomeComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
       // <-- debugging purposes only
    ),
    RouterModule.forChild( appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTabsModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  providers: [DataResolver, EventResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
