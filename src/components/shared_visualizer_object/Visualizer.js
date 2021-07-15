import React from 'react'

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const defaultGlobalQuaternions = {
    ROOT: {
        x: 0,
        y: 0,
        z: 0,
        w: 1
    },
    BACK: {
        x: -0.06,
        y: 0,
        z: 0,
        w: 0.998
    },
    LUA: {
        x: -0.472,
        y: -0.468,
        z: 0.561,
        w: -0.494
    },
    LLA: {
        x: -0.471,
        y: -0.466,
        z: 0.51,
        w: -0.549
    },
    RUA: {
        x: 0.471,
        y: -0.471,
        z: 0.561,
        w: 0.492
    },
    RLA: {
        x: 0.471,
        y: -0.468,
        z: 0.509,
        w: 0.547
    },
    RUL: {
        x: 0.001,
        y:-0.029,
        z: 0.999,
        w: 0.044,
    },
    RLL: {
        x:0.001,
        y:-0.035,
        z:0.999,
        w: 0.04,
    },
    RSHOE: {
        x: 0.006,
        y: 0.467,
        z: 0.883,
        w: 0.043
    },
    LUL: {
        x:-0.001,
        y:-0.032,
        z: 0.999,
        w: -0.044,
    },
    LLL: {
        x:-0.001,
        y:-0.034,
        z:0.999,
        w:-0.04,
    },
    LSHOE: {
        x: -0.006,
        y: 0.465,
        z: 0.884,
        w: -0.043
    },
}

let boneNames = {
    ROOT: "_rootJoint",
    BACK: "spine_02",
    LUA: "upperarm_l", 
    LLA: "lowerarm_l", 
    RUA: "upperarm_r", 
    RLA: "lowerarm_r", 
    LUL: "left_upper_leg",
    LLL: "left_lower_leg",
    LSHOE: "foot_l", 
    RUL: "right_upper_leg",
    RLL: "right_lower_leg",
    RSHOE: "foot_r"
}

let initializationCount = 0;

class Visualizer extends React.Component {
    constructor() {
        super();
        this.state = {
            loaded: false,
            quaternions: defaultGlobalQuaternions
        }
    }

    render() {
        return <div style={{width: "100%", height: "100%"}} id={this.props.divId}>Hello world!</div>
    }

}

class VisualizerObject {
    constructor() {
        this.divId = `VisualizerBaseDiv${initializationCount}`
        this.component = <Visualizer divId={this.divId}/>;
        console.log(`This is new VisualizerObject initialization #${initializationCount + 1}.`);
        initializationCount++;

        this.modelLoaded = false;

        this.renderer = null;
        this.camera = null;
        this.scene = null;
        this.controls = null;

        this.bones = { }
    }

    getParentElement() {
        return document.getElementById(this.divId) || null;
    }

    createScene() {
        const parentElement = this.getParentElement(); 

        if (parentElement == null) {
            console.log("Unable to initialize the scene because no scene exists.");
            return Promise.reject();
        }

        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 500 );
        
        this.camera.position.z = 3;
        this.camera.position.y = 0;
    
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.refreshRendererSize(parentElement);
        this.scene.background = new THREE.Color( 0x87cefa);
        this.scene.position.y = -1;
    
        parentElement.appendChild(this.renderer.domElement);
    
        var lightA1 = new THREE.AmbientLight(0xFFFFFF, 3)
        this.scene.add(lightA1)
        this.renderer.render(this.scene, this.camera);
    
        return new Promise((myResolve, myReject) => {
            this.loadModel(this.scene).then(() => {
                this.controls = new OrbitControls( this.camera, this.renderer.domElement );
                this.controls.addEventListener( 'change', () => {
                    this.renderer.render(this.scene, this.camera); 
                });
                this.renderer.render(this.scene, this.camera);
                this.modelLoaded = true;
                myResolve();
            }, () => {
                myReject();
            })
        });
    }

    loadModel() {
    
        var loader = new GLTFLoader();

        const gridPath = window.location.href.substring(0, 22) === "http://localhost:3000/" ? 
        "https://raw.githubusercontent.com/jpiland16/hmv_test/master/files/figures/grid.glb" :
        "/files/figures/grid.glb";

        loader.load(gridPath, gltf => { 
            let mesh = gltf.scene.children[0];
            mesh.material.opacity = 0.4;
            mesh.material.transparent = true;
            this.scene.add(gltf.scene) 
        });

        return new Promise((myResolve, myReject) => {

            const modelPath = window.location.href.substring(0, 22) === "http://localhost:3000/" ? 
            "https://raw.githubusercontent.com/jpiland16/hmv_test/master/files/figures/mannequin.glb" :
            "/files/figures/mannequin.glb";

            loader.load(modelPath, gltf => {

                    var model = gltf.scene;

                    this.scene.add( model );

                    let boneList = Object.getOwnPropertyNames(boneNames);

                    for (let i = 0; i < boneList.length; i++) {
                        this.bones[boneList[i]] = model.getObjectByName(boneNames[boneList[i]])
                    }

                    //console.log("Done loading")
                    myResolve();
                }, function ( xhr ) {
                    console.log(Math.round(xhr.loaded / xhr.total * 100) + "% loaded")
                }, function ( error ) {
                    console.error( error );
                    myReject(error)
                }
            );
        });
    }

    refreshRendererSize() {
        const parentElement = this.getParentElement();
        
        if (parentElement == null) {
            console.log("Unable to modify the scene's size because no scene exists.");
            return;
        }
        this.renderer.setSize( parentElement.offsetWidth, parentElement.offsetHeight );
        this.camera.aspect = parentElement.offsetWidth / parentElement.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.render(this.scene, this.camera);
    }

}

export default VisualizerObject;