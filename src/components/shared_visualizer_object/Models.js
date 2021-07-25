import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import BasicVisualizerObject from "./Visualizer";

class MannequinVisualizer extends BasicVisualizerObject {

    constructor() {
        super()
        this.targets = {
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
        this.targetDefaults = {
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

                    console.log("STARTING!!!!!!!!!!!")
                    var model = gltf.scene;

                    this.scene.add( model );

                    let boneList = Object.getOwnPropertyNames(this.targets);

                    for (let i = 0; i < boneList.length; i++) {
                        this.bones[boneList[i]] = model.getObjectByName(this.targets[boneList[i]])
                    }
                    console.log("DONE!!!!!!!!!!!")
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
     */
    acceptData(obj) {

    }
}

export { MannequinVisualizer }