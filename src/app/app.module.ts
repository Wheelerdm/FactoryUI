import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';

import { MessagesComponent } from './messages/messages.component';
import { AppRoutingModule }     from './app-routing.module';

import { FactoriesComponent } from './factories/factories.component';
import { FactoryComponent } from './factory/factory.component';
import { FactoryEditorComponent } from './factory-editor/factory-editor.component';
import { HttpClientModule }    from '@angular/common/http';
import { FormBuilder} from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { FactoryCreatorComponent } from './factory-creator/factory-creator.component';
import { MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    AppComponent,

    MessagesComponent,

    FactoriesComponent,
    FactoryComponent,
    FactoryEditorComponent,
    FactoryCreatorComponent    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    CustomFormsModule,
     MatDialogModule,
     MatFormFieldModule,
     ModalModule.forRoot()
  ],
  providers: [FormBuilder],
  bootstrap: [AppComponent],
  exports:[MatDialogModule,MatDialogModule]
})
export class AppModule { }
