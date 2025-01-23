import { Component, TemplateRef, ViewChild } from '@angular/core';
import { themeSwitcher } from '@siemens/ix';
import { ApiServiceService } from './api-service.service';
import { environment } from '../environments/environment';
import { IxModalSize, ModalService } from '@siemens/ix-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('customModal', { read: TemplateRef })
  customModalRef!: TemplateRef<any>;
  showSpinner = false;
  title = 'xampleAppEx';
  
  apiendpoint = environment.apiURL ;
  userinfo: any = {"role":"default","email":"default"};
  fdsENV: any;
  apiUrl: any ;
  constructor(private apiService: ApiServiceService,private readonly modalService: ModalService) { };
  
  ngOnInit() {
    this.showSpinner = true;
    this.apiService.getUserDetails().subscribe(data => {
      this.showSpinner = false;
      console.log("The code-repo is from env -->" + environment.fdsENV);
      this.userinfo = data;
      this.apiUrl = environment.apiURL;
      this.fdsENV = environment.fdsENV;
      console.log(this.userinfo.email);
      if (this.userinfo.email == undefined ){
        //console.log("opening modal dialog");
        this.openModal('480');
      }
    });
  }
  // for selecting themes
  themes = ['theme-classic-light', 'theme-classic-dark'];
  selectedTheme = this.themes[1];

  onItemSelectionChange(event: Event) {
    const customEvent = event as CustomEvent<string | string[]>;
    const newTheme = customEvent.detail[0];
    themeSwitcher.setTheme(newTheme);
    this.selectedTheme = newTheme;
  }
  // for opening modal dialog 
  async openModal(size: IxModalSize) {
    const instance = await this.modalService.open({
      content: this.customModalRef,
      data: size,
      size: size,
    });
  }

}
