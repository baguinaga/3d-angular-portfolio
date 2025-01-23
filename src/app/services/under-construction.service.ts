import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UnderConstructionService {
  private underConstructionSubject = new BehaviorSubject<boolean>(false);
  public underConstruction$ = this.underConstructionSubject.asObservable();

  private underConstructionRoutes = ['/under-construction'];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: () => {
          const isUnderConstruction = this.underConstructionRoutes.includes(
            this.router.url
          );
          this.underConstructionSubject.next(isUnderConstruction);
        },
        error: (err) => {
          console.error('Error during navigation:', err);
          this.underConstructionSubject.next(false);
        },
      });
  }
}
