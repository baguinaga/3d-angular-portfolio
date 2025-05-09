import * as THREE from 'three';
import { InteractionsService } from '../services/interactions.service';

export type InteractiveCallbacks = {
  [key: string]: (...args: any[]) => void;
};

export type SceneFunction = () => {
  name: string;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  animation: () => void;
  callbacks?: InteractiveCallbacks;
};

export type SceneDefinition = ReturnType<SceneFunction>;

export type CreateSceneFunction = (
  interactionsService?: InteractionsService,
) => SceneDefinition;
