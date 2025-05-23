import { RealtimeComponent } from './components/realtime/realtime.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptorProvider } from './services/auth-interceptor.interceptor';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DATE_FORMATS,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GridsterComponent, GridsterItemComponent } from 'angular-gridster2';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';

import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TableCardComponent } from './components/table-card/table-card.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SummaryCardComponent } from './components/summary-card/summary-card.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { AiComponent } from './components/ai/ai.component';
import { CustomComponent } from './components/custom/custom.component';
import { WebsiteFormComponent } from './components/website-form/website-form.component';
import { WebsiteManagementComponent } from './components/website-management/website-management.component';
import { UserMenuComponent } from './components/header/user-menu/user-menu.component';
import { RealtimeCardComponent } from './components/realtime-card/realtime-card.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { SingleValueCardComponent } from './components/single-value-card/single-value-card.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YY',
  },
  display: {
    dateInput: 'DD/MM/YY',
    monthYearLabel: 'MMM YY',
    dateA11yLabel: 'DD/MM/YY',
    monthYearA11yLabel: 'MMMM YY',
  },
};

const socketConfig: SocketIoConfig = {
  url: 'http://127.0.0.1:5000',
  options: {
    transports: ['websocket'],
  },
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    TableCardComponent,
    SummaryCardComponent,
    LoginComponent,
    RegisterComponent,
    RealtimeCardComponent,
    AiComponent,
    RealtimeComponent,
    CustomComponent,
    WebsiteFormComponent,
    WebsiteManagementComponent,
    UserMenuComponent,
    DialogComponent,
    SingleValueCardComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    GridsterComponent,
    GridsterItemComponent,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDividerModule,
    MatAutocompleteModule,
    BaseChartDirective,
    SocketIoModule.forRoot(socketConfig),
    MatChipsModule,
    MatDialogModule
  ],
  providers: [
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    provideHttpClient(withInterceptorsFromDi()),
    provideCharts(withDefaultRegisterables()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorProvider,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }