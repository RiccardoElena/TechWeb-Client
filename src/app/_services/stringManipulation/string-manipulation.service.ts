import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringManipulationService {

  constructor() { }

  clampStringToLength(input: string, length: number): string {
    if (input.length <= length) {
      return input;
    }
    return input.substring(0, length) + '...';
  }
}
