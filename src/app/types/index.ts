import { Scene, PerspectiveCamera, Vector3, Vector2 } from 'three';
import { InteractionsServiceContract } from '../services/interactions/interactions.service.interface';

export interface ZoomEventData {
  delta: number;
  type: 'wheel' | 'touch';
}

export interface ParticleData {
  velocity: Vector3;
  numConnections: number;
}

export interface InteractiveCallbacks {
  wheel?: (data: ZoomEventData) => void;
  touchmove?: (data: ZoomEventData) => void;
  mousedown?: () => void;
  mousemove?: (position: Vector2) => void;
  mouseup?: (velocity: number) => void;
}

export type SceneFunction = () => {
  name: string;
  scene: Scene;
  camera: PerspectiveCamera;
  animation: () => void;
  callbacks?: InteractiveCallbacks;
};

export type SceneDefinition = ReturnType<SceneFunction>;

export type CreateSceneFunction = (
  interactionsService?: InteractionsServiceContract,
) => SceneDefinition;
