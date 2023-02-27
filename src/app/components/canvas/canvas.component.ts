import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.less'],
})
export class CanvasComponent {
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateOnResize();
  }

  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  // Cube Properties
  @Input() public rotationSpeedX: number = 0.01;
  @Input() public rotationSpeedY: number = 0.01;

  // Camera Properties
  @Input() public cameraZ: number = 200;
  @Input() public fieldOfView: number = 1;
  @Input('nearClipping') public nearClippingPlane: number = 1;
  @Input('farClipping') public farClippingPlane: number = 1000;

  // Instance Scene / Geometry Variables
  private camera!: THREE.PerspectiveCamera;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  // Cube Properties
  private geometry = new THREE.BoxGeometry(1, 1, 1);
  private material = new THREE.MeshMatcapMaterial({ color: 0xdddddd });
  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;

  // Create 3D Scene
  private createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xccc9b8);
    this.scene.add(this.cube);
    let aspectRatio = this.getAspectRatio();

    // Instance camera Object
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );
    this.camera.position.z = this.cameraZ;
  }

  // Set camera aspect ratio
  private getAspectRatio(): number {
    return window.innerWidth / window.innerHeight;
  }

  private animateCube(): void {
    this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
  }

  private startRenderingLoop(): void {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: CanvasComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    })();
  }

  private updateOnResize(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
  }
}
