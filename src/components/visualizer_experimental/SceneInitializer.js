import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

/**
 * Asynchronously creates a THREE.js scene with the mannequin model and Grid asset.
 * @param onProgress (Optional) A function to run on the percentage progress when loading the scene.
 * @returns A Promise that resolves to an Object with the following keys: 
 * - scene: The THREE.js scene to render.
 * 
 * - model: The Mannequin model to move using the target data.
 * 
 * - renderer: A THREE.js Renderer that can render the scene.
 * 
 */
export function initializeScene(onProgress=null) {    
    let scene = new THREE.Scene();    
    scene.background = new THREE.Color( 0x87cefa);
    scene.position.y = -1;

    let light = new THREE.AmbientLight(0xFFFFFF, 3);
    scene.add(light);

    let renderer = new THREE.WebGLRenderer( { antialias: true } );

    return new Promise((myResolve, myReject) => {
        loadModel(onProgress).then(([gridModel, mannequinModel])=>{
            scene.add(gridModel, mannequinModel);
            // refreshRendererSize(currentScene, width, height);
            myResolve({ scene: scene, model: mannequinModel, renderer: renderer });
        });
    })
}

function loadModel(onProgress=null) {
    var loader = new GLTFLoader();
    
    const gridPath = window.location.href.substring(0, 22) === "http://localhost:3000/" ? 
    "https://raw.githubusercontent.com/jpiland16/hmv_test/master/files/figures/grid.glb" :
    "/files/figures/grid.glb";

    const modelPath = window.location.href.substring(0, 22) === "http://localhost:3000/" ? 
    "https://raw.githubusercontent.com/jpiland16/hmv_test/master/files/figures/mannequin.glb" :
    "/files/figures/mannequin.glb";

    let gridPromise = new Promise((myResolve, myReject) => {
        loader.load(gridPath, gltf => { 
            let mesh = gltf.scene.children[0];
            mesh.material.opacity = 0.4;
            mesh.material.transparent = true;
            myResolve(gltf.scene);
        });
    }); //TODO: Add error checking to this part like for the mannequin.

    let mannequinPromise = new Promise((myResolve, myReject) => {
        loader.load(modelPath, gltf => {
            // gltf.scene.position.set(-2,-2,-2)

            var model = gltf.scene;
            // https://discourse.threejs.org/t/parts-of-glb-object-disappear-in-certain-angles-and-zoom/21295/4
		    model.traverse(function(obj) { obj.frustumCulled = false; });

            // let boneList = Object.getOwnPropertyNames(boneNames);

            // for (let i = 0; i < boneList.length; i++) {
            //     bones[boneList[i]] = model.getObjectByName(boneNames[boneList[i]])
            // }
    
            console.log("Done loading model!")
            myResolve(model);
        }, function ( xhr ) {
            // document.getElementById("pctDownloaded").innerText = "(" + Math.round(xhr.loaded / xhr.total * 100) + "% loaded)"
            if (onProgress) { onProgress(Math.round(xhr.loaded / xhr.total * 100)); }
            // setModelDownloadProgress(Math.min(100, Math.round(xhr.loaded / xhr.total * 100)))
        }, function ( error ) {
            console.error( error );
            console.log(error);
            myReject(error)
        });
    });

    return Promise.all([gridPromise, mannequinPromise]);
}