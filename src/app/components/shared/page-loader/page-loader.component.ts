import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { routeTransition } from '../../../animations/animations';
import { SceneManagerService } from '../../../services/scene-manager.service';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrl: './page-loader.component.css',
  animations: [routeTransition],
})
export class PageLoaderComponent implements OnInit {
  constructor(
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    private sceneManager: SceneManagerService,
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.activatedRoute.root.firstChild;
        const scene = currentRoute?.snapshot.data['scene'];

        if (scene) {
          this.sceneManager.setActiveScene(scene);
        } else {
          console.error('No scene defined for this route');
        }
      });
  }
}
