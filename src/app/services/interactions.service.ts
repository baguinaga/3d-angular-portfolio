import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class InteractionsService {
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private selectedObject: THREE.Object3D | null = null;

  handleMouseMove(
    event: MouseEvent,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    callback?: (object: THREE.Object3D, deltaX: number, deltaY: number) => void,
  ): void {
    if (!camera || !scene) return;
    // TODO: consider using a method to normalize the mouse coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, camera);
    const intersects = this.raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      const deltaX = event.movementX;
      const deltaY = event.movementY;

      // If Callback is provided, call it with the intersected object and delta values
      callback && callback(object, deltaX, deltaY);
    }
  }

  handleMouseDown(
    event: MouseEvent,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    callback?: (object?: THREE.Object3D) => void,
  ): void {
    if (!camera || !scene) return;

    this.raycaster.setFromCamera(this.mouse, camera);
    const intersects = this.raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      this.selectedObject = intersects[0].object;
      callback && callback(this.selectedObject);
    } else {
      callback && callback();
    }
  }

  handleMouseUp(
    event: MouseEvent,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    callback?: () => void,
  ): void {
    this.selectedObject = null;
    callback && callback();
  }
}
