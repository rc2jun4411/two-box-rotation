// project name: two_box_rotation, with great help by copilot Mika.
//  A Three.js scene with two cubes rotating in opposite directions,
//  audio-reactive scaling, and post-processing effects. 
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { AudioLoader, AudioListener, Audio, AudioAnalyser } from 'three';
//import gsap from 'gsap';

// to fix no sounds problem, added option 2, per Mika's suggestion to use 
// FileLoader to load audio data 
// from here to
import { FileLoader } from 'three';

const loader = new FileLoader();
loader.setResponseType('arraybuffer');
loader.load('/music/suzume_no_tojimari.mp3', function (data) {
  const audioContext = listener.context;
  audioContext.decodeAudioData(data, function (buffer) {
    sound.setBuffer(buffer);

    // Wait for user interaction to play, added from here 1 to
    document.addEventListener('click', () => {
  const audioContext = listener.context;

  if (audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      if (!sound.isPlaying) {
        sound.play();
      }
    });
  } else {
    if (!sound.isPlaying) {
      sound.play();
    }
  }
});
    // there 1

    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
  }, function (err) {
    console.error('Decoding failed:', err);
  });
});
//there

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;  
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
const clock = new THREE.Clock();
const group = new THREE.Group();
scene.add(group);

// lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Post-processing setup
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const afterimagePass = new AfterimagePass();
afterimagePass.uniforms['damp'].value = 0.9;
composer.addPass(afterimagePass);

// Audio setup
const listener = new AudioListener();
camera.add(listener);
const sound = new Audio(listener);
const audioLoader = new AudioLoader();
audioLoader.load('path_to_your_audio_file.mp3', function(buffer) {
  sound.setBuffer(buffer);    
  sound.setLoop(true);
  sound.setVolume(0.5);

    // Wait for user interaction to play
    const playAudio = () => {
      if (!sound.isPlaying) {
    sound.play();
    document.removeEventListener('click', playAudio); // Clean up after first click
      }
    };

    document.addEventListener('click', playAudio);
  },
  undefined,
  err => {
    console.error('Audio load error:', err);
  }
);

const analyser = new AudioAnalyser(sound, 32);
// Create two cubes
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const boxMat = new THREE.MeshNormalMaterial();

// from here, per Mika's suggestion, create two cubes that rotate in opposite directions
// const cube1 = new THREE.Mesh(boxGeo, boxMat); // Will rotate right
// const cube2 = new THREE.Mesh(boxGeo, boxMat); // Will rotate left
//mod here to
const mat1 = new THREE.MeshStandardMaterial({ color: 0xff4444 });
const mat2 = new THREE.MeshStandardMaterial({ color: 0x4444ff });

const cube1 = new THREE.Mesh(boxGeo, mat1);
const cube2 = new THREE.Mesh(boxGeo, mat2);
//there

cube1.position.set(-1, 0, 0);
cube2.position.set(1, 0, 0);

group.add(cube1);
group.add(cube2);
scene.add(group);

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Rotate cube1 to the right (clockwise)
  cube1.rotation.y += 0.01;

  // Rotate cube2 to the left (counter-clockwise) faster
  cube2.rotation.y -= 0.03;

  // Camera orbit and scaling (your existing logic)
  camera.position.x = Math.sin(t * 0.5) * 6;
  camera.position.z = Math.cos(t * 0.5) * 6;
  camera.lookAt(0, 0, 0);

  const freq = analyser.getAverageFrequency();
  const scale = 1 + freq / 500;
  group.scale.setScalar(scale);

  composer.render();
}
animate();