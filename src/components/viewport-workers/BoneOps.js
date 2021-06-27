export function setParent(props, bones, childName, parentName) {
    //console.log(childName + " is a child of " + parentName);
    props.parentOf[childName] = parentName;

    if (!props.childrenOf[parentName]) {
        props.childrenOf[parentName] = [];
    }
    props.childrenOf[parentName].push(childName);

    bones[parentName].attach(bones[childName])
}

export function onLoadBones(props, bones) {
    props.setBones(bones);

    setParent(props, bones, "RUA", "BACK");
    setParent(props, bones, "RLA", "RUA");
    setParent(props, bones, "LUA", "BACK");
    setParent(props, bones, "LLA", "LUA");
    setParent(props, bones, "BACK", "ROOT");
    
    setParent(props, bones, "RSHOE","RLL")
    setParent(props, bones, "RLL", "RUL");
    setParent(props, bones, "RUL", "ROOT");

    setParent(props, bones, "LSHOE", "LLL")
    setParent(props, bones, 'LLL','LUL')
    setParent(props, bones, "LUL","ROOT");

    // I had to modify this line to filter out 'length' from boneList, which is really confusing to me,
    // since I got my list of bones the same way as the original visualizer does.
    let boneList = Object.getOwnPropertyNames(bones).filter((entry) => entry !== 'length');
    for (let i = 0; i < boneList.length; i++) {
        if (boneList[i] === 'length') { continue; }
        let boneQ = bones[boneList[i]].quaternion; // This is the "local" quaternion
        let globalQ = props.getGlobalFromLocal(props, bones, boneQ, boneList[i]);
        props.globalQs[boneList[i]] = globalQ;
    }

    setSliderPositions(props, bones, props.useGlobalQs.current);
}

export function setSliderPositions(props, bones, useGlobalQs) {

    let boneList = Object.getOwnPropertyNames(bones).filter((entry) => entry !== 'length');
    let newSliderPositions = { };

    for (let i = 0; i < boneList.length; i++) {
        let boneName = boneList[i];
        let sliderQ = useGlobalQs ? 
            props.globalQs[boneName] :
            props.getLocalFromGlobal(props, props.globalQs[boneName], boneName);
        newSliderPositions[boneName] = [sliderQ.x, sliderQ.y, sliderQ.z, sliderQ.w];           
    }
    
    props.setSliderValues(newSliderPositions);

}