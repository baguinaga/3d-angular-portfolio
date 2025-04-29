import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { SceneManagerService } from './scene-manager.service';

@Injectable({
  providedIn: 'root',
})
export class InteractionsService {
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private selectedObject: THREE.Object3D | null = null;

  constructor(private sceneManager: SceneManagerService) {}

  handleMouseMove(event: MouseEvent): void {
    const activeSceneName = this.sceneManager.getActiveScene();
    const camera = this.sceneManager.getCamera(activeSceneName);
    const scene = this.sceneManager.getScene(activeSceneName);

    if (!camera || !scene) return;

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, camera);
    const intersects = this.raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      const object = intersects[0].object;
      console.log('Intersected object:', object);
    }
  }
}
