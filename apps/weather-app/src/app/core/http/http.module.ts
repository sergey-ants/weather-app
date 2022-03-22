import { HttpClientModule } from '@angular/common/http';
import { HttpService } from '@core/http/http.service';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [HttpClientModule],
    providers: [HttpService],
})
export class HttpModule {}
