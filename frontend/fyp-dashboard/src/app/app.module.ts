import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { GridsterModule } from 'angular-gridster2';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

// Angular Material Components
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';

// Pages Components
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { RealtimeComponent } from './components/pages/realtime/realtime.component';
import { AnalyticsComponent } from './components/pages/analytics/analytics.component';
import { UsersComponent } from './components/pages/users/users.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { HelpComponent } from './components/pages/help/help.component';
import { TableWidgetComponent } from './components/table-widget/table-widget.component';
import { SocketService } from './components/services/socket.service';

const socketConfig: SocketIoConfig = {
  url: 'http://192.168.154.45:5000', // Replace with your backend URL
  options: {
    transports: ['websocket'],
  }
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    RealtimeComponent,
    AnalyticsComponent,
    UsersComponent,
    SettingsComponent,
    HelpComponent,
    TableWidgetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    GridsterModule,
    FormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    SocketIoModule.forRoot(socketConfig),
  ],
  providers: [
    SocketService,
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
