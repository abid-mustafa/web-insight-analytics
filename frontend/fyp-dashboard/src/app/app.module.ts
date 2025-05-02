import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS, provideNativeDateAdapter } from '@angular/material/core';
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
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { OverviewComponent } from './components/pages/overview/overview.component';
import { TableCardComponent } from './components/table-card/table-card.component';
import { RealtimeComponent } from './components/pages/realtime/realtime.component';
import { provideHttpClient } from '@angular/common/http';
import { SummaryCardComponent } from './components/summary-card/summary-card.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    OverviewComponent,
    TableCardComponent,
    RealtimeComponent,
    SummaryCardComponent,
    LoginComponent,
    RegisterComponent
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
    BaseChartDirective
  ],
  providers: [
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    provideHttpClient(),
    provideCharts(withDefaultRegisterables()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }