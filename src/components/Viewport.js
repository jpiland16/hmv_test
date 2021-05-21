import './Viewport.css'
import Menu from './menu/Menu'
import React from 'react'
import Visualizer from './visualizer/Visualizer';
import * as THREE from 'three'

// Window resize code: see https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs

let childrenOf = {};
let parentOf = {};

export default function Viewport() {

    const useGlobalQs = true;
    const rippleEffect = true;

    const files = React.useRef([]);
    files.current.length === 0 && getFileList();

    async function doXHR(method, url) {
        return new Promise(function(myResolve, myReject) {
            let x = new XMLHttpRequest();
            x.open(method, url);
            x.onload = () => {
                myResolve(x);
            }
            x.onerror = () => { myReject(x); }
            x.send()
        });
    }
    
    async function getFileList() {
        doXHR("GET", "/api/get-file-list").then(
            (xhrr) => {
                try {
                    files.current = JSON.parse(xhrr.responseText);
                } catch (e) {
                    console.warn("Error in processing files...");
                    console.error(e);
                    files.current = [{
                        id: 'root2',
                        name: 'We apologize, but the files could not be loaded due to a JSON error. So, we capitalized upon this to create a very longer folder name for testing.',
                        children: [{
                          id: 'test1',
                          name: 'test1',
                          children: [{
                            id: 'test2',
                            name: 'test2'
                          }]
                        }],
                    }]
                }
            },
            (errXhrr) => {
                console.error("XHR Error");
                console.log(errXhrr.status);
                console.log(errXhrr.statusText);
                console.log(errXhrr.responseText);
            }
        )
    }

    const [ expandedItems, setExpandedItems ] = React.useState(["/"]);
    const [ selectedFile, setSelectedFile ] = React.useState("");
    const [ searchFileText, setSearchFileText ] = React.useState("");
    const [ modelLoaded, setModelLoaded ] = React.useState(false);
    const [ bones, setBones ] = React.useState(null);
    const [ quaternionValues, updateModel ] = React.useState(null);
    const [ modelNeedsUpdating, setModelNeedsUpdating ] = React.useState(false);
    const [ menuIsOpen, setMenuIsOpen ] = React.useState(false); // Menu is closed by default
    const [ menuIsPinned, setMenuIsPinned ] = React.useState(true); // Menu is pinned by default

    function getWindowDimensions() {
            const { innerWidth: width, innerHeight: height } = window;
            return [
                width,
                height
            ];
      }
      
    function useWindowDimensions() {
        const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());
      
        React.useEffect(() => {
            function handleResize() {
              setWindowDimensions(getWindowDimensions());
            }
        
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);
      
        return windowDimensions;
    }

    const setParent = (bones, childName, parentName) => {
        //console.log(childName + " is a child of " + parentName);
        parentOf[childName] = parentName;

        if (!childrenOf[parentName]) {
            childrenOf[parentName] = [];
        }
        childrenOf[parentName].push(childName);

        bones[parentName].attach(bones[childName])
    }

    function onLoadBones(bones) {
        setBones(bones);

        setParent(bones, "RUA", "BACK");
        setParent(bones, "RLA", "RUA");
        setParent(bones, "LUA", "BACK");
        setParent(bones, "LLA", "LUA");

        let boneList = Object.getOwnPropertyNames(bones);
        let newModelState = { };
        for (let i = 0; i < boneList.length; i++) {
            let boneQ = bones[boneList[i]].quaternion; // This is the "local" quaternion
            if(useGlobalQs) {
                let globalQ = getGlobalFromLocal(bones, boneQ, boneList[i]);
                newModelState[boneList[i]] = [globalQ.x, globalQ.y, globalQ.z, globalQ.w];
            } else {
                newModelState[boneList[i]] = [boneQ.x, boneQ.y, boneQ.z, boneQ.w];
            }
        }
        updateModel(newModelState);
    }

    function getGlobalFromLocal(bones, localQ, currentBoneName) {
        let globalQ = new THREE.Quaternion();
        globalQ.copy(localQ); 

        while (parentOf[currentBoneName]) {
            globalQ.multiply(bones[parentOf[currentBoneName]].quaternion)
            currentBoneName = parentOf[currentBoneName];
        }

        return globalQ;
    }

    function getLocalFromGlobal(globalQ, currentBoneName) {
        let localQ = new THREE.Quaternion();

        while (parentOf[currentBoneName]) {
            let parentQ = new THREE.Quaternion();
            parentQ.copy(bones[parentOf[currentBoneName]].quaternion);
            localQ.premultiply(parentQ.invert())
            currentBoneName = parentOf[currentBoneName];
        }

        localQ.premultiply(globalQ);
        return localQ;
    }

    function updateSingleQValue(boneId, qIndex, newValue) {
        let newModelState = { ...quaternionValues }; // Create shallow clone of old model state
        newModelState[boneId][qIndex] = newValue;
        let newQ = newModelState[boneId];
        bones[boneId].quaternion.set(newQ[0], newQ[1], newQ[2], newQ[3]);
        updateModel(newModelState);
    }

    function batchUpdateObject(boneId, newQ) {
        let newModelState = { ...quaternionValues }; // Create shallow clone of old model state
        newModelState[boneId] = newQ;

        if (useGlobalQs) {
            let globalQ = new THREE.Quaternion(newQ[0], newQ[1], newQ[2], newQ[3]);
            let localQ = getLocalFromGlobal(globalQ, boneId)

            bones[boneId].quaternion.set(localQ.x, localQ.y, localQ.z, localQ.w);
        
            let affectedByInheritance = [];
            
            if (childrenOf[boneId]) affectedByInheritance.push(...childrenOf[boneId])

            while (affectedByInheritance.length > 0) {
                let currentBone = affectedByInheritance.shift();
                if (childrenOf[currentBone]) affectedByInheritance.push(...childrenOf[currentBone])
                let localQ = bones[currentBone].quaternion;
                let globalQ;
                if (rippleEffect) {
                    globalQ = getGlobalFromLocal(bones, localQ, currentBone);
                    newModelState[currentBone] = [globalQ.x, globalQ.y, globalQ.z, globalQ.w];
                } else {
                    let oldQ = quaternionValues[currentBone];
                    globalQ = new THREE.Quaternion(oldQ[0], oldQ[1], oldQ[2], oldQ[3]);
                    let newLocalQ = getLocalFromGlobal(globalQ, currentBone);
                    bones[currentBone].quaternion.set(newLocalQ.x, newLocalQ.y, newLocalQ.z, newLocalQ.w);
                }
            }

        } else {
            bones[boneId].quaternion.set(newQ[0], newQ[1], newQ[2], newQ[3]);
        }

        updateModel(newModelState);
        setModelNeedsUpdating(true);
    }

    return (
        <div className="myView">
            <Menu 
                isOpen={menuIsOpen}
                setIsOpen={setMenuIsOpen}
                isPinned={menuIsPinned}
                setIsPinned={setMenuIsPinned}
                
                expandedItems={expandedItems} 
                setExpandedItems={setExpandedItems} 
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                getWindowDimensions={useWindowDimensions}
                searchFileText={searchFileText}
                setSearchFileText={setSearchFileText}

                modelLoaded={modelLoaded}
                sliderValues={quaternionValues}
                updateModel={updateSingleQValue}
                batchUpdate={batchUpdateObject}
                bones={bones}
                fileList={files}
            />
            <Visualizer 
                modelLoaded={modelLoaded}
                setModelLoaded={setModelLoaded}
                setBones={onLoadBones}
                modelNeedsUpdating={modelNeedsUpdating}
                setModelNeedsUpdating={setModelNeedsUpdating}
                onClick = {
                    (event) => !menuIsPinned && setMenuIsOpen(false)
                }
            />
        </div>
    )
}