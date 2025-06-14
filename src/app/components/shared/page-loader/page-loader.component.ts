import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { routeAnimation } from '../../../animations/animations';
import { SceneManagerService } from '../../../services/scene-manager.service';

@Component({
    selector: 'app-page-loader',
    templateUrl: './page-loader.component.html',
    styleUrl: './page-loader.component.css',
    animations: [routeAnimation],
    imports: [RouterOutlet]
})
export class PageLoaderComponent implements OnInit {
  protected activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private sceneManager = inject(SceneManagerService);


  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.activatedRoute.root.firstChild;
        const scene = currentRoute?.snapshot.data['scene'];

        // TODO: create a hollistic method for handling negative cases
        scene
          ? this.sceneManager.setActiveScene(scene)
          : console.error('No scene defined for this route');
      });
  }
}
