import './Visualizer.css';
import * as THREE from 'three'
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let renderer, camera, scene;

let boneNames = {
    LUA: "upperarm_l", 
    LLA: "lowerarm_l", 
    RUA: "upperarm_r", 
    RLA: "lowerarm_r", 
    BACK: "spine_02", /** IMPORTANT */
    LSHOE: "foot_l", 
    RSHOE: "foot_r",
    ROOT: "_rootJoint"
}

let bones = {
    
}

function createScene(parentElement) {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 500 );
    
    camera.position.z = 3;
    camera.position.y = 0;
    camera.rotation.z = 1;

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    refreshRendererSize(parentElement);
    scene.background = new THREE.Color( 0x87cefa);
    scene.position.y = -1;

    parentElement.appendChild(renderer.domElement);

    var lightA1 = new THREE.AmbientLight(0xFFFFFF, 3)
    scene.add(lightA1)
    renderer.render(scene, camera);

    return new Promise((myResolve, myReject) => {
        loadModel(scene).then(() => {
            let controls = new OrbitControls( camera, renderer.domElement );
            controls.addEventListener( 'change', () => {
                renderer.render(scene, camera); 
            });
            renderer.render(scene, camera);
            myResolve();
        }, () => {
            myReject();
        })
    });
}

function refreshRendererSize(parentElement) {
    renderer.setSize( parentElement.offsetWidth, parentElement.offsetHeight );
    camera.aspect = parentElement.offsetWidth / parentElement.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera)
}

function loadModel() {
    
    var loader = new GLTFLoader();

    loader.load("files/figures/compass.glb", gltf => { scene.add(gltf.scene) });
    loader.load("files/figures/grid.glb", gltf => { 
        let mesh = gltf.scene.children[0];
        mesh.material.opacity = 0.4;
        mesh.material.transparent = true;
        scene.add(gltf.scene) 
    });

    return new Promise((myResolve, myReject) => {

        const model_path = window.location.href === "http://localhost:3000/" ? 
        "https://raw.githubusercontent.com/jpiland16/hmv_test/master/files/figures/mannequin.glb" :
        "files/figures/mannequin.glb";

        loader.load(model_path, gltf => {
                // gltf.scene.position.set(-2,-2,-2)

                var model = gltf.scene;

                scene.add( model );

                let boneList = Object.getOwnPropertyNames(boneNames);

                for (let i = 0; i < boneList.length; i++) {
                    bones[boneList[i]] = model.getObjectByName(boneNames[boneList[i]])
                }
            
                // bones.BACK.attach(bones.RUA)
                // bones.RUA.attach(bones.RLA) /* IMPORTANT */
                // bones.BACK.attach(bones.LUA)
                // bones.LUA.attach(bones.LLA) /* IMPORTANT */

                //console.log("Done loading")
                myResolve();
            }, function ( xhr ) {
                //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            }, function ( error ) {
                console.error( error );
                myReject(error)
            }
        );
    });
}

export default function Visualizer(props) {

    const thisElementRef = React.useRef(null);

    React.useEffect(() => {
        props.modelLoaded || (createScene(thisElementRef.current, props).then(
            () => {
                props.setModelLoaded(true)
                props.setBones(bones)                
            }, 
            () => props.setModelLoaded(false)
        ));

        props.modelNeedsUpdating && renderer.render(scene, camera) 
        && props.setModelNeedsUpdating(false);

        function handleResize() {
            refreshRendererSize(thisElementRef.current);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });

    return (
        <div ref={thisElementRef} id="visualizationBase" onClick={props.onClick}>
            { props.modelLoaded ? undefined : 
                <div id="loadingSpinner">
                    <CircularProgress /><br />
                    Please wait while the model is loading...
                </div> 
            }
        </div>
    );
}