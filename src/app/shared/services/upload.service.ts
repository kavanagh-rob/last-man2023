import { Injectable, OnInit } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }

  uploadFile(file, accDetails) {
    const contentType = file.type;
    const bucket = new S3(accDetails);
      const params = {
          Bucket: 'last-man-dynamic',
          Key: environment.uploadDirectory+ file.name,
          Body: file,
          ACL: 'public-read',
          ContentType: contentType
      };
      return bucket.upload(params, function (err, data) {
          if (err) {
              return false;
          }
          return true;
      });

}

}
