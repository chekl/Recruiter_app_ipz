import {DOCUMENT} from '@angular/common';
import {Inject, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  public window: Window | null;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.window = this.document.defaultView;
  }
}
