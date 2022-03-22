import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationService } from '@common/services/notification/notification.service';
import { HttpModule } from '@core/http/http.module';
import { NotificationModule } from '@common/services/notification/notification.module';
import { AppRoutingModule } from './routing/app-routing.module';
import { StoreModule } from '@ngrx/store';

@NgModule({
    imports: [BrowserModule, BrowserAnimationsModule, HttpModule, NotificationModule, AppRoutingModule, StoreModule.forRoot({})],
    declarations: [AppComponent],
    providers: [NotificationService],
    bootstrap: [AppComponent],
})
export class AppModule {}
