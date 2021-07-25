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
        return <div style={{width: "100%", height: "100%", marginTop: "-48px" /* marginTop here accounts for transparent title bar */ }} id={this.props.divId}></div>
    }

}

class BasicVisualizerObject {
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

    createScene(props) {

        const MIN_CAMERA_DISTANCE = 1.25;
        const MAX_CAMERA_DISTANCE = 7.5;

        const parentElement = this.getParentElement(); 
    
        if (parentElement === null) {
            console.log("Node is null! No rendering should take place.");
            return;
        }
        
        const width = parentElement.clientWidth;
        const height = parentElement.clientHeight;

        this.camera = new THREE.PerspectiveCamera( 45, width / height, 0.01, 500 );
        this.camera.position.z = 3;
        this.camera.position.y = 0;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.refreshRendererSize(parentElement);

        this.scene.background = new THREE.Color( 0x87cefa);
        this.scene.position.y = -1;
        var light = new THREE.AmbientLight(0xFFFFFF, 3)
        this.scene.add(light)

        // For simplicity, re-render every frame rather than on updates.
        // For performance, it might be better to render on updates only.
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.minDistance = MIN_CAMERA_DISTANCE;
        this.controls.maxDistance = MAX_CAMERA_DISTANCE;

        this.controls.addEventListener( 'change', () => {
            this.renderer.render(this.scene, this.camera); 
        });

        const animate = () => {
            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
        }

        animate();

    
        return new Promise((myResolve, myReject) => {
            this.loadModel(props.baseURL).then(() => {
                parentElement.appendChild(this.renderer.domElement);
                this.modelLoaded = true;
                myResolve();
            }, () => {
                myReject();
            })
        });
    }

    /**
     * Loads a model by obtaining a GLB file which is located at 
     * `baseURL` + (some path to the file). The `baseURL` parameter
     * might need to be removed, as it was a way to use files stored on 
     * GitHub rather than on the developer's machine. This method should
     * be overridden by classes in the Models.js file to implement 
     * different models. (Right now, it shows just an empty grid.)
     * 
     * @param {string} baseURL a root where the server files are stored
     */
    loadModel(baseURL) {
    
        this.loadGrid(baseURL)
        return Promise.resolve()
    }

    /**
     * Loads a simple cartesian grid (in the XZ plane) into the scene.
     * 
     * @param {string} baseURL a root where the server files are stored
     */
    loadGrid(baseURL) {
        var loader = new GLTFLoader();

        const gridPath = baseURL + "/files/figures/grid.glb";

        loader.load(gridPath, gltf => { 
            let mesh = gltf.scene.children[0];
            mesh.material.opacity = 0.4;
            mesh.material.transparent = true;
            this.scene.add(gltf.scene) 
        });
    }

    refreshRendererSize() {
        const parentElement = this.getParentElement();
        
        if (parentElement == null) {
            console.log("Unable to modify the scene's size because no parent element exists.");
            return;
        }

        this.renderer.setSize( parentElement.offsetWidth, parentElement.offsetHeight );
        this.camera.aspect = parentElement.offsetWidth / parentElement.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.render(this.scene, this.camera);
    }

}

export default BasicVisualizerObject;