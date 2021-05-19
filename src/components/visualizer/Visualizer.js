import './Visualizer.css';
import * as THREE from 'three'
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let renderer, camera, scene;

let boneNames = {
    LUA: "upperarm_l", 
    RUA: "upperarm_r", 
    RLA: "lowerarm_r", 
    LLA: "lowerarm_l", 
    BACK: "spine_03", 
    LSHOE: "foot_l", 
    RSHOE: "foor_r"    
}

let bones = {
    LUA: undefined, 
    RUA: undefined, 
    RLA: undefined, 
    LLA: undefined, 
    BACK: undefined, 
    LSHOE: undefined, 
    RSHOE: undefined
}

function createScene(parentElement) {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 500 );
    
    camera.position.z = 1;
    camera.position.y = 0;
    camera.rotation.z = 1;

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    refreshRendererSize(parentElement);
    scene.background = new THREE.Color( 0x87cefa);
    scene.position.y = -1;

    parentElement.appendChild(renderer.domElement);

    var lightA1 = new THREE.AmbientLight(0xFFFFFF, 1.5)
    scene.add(lightA1)
    renderer.render(scene, camera);

    return new Promise((myResolve, myReject) => {
        loadModel(scene).then(() => {
            let controls = new OrbitControls( camera, renderer.domElement );
            controls.addEventListener( 'change', () => renderer.render(scene, camera) );
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
    return new Promise((myResolve, myReject) => {
        var loader = new GLTFLoader();

        const model_path = "files/figures/claudia.glb";

        loader.load(model_path, gltf => {
                // gltf.scene.position.set(-2,-2,-2)

                var model = gltf.scene;
                scene.add( model );

                let boneList = Object.getOwnPropertyNames(boneNames);

                for (let i = 0; i < boneList.length; i++) {
                    bones[boneList[i]] = model.getObjectByName(boneNames[boneList[i]])
                }
            
                bones.BACK.attach(bones.RUA)
                bones.BACK.attach(bones.RLA)
                bones.BACK.attach(bones.LUA)
                bones.BACK.attach(bones.LLA)
                
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

    const [ modelLoaded, setModelLoaded ] = React.useState(false);

    React.useEffect(() => {
        modelLoaded || (createScene(thisElementRef.current).then(() => setModelLoaded(true), () => setModelLoaded(false)));
        function handleResize() {
            refreshRendererSize(thisElementRef.current);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });

    return (
        <div ref={thisElementRef} id="visualizationBase">
            { modelLoaded ? undefined : 
                <div id="loadingSpinner">
                    <CircularProgress /><br />
                    Please wait while the model is loading...
                </div> 
            }
        </div>
    );
}