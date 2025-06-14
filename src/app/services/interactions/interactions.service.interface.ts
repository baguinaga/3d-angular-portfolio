import { Scene, PerspectiveCamera, Vector2, Object3D } from 'three';
import { ZoomEventData } from '../../types';

export interface InteractionsServiceContract {
  setInteractMode(mode: boolean): void;
  handleMouseMove(
    event: MouseEvent,
    scene: Scene,
    camera: PerspectiveCamera,
    callback?: (mousePosition: Vector2) => void,
  ): void;
  handleMouseDown(
    event: MouseEvent,
    scene: Scene,
    camera: PerspectiveCamera,
    callback?: (object?: Object3D) => void,
  ): void;
  handleMouseUp(
    event: MouseEvent,
    scene: Scene,
    camera: PerspectiveCamera,
    callback?: () => void,
  ): void;
  handleWheel(
    event: WheelEvent,
    scene: Scene,
    camera: PerspectiveCamera,
    callback?: (data: ZoomEventData) => void,
  ): void;
  handleTouch(
    event: TouchEvent,
    scene: Scene,
    camera: PerspectiveCamera,
    callback?: (data: ZoomEventData) => void,
  ): void;
}
