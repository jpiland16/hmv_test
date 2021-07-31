import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { ThreeJSVisualizer, QuaternionTarget } from "./Visualizer";
import Button from '@material-ui/core/Button'

class MannequinVisualizer extends ThreeJSVisualizer {

    constructor() {
        super()

        this.quaternionRoot = new QuaternionTarget( "ROOT", "_rootJoint", new THREE.Quaternion(0, 0, 0, 1))

        const back = this.quaternionRoot.addChild("BACK", "spine_02", new THREE.Quaternion(-0.06, 0, 0, 0.998) )

        const lua = back.addChild("LUA", "upperarm_l", new THREE.Quaternion(-0.472, -0.468, 0.561, -0.494) )
        lua.addChild("LLA", "lowerarm_l", new THREE.Quaternion(-0.471, -0.466, 0.51, -0.549) )

        const rua = back.addChild("RUA", "upperarm_r", new THREE.Quaternion(0.471, -0.471, 0.561, 0.492) )
        rua.addChild("RLA", "lowerarm_r", new THREE.Quaternion(0.471, -0.468, 0.509, 0.547) )
        
        const lul = this.quaternionRoot.addChild("LUL", "left_upper_leg", new THREE.Quaternion(-0.001, -0.032, 0.999, -0.044) )
        const lll = lul.addChild("LLL", "left_lower_leg", new THREE.Quaternion(-0.001, -0.034, 0.999, -0.04) )
        lll.addChild("LSHOE", "foot_l", new THREE.Quaternion(-0.006, 0.465, 0.884, -0.043) )

        const rul = this.quaternionRoot.addChild("RUL", "right_upper_leg", new THREE.Quaternion(0.001, -0.029, 0.999, 0.044) )
        const rll = rul.addChild("RLL", "right_lower_leg", new THREE.Quaternion(0.001, -0.035, 0.999, 0.04) )
        rll.addChild("RSHOE", "foot_r", new THREE.Quaternion(0.006, 0.467, 0.883, 0.043) ) 

    }

    setParentOf(childName, parentName) {
        this.quaternionTargets[childName].parent = this.quaternionTargets[parentName]
        this.bones[parentName].attach(this.bones[childName])
    }

    /**
     * Loads a mannequin into the scene, in addition to the cartesian grid.
     * @override
     */
    loadModel(onProgress) {

        
        return new Promise((myResolve, myReject) => {
            
            this.loadGrid(() => { }).then(() => {

                var loader = new GLTFLoader();

                const modelPath = "/files/figures/mannequin.glb";

                loader.load(modelPath, gltf => {

                            var model = gltf.scene;
                            model.traverse(function(obj) { obj.frustumCulled = false; });
                            
                            this.scene.add( model );

                            /**
                             * Recursively add bones from the model to this.bones.
                             * 
                             * @param {QuaternionTarget} root
                             */
                            const addBones = (root) => {
                                this.bones[root.shortName] = model.getObjectByName(root.boneName)
                                for (let i = 0; i < root.children.length; i++) {
                                    addBones(root.children[i])
                                }
                            }
                            
                            addBones(this.quaternionRoot)
                            this.attachBones(this.quaternionRoot)
                            myResolve();

                        }, function ( xhr ) {
                            onProgress(Math.round(xhr.loaded / xhr.total * 100))
                        }, function ( error ) {
                            console.error( error );
                            myReject(error)
                        }
                    );

                }, (error) => myReject(error));
            });
    }

    /**
     * Attaches all the children of the specified bone to that bone.
     * 
     * @param {QuaternionTarget} target
     */
    attachBones(target) {
        for (let i = 0; i < target.children.length; i++) {
            const childTarget = target.children[i]
            this.bones[target.shortName].attach(this.bones[childTarget.shortName])
            // Recursively traverse the tree to connect all bones in the THREE.js model.
            this.attachBones(childTarget)
        }
    }

    /**
     * Uses the incoming data to move the mannequin.
     * 
     * @param {Object<string, THREE.Quaternion>} quaternions - quaternion data
     * @override
     */
    acceptData(quaternions) {
        if (this.modelLoaded) {
            this.moveBone(this.quaternionRoot, quaternions)
        } else {
            console.warn("WARNING: An attempt was made to move the model before it had fully loaded! " + 
                         "Please check to see that the model-loading promise has been fulfilled first.")
        }
    }

    /**
     * Move a single bone to have a specified global orientation, and 
     * recursively move each of its children by keeping track of relative
     * orientations.
     * 
     * @param {QuaternionTarget} root
     * @param {Object<string, THREE.Quaternion>} quaternions
     * @param {THREE.Quaternion} currentInversionQ
     */
    moveBone(root, quaternions, currentInversionQ = new THREE.Quaternion()) {
        let quaternion = quaternions[root.shortName]

        let nextInversionQ = new THREE.Quaternion().copy(currentInversionQ)

        if (quaternion) { 
            let newGlobalQ = quaternion;
            let newLocalQ = new THREE.Quaternion().copy(currentInversionQ).multiply(newGlobalQ)
            this.bones[root.shortName].quaternion.copy(newLocalQ);
            nextInversionQ.premultiply(newLocalQ.invert())
        } else {
            nextInversionQ.premultiply(new THREE.Quaternion().copy(this.bones[root.shortName].quaternion).invert())
        }

        for (let i = 0; i < root.children.length; i++) {
            this.moveBone(root.children[i], quaternions, nextInversionQ)
        }
    }

    reset() {
        this.resetBone(this.quaternionRoot)
    }

    /**
     * Reset a single bone, and recursively reset all of that bone's children.
     * 
     * @param {QuaternionTarget} root
     */
    resetBone(root) {
        this.bones[root.shortName].quaternion.copy(root.default)
        for (let i = 0; i < root.children.length; i++) {
            this.resetBone(root.children[i])
        }
    }

    /**
     * @override
     */
    getTools() {
        return (<div>
            <Button onClick={() => { if (this.modelLoaded) this.reset()}} style={{opacity: 0.6, margin: "6px"}} color="secondary" size="small" variant="outlined">Reset Model</Button>
            {["front", "back", "left", "right", "top", "bottom"].map((direction) => <Button key={direction} onClick={() => { if (this.modelLoaded) this.setCamera(direction)}}  style={{opacity: 0.6}} size="small">
                {direction}
            </Button>)}
        </div>)
    }

    setCamera(positionDescription) {
        let x, y, z;
        switch (positionDescription) {
            case "top":
                x = 0; y = 3; z = 0;
                break;
            case "bottom":
                x = 0; y = -3; z = 0;
                break;
            case "right":
                x = 3; y = 0; z = 0;
                break;
            case "left":
                x = -3; y = 0; z = 0;
                break;
            case "back":
                x = 0; y = 0; z = -3;
                break;
            case "front":
            default:
                x = 0; y = 0; z = 3;
        }
        this.camera.position.x = x
        this.camera.position.y = y
        this.camera.position.z = z
        this.controls.update()
    }
}

export { MannequinVisualizer }