import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(35);
camera.position.setX(5);
camera.position.setY(-5);
camera.rotateX(0.2)
camera.rotateY(0.2);
camera.rotateZ((-Math.PI/2)+0.5);

renderer.render( scene, camera );

// load a custom blender object
const loader = new GLTFLoader();

var burstObject; // define a variable to animate the burst later

loader.load('grb.glb',  function ( gltf ) {
    const gammaBurst = gltf.scene.children.find((child) => child.name === "Burst");
    burstObject = gammaBurst
    gammaBurst.material.metalness = 0;
    gammaBurst.rotateY(0.05);
    gammaBurst.rotateZ(Math.PI/2);
    // gammaBurst.rotateX(0);
    gammaBurst.scale.set(gammaBurst.scale.x * 1.5,gammaBurst.scale.y * 1.5,gammaBurst.scale.z * 1.5 )
    scene.add( gltf.scene );
  },
  undefined,
  
  function ( error ) {
	  console.error( error );
} );

//  add a pointlight
const pointLight = new THREE.PointLight(0xF4F4F4, 0.75);
pointLight.position.set(20,40,30);

// add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(pointLight, ambientLight)

//  pointlight helper object
// const lightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(lightHelper);

// add controls
// const controls = new OrbitControls(camera, renderer.domElement);

// add background stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.75, 24, 24);
  const material = new THREE.MeshStandardMaterial( {color: 0xffffff });
  const star = new THREE.Mesh( geometry, material );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 1500 ) );

  star.position.set(x, y, z);
  scene.add(star)
}

Array(2000).fill().forEach(addStar)
 
function animate() {
  requestAnimationFrame( animate );
  burstObject.rotation.x += 0.05;
  // burstObject.rotation.y += 0.003;
  // burstObject.rotation.z += 0.002;

  // controls.update();

  renderer.render(scene, camera)
}

animate()