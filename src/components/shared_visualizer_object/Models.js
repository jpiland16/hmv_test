import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import BasicVisualizerObject from "./Visualizer";

class MannequinVisualizer extends BasicVisualizerObject {

    constructor() {
        super()
        this.boneNames = {
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

                    let boneList = Object.getOwnPropertyNames(this.boneNames);

                    for (let i = 0; i < boneList.length; i++) {
                        this.bones[boneList[i]] = model.getObjectByName(this.boneNames[boneList[i]])
                    }
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
}

export { MannequinVisualizer }