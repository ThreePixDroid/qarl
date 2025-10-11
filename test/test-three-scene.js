import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Manager, GlobalManager, Loop } from '../src/index.js';

const manager = new Manager();

class ThreeScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.objects = {};
        this.animations = new Map();
        this.clock = new THREE.Clock();
        this.loop = null;

        this.init();
        this.startAnimations();
        this.startAnimationLoop();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111111);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('canvas'),
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Add OrbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Setup lighting
        this.setupLighting();

        // Create objects
        this.createObjects();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Point light
        const pointLight = new THREE.PointLight(0x4CAF50, 0.6, 100);
        pointLight.position.set(-5, 5, 5);
        this.scene.add(pointLight);

        this.objects.lights = { ambientLight, directionalLight, pointLight };
    }

    createObjects() {
        // Cube
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff6b6b });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-3, 0, 0);
        cube.castShadow = true;
        cube.receiveShadow = true;
        this.scene.add(cube);
        this.objects.cube = cube;

        // Sphere
        const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x4ecdc4 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 0, 0);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        this.scene.add(sphere);
        this.objects.sphere = sphere;

        // Torus
        const torusGeometry = new THREE.TorusGeometry(0.6, 0.2, 16, 100);
        const torusMaterial = new THREE.MeshLambertMaterial({ color: 0x45b7d1 });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.position.set(3, 0, 0);
        torus.castShadow = true;
        torus.receiveShadow = true;
        this.scene.add(torus);
        this.objects.torus = torus;

        // Plane (floor)
        const planeGeometry = new THREE.PlaneGeometry(20, 20);
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -2;
        plane.receiveShadow = true;
        this.scene.add(plane);
        this.objects.plane = plane;

        // Arrow
        this.createArrow();
    }

    createArrow() {
        // Create arrow group
        const arrowGroup = new THREE.Group();

        // Rectangle (arrow shaft)
        const shaftGeometry = new THREE.BoxGeometry(0.5, 1.5, 0.1);
        const shaftMaterial = new THREE.MeshLambertMaterial({ color: 0xff4757 });
        const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
        shaft.position.y = 0.5; // Raise by half height
        shaft.castShadow = false;
        shaft.receiveShadow = false;

        // Two rectangles for arrow head
        const arrowMaterial = new THREE.MeshLambertMaterial({ color: 0xff4757 });

        // First arrow rectangle
        const arrowGeometry1 = new THREE.BoxGeometry(0.8, 0.3, 0.1);
        const arrow1 = new THREE.Mesh(arrowGeometry1, arrowMaterial);
        arrow1.position.set(0.2, 1.25, 0);
        arrow1.rotation.z = -Math.PI / 4; // Rotate 30 degrees
        arrow1.castShadow = false;
        arrow1.receiveShadow = false;

        // Second arrow rectangle
        const arrowGeometry2 = new THREE.BoxGeometry(0.8, 0.3, 0.1);
        const arrow2 = new THREE.Mesh(arrowGeometry2, arrowMaterial);
        arrow2.position.set(-0.2, 1.25, 0);
        arrow2.rotation.z = Math.PI / 4; // Rotate -30 degrees
        arrow2.castShadow = false;
        arrow2.receiveShadow = false;

        // Add parts to group
        arrowGroup.add(shaft);
        arrowGroup.add(arrow1);
        arrowGroup.add(arrow2);

        // Rotate group so arrow points down
        arrowGroup.rotation.x = Math.PI;

        // Position arrow
        arrowGroup.position.set(5, 3, 0);

        this.scene.add(arrowGroup);
        this.objects.arrow = arrowGroup;
    }

    startAnimations() {
        this.animateCube();
        this.animateSphere();
        this.animateTorus();
        this.animateArrow();
    }

    animateCube() {
        const cube = this.objects.cube;
        const animation = GlobalManager.create({
            target: cube,
            time: 2000,
            from: { rotation: { x: 0, y: 0, z: 0 } },
            to: { rotation: { x: Math.PI * 2, y: Math.PI * 2, z: Math.PI * 2 } },
            easing: 'outElastic',
            loop: true,
            mode: 'pingPong'
        });

        animation.play();
        this.animations.set('cube', animation);
    }

    animateSphere() {
        const sphere = this.objects.sphere;
        const animation = GlobalManager.create({
            target: sphere,
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

        animation.play();
        this.animations.set('sphere', animation);
    }

    animateTorus() {
        const torus = this.objects.torus;
        const animation = manager.create({
            target: torus.scale,
            time: 1500,
            from: { x: 1, y: 1, z: 1 },
            to: { x: 2, y: 2, z: 2 },
            easing: 'outBounce',
            loop: true,
            mode: 'pingPong'
        });

        animation.play();
        this.animations.set('torus', animation);
    }

    animateArrow() {
        const arrow = this.objects.arrow;
        const animation = GlobalManager.create({
            target: arrow,
            time: 2000,
            properties: ['position.y', 'scale.y', 'rotation.y'],
            points: [
                [3, 1, -Math.PI * 2],        // Initial position - high, normal size
                [0, 0.5, 0],    // Goes down and compresses on Y (like ball on impact)
                [3, 1, Math.PI * 2]         // Returns to initial state
            ],
            smoothing: 20,
            easing: 'inOutSine',
            loop: true,
        });

        animation.play();
        this.animations.set('arrow', animation);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    startAnimationLoop() {
        this.loop = Loop.start(GlobalManager.update);
        this.loop = Loop.start(manager.update);

        this.loop = Loop.start((dt) => {
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new ThreeScene();
});
