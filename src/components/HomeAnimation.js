import { Typography } from "@material-ui/core";
import React from "react";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let model,scene,renderer,frameId,camera = null;
let starttime = new Date().getTime();
let rate = 10; // Hz



export default function HomeAnimation() {

const thisElementRef = React.useRef(null);

function createScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x87cefa);
    scene.position.y = -1;

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.z = 3;

    const lightA1 = new THREE.AmbientLight(0xFFFFFF, 3);
    scene.add( lightA1 );
    
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function addModels() {

    let loader = new GLTFLoader();
    const modelPath = window.location.href.substring(0, 22) === "http://localhost:3000/" ? 
        "https://raw.githubusercontent.com/jpiland16/hmv_test/master/files/figures/mannequin.glb" :
        "/files/figures/mannequin.glb";
    
        loader.load(modelPath, gltf => {
            model = gltf.scene;
            scene.add(model);
        }, 
        xhr => {
                  // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
                },
                // called when loading has errors
                error => {
                  console.log("An error happened" + error);
                }
    );

  };

function renderScene() {
    if (renderer)
      renderer.render(scene, camera);
    let staticImage = document.getElementById("staticImage")
    if (model && staticImage) {
      staticImage.style.opacity = "0"
    }
  };

function start() {
  if (!frameId) {
    frameId = requestAnimationFrame(animate);
  }
};

function animate() {
  let elapsed = new Date().getTime() - starttime;
  window.requestAnimationFrame(animate);
  let frameNumber = Math.round(elapsed/(1000/rate));
  if (frameNumber === frameId)
    return;
  frameId = frameNumber;
  if (model) {
    model.rotation.y += 0.02;}
    renderScene();
};

function stop() {
    cancelAnimationFrame(frameId);
    frameId=undefined;
};

function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener("resize", onWindowResize, false);

React.useEffect(() => {

  createScene();

  thisElementRef.current.appendChild( renderer.domElement );

  addModels();

  renderScene();
   
  start();

  return function cleanUp(){
    stop();
  }
  
}, []);

    return (
      <div id='visualizationBase' ref={thisElementRef} style={{textAlign: "center", backgroundColor: "lightskyblue"}}>
          <img src="/img/static-model.png" style={{
              height: "80%", 
              marginTop: "14.75vh",  
              left: "calc(50vw - 36.3vh + 4px)",
              transition: "opacity 0.5s linear",
              position: "absolute",
            }} id="staticImage"/>
      </div>
    );
}
