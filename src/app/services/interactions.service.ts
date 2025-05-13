import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { ZoomEventData } from '../types/interaction.types';

@Injectable({
  providedIn: 'root',
})
export class InteractionsService {
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private selectedObject: THREE.Object3D | null = null;
  private interactMode: boolean = false;
  private previousTouchDistance?: number;

  // TODO: Create stateService to decouple interactMode
  // instead of passing it from app component -> canvas -> scene-manager
  setInteractMode(mode: boolean): void {
    this.interactMode = mode;
  }

  handleMouseMove(
    event: MouseEvent,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    callback?: (object: THREE.Object3D, deltaX: number, deltaY: number) => void,
  ): void {
    if (!this.interactMode) return;
    if (!camera || !scene) return;
    event.preventDefault();

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
    if (!this.interactMode) return;
    if (!camera || !scene) return;
    event.preventDefault();

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
    if (!this.interactMode) return;
    event.preventDefault();

    this.selectedObject = null;
    callback && callback();
  }

  // TODO: update other interactive handlers to pass along event data
  // consider
  handleWheel(
    event: WheelEvent,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    callback?: (data: ZoomEventData) => void,
  ): void {
    if (!this.interactMode) return;
    event.preventDefault();

    const data: ZoomEventData = { delta: 0, type: 'wheel' };

    if (event instanceof WheelEvent) {
      // TODO: implement a config for zoomFactor and other settings that
      // could be scene specific (e.g. zoomFactor, rotationSpeed, etc.)
      data.delta = event.deltaY;
      callback && callback(data);
    }
  }

  // TODO: perform real device testing or find a touch emulation solution
  handleTouch(
    event: TouchEvent,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    callback?: (data: ZoomEventData) => void,
  ): void {
    if (!this.interactMode) return;
    if (event.touches.length < 2) return;
    event.preventDefault();

    const data: ZoomEventData = { delta: 0, type: 'touch' };

    // Two-finger touch event (pinch to zoom)
    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];

      const currentDistance = Math.sqrt(
        (touch1.clientX - touch2.clientX) ** 2 +
          (touch1.clientY - touch2.clientY) ** 2,
      );

      if (this.previousTouchDistance != undefined) {
        const delta = this.previousTouchDistance - currentDistance;
        data.delta = delta;
        callback && callback(data);
      }

      this.previousTouchDistance = currentDistance;
    }
  }
}
