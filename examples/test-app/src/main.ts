import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Manager, GlobalManager, Loop, Core } from 'qarl';

const manager = new Manager();

class ThreeScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  objects: Record<string, THREE.Object3D> = {};
  animations = new Map<string, Core>();

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 5);

    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('canvas') as HTMLCanvasElement,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    this.setupLighting();
    this.createObjects();
    this.startAnimations();
    this.startAnimationLoop();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4CAF50, 0.6, 100);
    pointLight.position.set(-5, 5, 5);
    this.scene.add(pointLight);
  }

  createObjects() {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshLambertMaterial({ color: 0xff6b6b })
    );
    cube.position.set(-3, 0, 0);
    cube.castShadow = true;
    this.scene.add(cube);
    this.objects.cube = cube;

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 32, 32),
      new THREE.MeshLambertMaterial({ color: 0x4ecdc4 })
    );
    sphere.position.set(0, 0, 0);
    sphere.castShadow = true;
    this.scene.add(sphere);
    this.objects.sphere = sphere;

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.6, 0.2, 16, 100),
      new THREE.MeshLambertMaterial({ color: 0x45b7d1 })
    );
    torus.position.set(3, 0, 0);
    torus.castShadow = true;
    this.scene.add(torus);
    this.objects.torus = torus;

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshLambertMaterial({ color: 0x333333 })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2;
    plane.receiveShadow = true;
    this.scene.add(plane);

    this.createArrow();
  }

  createArrow() {
    const arrowGroup = new THREE.Group();
    const material = new THREE.MeshLambertMaterial({ color: 0xff4757 });

    const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.5, 0.1), material);
    shaft.position.y = 0.5;

    const arrow1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.1), material);
    arrow1.position.set(0.2, 1.25, 0);
    arrow1.rotation.z = -Math.PI / 4;

    const arrow2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.1), material);
    arrow2.position.set(-0.2, 1.25, 0);
    arrow2.rotation.z = Math.PI / 4;

    arrowGroup.add(shaft, arrow1, arrow2);
    arrowGroup.rotation.x = Math.PI;
    arrowGroup.position.set(5, 3, 0);

    this.scene.add(arrowGroup);
    this.objects.arrow = arrowGroup;
  }

  startAnimations() {
    const cubeAnim = GlobalManager.create({
      target: this.objects.cube,
      time: 2000,
      from: { rotation: { x: 0, y: 0, z: 0 } },
      to: { rotation: { x: Math.PI * 2, y: Math.PI * 2, z: Math.PI * 2 } },
      easing: 'outElastic',
      loop: true,
      mode: 'pingPong'
    });
    cubeAnim.play();
    this.animations.set('cube', cubeAnim);

    const sphereAnim = GlobalManager.create({
      target: this.objects.sphere,
      time: 3000,
      properties: ['position.x', 'position.y', 'position.z', 'scale.x', 'scale.y', 'scale.z'],
      points: [
        [0, 0, 0, 1, 1, 1],
        [1, 2, 0, 2, .5, 2],
        [-1, 2, 0, 1, 2, 1],
        [0, 0, 0, 1, 1, 1]
      ],
      smoothing: 20,
      easing: 'outBack',
      loop: true,
    });
    sphereAnim.play();
    this.animations.set('sphere', sphereAnim);

    const torusAnim = manager.create({
      target: (this.objects.torus as THREE.Mesh).scale,
      time: 1500,
      from: { x: 1, y: 1, z: 1 },
      to: { x: 2, y: 2, z: 2 },
      loop: true,
      mode: 'pingPong'
    });
    torusAnim.play();
    this.animations.set('torus', torusAnim);

    const arrowAnim = GlobalManager.create({
      target: this.objects.arrow,
      time: 2000,
      properties: ['position.y', 'scale.y', 'rotation.y'],
      points: [
        [3, 1, -Math.PI * 2],
        [0, 0.5, 0],
        [3, 1, Math.PI * 2]
      ],
      smoothing: 20,
      easing: 'inOutSine',
      loop: true,
    });
    arrowAnim.play();
    this.animations.set('arrow', arrowAnim);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  startAnimationLoop() {
    Loop.start(GlobalManager.update);
    Loop.start(manager.update);
    Loop.start(() => {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ThreeScene();
});
