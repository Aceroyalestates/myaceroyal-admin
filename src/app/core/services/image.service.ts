import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ImageResponse } from '../models/images';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private httpService: HttpService) { }
//transformation={"width":800,"height":600,"crop":"fit"}
  uploadImage(file: File, folder: string = 'properties/images', category: string = 'image', transformation={"width":800,"height":600,"crop":"fit"}, tags?: string[]): Observable<ImageResponse> {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('category', category);
      if (transformation) {
        formData.append('transformation', JSON.stringify(transformation));
      }
      if (tags) {
        formData.append('tags', tags.join(','));
      }
      console.log({formData: formData.values})
    for (const [key, value] of formData.entries()) {
  
      console.log(`${key}:`, value);
    }
      
      return this.httpService.post<ImageResponse>('uploads/single', formData);
    }
}
