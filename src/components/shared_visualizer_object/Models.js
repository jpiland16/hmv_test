import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { BasicVisualizerObject, QuaternionTarget } from "./Visualizer";

class MannequinVisualizer extends BasicVisualizerObject {

    constructor() {
        super()

        /** @type {Object.<string, QuaternionTarget>} */
        this.quaternionTargets = {
            ROOT:  new QuaternionTarget("_rootJoint",      new THREE.Quaternion(0, 0, 0, 1), "ROOT"),
            BACK:  new QuaternionTarget("spine_02",        new THREE.Quaternion(-0.06, 0, 0, 0.998), "BACK"),
            LUA:   new QuaternionTarget("upperarm_l",      new THREE.Quaternion(-0.472, -0.468, 0.561, -0.494), "LUA"),
            LLA:   new QuaternionTarget("lowerarm_l",      new THREE.Quaternion(-0.471, -0.466, 0.51, -0.549), "LLA"),
            RUA:   new QuaternionTarget("upperarm_r",      new THREE.Quaternion(0.471, -0.471, 0.561, 0.492), "RUA"),
            RLA:   new QuaternionTarget("lowerarm_r",      new THREE.Quaternion(0.471, -0.468, 0.509, 0.547), "RLA"),
            LUL:   new QuaternionTarget("left_upper_leg",  new THREE.Quaternion(-0.001, -0.032, 0.999, -0.044), "LUL"),
            LLL:   new QuaternionTarget("left_lower_leg",  new THREE.Quaternion(-0.001, -0.034, 0.999, -0.04), "LLL"),
            LSHOE: new QuaternionTarget("foot_l",          new THREE.Quaternion(-0.006, 0.465, 0.884, -0.043), "LSHOE"),
            RUL:   new QuaternionTarget("right_upper_leg", new THREE.Quaternion(0.001, -0.029, 0.999, 0.044), "RUL"),
            RLL:   new QuaternionTarget("right_lower_leg", new THREE.Quaternion(0.001, -0.035, 0.999, 0.04), "RLL"),
            RSHOE: new QuaternionTarget("foot_r",          new THREE.Quaternion(0.006, 0.467, 0.883, 0.043), "RSHOE") 
        }

    }

    setParentOf(childName, parentName) {
        this.quaternionTargets[childName].parent = this.quaternionTargets[parentName]
        this.bones[parentName].attach(this.bones[childName])
    }

    /**
     * Loads a mannequin into the scene, in addition to the cartesian grid.
     * @param {string} baseURL a root where the server files are stored
     * @override
     */
    loadModel(baseURL) {
        this.loadGrid(baseURL)
        
        return new Promise((myResolve, myReject) => {
            
            var loader = new GLTFLoader();

            const modelPath = baseURL + "/files/figures/mannequin.glb";

            loader.load(modelPath, gltf => {

                    var model = gltf.scene;
                    this.scene.add( model );
                    let boneList = Object.getOwnPropertyNames(this.quaternionTargets);

                    for (let i = 0; i < boneList.length; i++) {
                        this.bones[boneList[i]] = model.getObjectByName(this.quaternionTargets[boneList[i]].name)
                    }

                    this.setParentOf("RUA", "BACK");
                    this.setParentOf("RLA", "RUA");
                    this.setParentOf("LUA", "BACK");
                    this.setParentOf("LLA", "LUA");
                    this.setParentOf("BACK", "ROOT");
                    
                    this.setParentOf("RSHOE","RLL")
                    this.setParentOf("RLL", "RUL");
                    this.setParentOf("RUL", "ROOT");

                    this.setParentOf("LSHOE", "LLL")
                    this.setParentOf("LLL", "LUL")
                    this.setParentOf("LUL","ROOT");

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

    /**
     * Uses the incoming data to move the mannequin.
     * 
     * @param {Object<string, THREE.Quaternion>} quaternions - quaternion data
     */
    acceptData(quaternions) {
        for (const bone in quaternions) {
            let newGlobalQ = quaternions[bone];
            let newLocalQ = this.getLocalFromGlobal(newGlobalQ, this.quaternionTargets[bone]);
            this.bones[bone].quaternion.copy(newLocalQ);
        }
    }

    /**
     * Returns the local quaternion needed in order to make the given bone
     * have the desired global quaternion.
     * 
     * @param {THREE.Quaternion} globalQ
     * @param {QuaternionTarget} target
     */
     getLocalFromGlobal(globalQ, target) {
        let localQ = new THREE.Quaternion();
    
        while (target.parent !== null) {
            let parentQ = new THREE.Quaternion();
            console.log(target)
            parentQ.copy(this.bones[target.parent.shortName].quaternion);
            localQ.multiply(parentQ.invert())
            target = target.parent;
        }
    
        localQ.multiply(globalQ);
        return localQ;
    }
}

export { MannequinVisualizer }