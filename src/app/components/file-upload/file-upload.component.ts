import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../shared/services/upload.service';
import {DataService} from '../../shared/services/data.service';
import { NgxSpinnerService  } from 'ngx-spinner';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent implements OnInit {

  selectedFiles: FileList;
  showError: boolean = false;
  showSuccess: boolean = false;
  errorMessage = "Error Uploading File";

  constructor(private spinner: NgxSpinnerService, private uploadService: UploadService, private dataService: DataService) { }
  
    ngOnInit(): void {
    }
  
  
  upload() {
    this.showError = false;
    this.showSuccess = false;
    this.errorMessage = "Error while Uploading File";
    this.spinner.show();
    this.dataService.getAccDetails().then(resp => {
      const accDetails = JSON.parse(resp);
      const file = this.selectedFiles.item(0);
      const isValidFile = this.validateFile(file);
      if(!isValidFile){
        this.showError = true;
        this.spinner.hide();
        return;
      }
      const managedUpload = this.uploadService.uploadFile(file, accDetails)
      const isUploadSuccess = !managedUpload['failed'];
      console.log(isUploadSuccess);

      if(isUploadSuccess){
        this.showSuccess = true;
      }
      if(!isUploadSuccess){
        this.showError = true;
      }
      this.spinner.hide();
  });
  }
  
  selectFile(event) {
  this.selectedFiles = event['target']['files'];
  }

  validateFile(file){
    let isValidFile = true;
    if (file === null){
      this.errorMessage = 'Error: No file Selected';
      isValidFile = false;
    }
    if (!file?.name.toString().endsWith('.csv')){
      this.errorMessage = 'Error: File must be of file type .csv';
      isValidFile = false;
    }

    return isValidFile;
  }

  
}