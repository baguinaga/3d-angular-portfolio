import { Scene, PerspectiveCamera, Vector3, Vector2, Object3D } from 'three';
import { InteractionsServiceContract } from '../services/interactions/interactions.service.interface';

export interface ZoomEventData {
  delta: number;
  type: 'wheel' | 'touch';
  numConnections?: number;
}

// Base callback definitions
export type IWheelCallback = (data: ZoomEventData) => void;
export type ITouchMoveCallback = (data: ZoomEventData) => void;

// Callbacks for scene-wide interactions (e.g., particle scene)
export type ISceneMouseDownCallback = () => void;
export type ISceneMouseMoveCallback = (position: Vector2) => void;
export type ISceneMouseUpCallback = (velocity: number) => void;

// Callbacks for specific object interactions (e.g., cube/sphere scenes)
export type IObjectMouseDownCallback = (object: Object3D) => void;
export type IObjectMouseMoveCallback = (
  object: Object3D,
  deltaX: number,
  deltaY: number,
) => void;
export type IObjectMouseUpCallback = () => void;

/**
 * A generic container for interaction callbacks.
 * This allows scenes to specify which kind of interaction signatures they use.
 */
export interface Callbacks<
  TMouseDown = ISceneMouseDownCallback,
  TMouseMove = ISceneMouseMoveCallback,
  TMouseUp = ISceneMouseUpCallback,
  TWheel = IWheelCallback,
  TTouchMove = ITouchMoveCallback,
> {
  mousedown?: TMouseDown;
  mousemove?: TMouseMove;
  mouseup?: TMouseUp;
  wheel?: TWheel;
  touchmove?: TTouchMove;
}

export interface ParticleData {
  velocity: Vector3;
  numConnections: number;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  githubLink: string;
  demoLink: string | null;
  image: string | null;
  toggle: () => void;
}

export interface ProjectsData {
  currentProjects: Project[];
  pastProjects: Project[];
}

export interface ProjectSection {
  title: string;
  id: string;
  projects: Project[];
  isOpen: () => boolean;
  toggle: () => void;
}

export type SceneFunction<T = Callbacks> = () => {
  name: string;
  scene: Scene;
  camera: PerspectiveCamera;
  animation: () => void;
  callbacks?: T;
};

export type SceneDefinition<T = Callbacks> = ReturnType<SceneFunction<T>>;

export type CreateSceneFunction<T = Callbacks> = (
  interactionsService?: InteractionsServiceContract,
) => SceneDefinition<T>;
