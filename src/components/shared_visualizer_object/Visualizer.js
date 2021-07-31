import React from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class QuaternionTarget {
    /**
     * Holds a name of a bone in the model, as well as a default quaternion
     * for the bone whenever the model is in some standard position and the 
     * parent bone of this bone.
     * 
     * @param {string} shortName - the all-caps bone abbreviation   
     * @param {string} boneName - the name of the bone
     * @param {THREE.Quaternion} defaultQ - default global quaternion
     * @param {QuaternionTarget} parent - parent bone
     */
    constructor(shortName, boneName, defaultQ = new THREE.Quaternion(), parent = null) {
        this.shortName = shortName
        this.boneName = boneName
        this.default = defaultQ
        /** the current global orientation of this bone */
        this.current = new THREE.Quaternion().copy(defaultQ)
        this.parent = parent
        /** @type QuaternionTarget[] */
        this.children = []
    }

    /**
    * @param {string} shortName - the all-caps bone abbreviation   
    * @param {string} boneName - the name of the bone
    * @param {THREE.Quaternion} defaultQ - default quaternion
    */
    addChild(shortName, boneName, defaultQ = new THREE.Quaternion()) {
        const newChild = new QuaternionTarget(shortName, boneName, defaultQ, this);
        this.children.push(newChild);
        return newChild;
    }

}

function Visualizer(props) {

    const thisElementRef = React.useRef(null)

    React.useEffect(() => {
        props.onChangeWindowDimensions(thisElementRef.current)
        if (thisElementRef.current.children.length === 0) {
            thisElementRef.current.appendChild(props.childElement);
        }
    })

    return <div style={{width: "100%", height: "100%", position: "absolute", top: "0px", left: "0px" }} ref={thisElementRef}></div>
}

class BasicVisualizerObject {

    constructor(onChangeWindowDimensions = (element) => {}, childElement = null) {
        this.component = (windowDimensions) => <Visualizer childElement={childElement} windowDimensions={windowDimensions} onChangeWindowDimensions={onChangeWindowDimensions}/>;
        this.modelLoaded = false;
    }

    initialize(onProgress) {
        this.modelLoaded = true;
        return Promise.resolve()
    }

    /**
     * Accept incoming data from a file. No format or data type is specified
     * here; that will depend on the data source and model implementation.
     * This method shoul be overridden by classes in the Models.js file 
     * to implement different models. (Right now, it does nothing.)
     * 
     * @param {object} obj incoming data
     */
    acceptData(obj) {

    }

    reset() {

    }

    getTools() {
        return null;
    }

    getSliders() {
        return null;
    }

}

class ThreeJSVisualizer extends BasicVisualizerObject {

    constructor() {

        const renderer = new THREE.WebGLRenderer( { antialias: true } );

        super((element) => {
            if (this.modelLoaded) this.refreshRendererSize(element)
        }, renderer.domElement)
    
        this.renderer = renderer
        this.camera = null;
        this.scene = null;
        this.controls = null;

        /** @type {Object.<string, THREE.Object3D>} */
        this.bones = { }        
        /** @type {Object.<string, QuaternionTarget>} */
        this.quaternionTargets = { }
    }

    initialize(onProgress) {

        const MIN_CAMERA_DISTANCE = 1.25;
        const MAX_CAMERA_DISTANCE = 7.5;

        // NOTE: the aspect ratio passed here (1) is IRRELEVANT because we 
        // update it later
        this.camera = new THREE.PerspectiveCamera( 45, 1, 0.01, 500 );
        this.camera.position.z = 3;
        this.camera.position.y = 0;

        this.scene = new THREE.Scene();

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
            this.loadModel(onProgress).then(() => {
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
     * @param {function} onProgress - function to be called while the model
     *      is loading
     */
    loadModel(onProgress) {
        return this.loadGrid(onProgress)
    }

    /**
     * Loads a simple cartesian grid (in the XZ plane) into the scene.
     * 
     */
    loadGrid(onProgress) {
        var loader = new GLTFLoader();

        const gridPath = "/files/figures/grid.glb";

        return new Promise((myResolve, myReject) => {
                loader.load(gridPath, gltf => { 
                let mesh = gltf.scene.children[0];
                mesh.material.opacity = 0.4;
                mesh.material.transparent = true;
                this.scene.add(gltf.scene) 
                myResolve();
            }, (progress) => onProgress(progress.loaded / progress.target * 100), 
            (error) => myReject(error));
        });
    }

    refreshRendererSize(parentElement) {
        this.renderer.setSize( parentElement.offsetWidth, parentElement.offsetHeight );
        this.camera.aspect = parentElement.offsetWidth / parentElement.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.render(this.scene, this.camera);
    }

}

export { BasicVisualizerObject, ThreeJSVisualizer, QuaternionTarget };