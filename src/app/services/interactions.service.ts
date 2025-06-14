import { Injectable } from '@angular/core';
import { Raycaster, Vector2, Object3D, Scene, PerspectiveCamera } from 'three';
import { ZoomEventData } from '../types/interaction.types';

@Injectable({
  providedIn: 'root',
})
export class InteractionsService {
  private raycaster = new Raycaster();
  private mouse = new Vector2();
  private selectedObject: Object3D | null = null;
  private interactMode = false;
  private previousTouchDistance?: number;
  private isMouseDown = false;
  private mouseDownStartTime: number | null = null;
  private mousePosition: Vector2 = new Vector2();

  private isTouchEndOrInvalid(event: TouchEvent, reqTouches: number): boolean {
    return (
      event.type === 'touchend' ||
      event.type === 'touchcancel' ||
      event.touches.length < reqTouches
    );
  }

  private calculateTouchDistance(touch1: Touch, touch2: Touch): number {
    return Math.sqrt(
      (touch1.clientX - touch2.clientX) ** 2 +
        (touch1.clientY - touch2.clientY) ** 2,
    );
  }

  // TODO: Create stateService to decouple interactMode
  // instead of passing it from app component -> canvas -> scene-manager
  setInteractMode(mode: boolean): void {
    this.interactMode = mode;
  }

  handleMouseMove(
    event: MouseEvent,
    scene: Scene,
    camera: PerspectiveCamera,
    callback?: (mousePosition: Vector2) => void,
  ): void {
    if (!this.interactMode) return;
    if (!camera || !scene) return;
    event.preventDefault();

    // TODO: consider using a method to normalize the mouse coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    callback && callback(this.mousePosition);

    // this.raycaster.setFromCamera(this.mouse, camera);
    // const intersects = this.raycaster.intersectObjects(scene.children, true);

    // TODO: move logic to cube/sphere scene callback
    // if (intersects.length > 0) {
    //   const object = intersects[0].object;
    //   const deltaX = event.movementX;
    //   const deltaY = event.movementY;

    //   // If Callback is provided, call it with the intersected object and delta values
    //   callback && callback(object, deltaX, deltaY);
    // }
  }

  handleMouseDown(
    event: MouseEvent,
    scene: Scene,
    camera: PerspectiveCamera,
    callback?: (object?: Object3D) => void,
  ): void {
    if (!this.interactMode) return;
    if (!camera || !scene) return;
    event.preventDefault();

    this.isMouseDown = true;
    this.mouseDownStartTime = performance.now();

    this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;

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
    scene: Scene,
    camera: PerspectiveCamera,
    callback?: () => void,
  ): void {
    if (!this.interactMode) return;
    event.preventDefault();

    if (this.isMouseDown && this.mouseDownStartTime !== null) {
      const holdDuration = performance.now() - this.mouseDownStartTime; // Calculate hold duration
      const releaseVelocity = Math.min(holdDuration / 1000, 5); // Cap velocity at a maximum value (e.g., 5)

      this.isMouseDown = false;
      this.mouseDownStartTime = null;
      this.selectedObject = null;
      callback && callback();
    }
  }

  handleWheel(
    event: WheelEvent,
    scene: Scene,
    camera: PerspectiveCamera,
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

  handleTouch(
    event: TouchEvent,
    scene: Scene,
    camera: PerspectiveCamera,
    callback?: (data: ZoomEventData) => void,
  ): void {
    if (!this.interactMode) return;
    if (this.isTouchEndOrInvalid(event, 2)) {
      this.previousTouchDistance = undefined;
      return;
    }
    event.preventDefault();

    const data: ZoomEventData = { delta: 0, type: 'touch' };

    // Two-finger touch event (pinch to zoom)
    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentDistance = this.calculateTouchDistance(touch1, touch2);

      // If this is the first touch event, store the distance, otherwise calculate the delta
      if (this.previousTouchDistance === undefined) {
        this.previousTouchDistance = currentDistance;
        return;
      }
      const delta = this.previousTouchDistance - currentDistance;
      data.delta = delta;
      callback && callback(data);

      this.previousTouchDistance = currentDistance;
    }
  }
}
