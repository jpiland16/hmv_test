import { getLocalFromGlobal, proplessGlobalFromLocal, proplessLocalFromGlobal } from './MathOps';

//TODO: Move this to JSON data file?
/**
 * Maps the name of parent bones to names of children.
 * Check if a bone has children using the boolean value of `boneChildMap[parent]`.
 */
export const boneChildMap = {
    BACK: [ "RUA", "LUA" ],
    RUA: [ "RLA" ],
    LUA: [ "LLA" ],
    ROOT: [ "BACK", "RUL", "LUL" ],
    RLL: [ "RSHOE" ],
    RUL: [ "RLL" ],
    LLL: [ "LSHOE" ],
    LUL: [ "LLL" ],
}

/**
 * Maps the name of child bones to the name of their parent.
 * Check fi a bone has a parent using the boolean value of `boneParentMap[child]`.
 */
export const boneParentMap = generateBoneParentMap(boneChildMap);

/**
 * Creates an Object which can be used to look up the parent of a specific bone given 
 * its name.
 * @param {Object} childrenMap An Object mapping bone names to a list of the names of
 * direct child bones.
 * @returns An Object mapping the name of each child bone to its direct parent's name.
 */
function generateBoneParentMap(childrenMap) {
    let parentMap = {};
    for (let parentName of Object.keys(childrenMap)) {
        for (let childName of childrenMap[parentName]) {
            parentMap[childName] = parentName;
        }
    }
    return parentMap;
}

/**
 * Attaches every bone to its child bones in accordance with the static mapping
 * from bone parents to children.
 * @param {Object} bones An Object with bone names as keys.
 */
export function attachBones(bones) {
    for (let parentName of Object.keys(boneChildMap)) {
        for (let childName of boneChildMap[parentName]) {
            attachParentChild(bones[parentName], bones[childName]);
        }
    }
}

// Helper function for `attachBones` which handles null entries
function attachParentChild(parent, child) {
    if (parent && child) {
        parent.attach(child);
    }
}

/**
 * Creates a mapping from bone names to their quaternion orientation in global THREE.js space.
 * @param {Object} bones An Object with bone names as keys mapping to THREE.js bone objects.
 * @returns An Object with the same keys as `bones` mapping each bone to its quaternion transformation
 * in global space.
 */
export function getGlobalQuats(bones) {
    let globalQs = {};
    // For each bone in bones
    for (let boneName of Object.keys(bones)) {
        let boneQ = bones[boneName].quaternion;
        let globalQ = proplessGlobalFromLocal(boneParentMap, bones, boneQ, boneName);
        globalQs[boneName] = globalQ;
    }
    return globalQs;
}

/**
 * 
 * @param {Object} globalQs Maps the name of a bone to its global quaternion orientation.
 * @param {Object} bones Maps the name of a bone to its THREE.js Bone in the model.
 * @param {boolean} useGlobalQs True iff the slider positions should represent global orientations.
 * @returns An Object mapping bone names to a list of numbers [x,y,z,w] corresponding to their
 * quaternion orientation.
 */
export function getNewSliderPositions(globalQs, bones, useGlobalQs) {

    let boneList = Object.getOwnPropertyNames(bones).filter((entry) => entry !== 'length');
    let newSliderPositions = {};

    for (let i = 0; i < boneList.length; i++) {
        let boneName = boneList[i];
        let sliderQ = useGlobalQs ? 
            globalQs[boneName] :
            proplessLocalFromGlobal(globalQs[boneName], boneName, bones, boneParentMap)
        newSliderPositions[boneName] = [sliderQ.x, sliderQ.y, sliderQ.z, sliderQ.w];           
    }
    return newSliderPositions;
}