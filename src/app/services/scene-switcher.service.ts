import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SceneSwitcherService {
  private activeSceneSubject = new BehaviorSubject<string>('default');
  public activeScene$ = this.activeSceneSubject.asObservable();

  setActiveScene(sceneName: string): void {
    this.activeSceneSubject.next(sceneName);
  }

  getActiveScene(): string {
    return this.activeSceneSubject.getValue();
  }
}
