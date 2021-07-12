import React from 'react';
import { useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import './Visualizer.css';

let camera;
let currentDiv;

function refreshRendererSize(parentElement, renderer, scene) {
    if (parentElement == null) {
        console.log("Unable to modify the scene's size because no scene exists.");
        return;
    }
    renderer.setSize( parentElement.offsetWidth, parentElement.offsetHeight );
    camera.aspect = parentElement.offsetWidth / parentElement.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}

export default function ThreeScene(props) {

    const MIN_CAMERA_DISTANCE = 1.25;
    const MAX_CAMERA_DISTANCE = 7.5;

    // const [camera, setCamera] = useState(null);
    console.log("Printing scene info:");
    console.log(props.sceneInfo);

    /**
     * Begins a THREE.js render loop on a given scene.
     * @param parentElement The reference to the DOM element THREE will render to.
     * @param currentScene The Scene to render.
     * @param renderer The renderer to use. 
     */
    function renderScene(parentElement, currentScene, renderer) {    
        if (parentElement === null) {
            console.log("Node is null! No rendering should take place.");
            return;
        }
        console.log(parentElement);
        if (currentScene === null) {
            console.log("No scene to render! No rendering should take place.");
            return;
        }
        console.log("Rendering should take place.");
        const width = parentElement.clientWidth;
        const height = parentElement.clientHeight;

        camera = new THREE.PerspectiveCamera( 45, width / height, 0.01, 500 );
        camera.position.z = 3;
        camera.position.y = 0;

        const onResize = (parentDiv) => {
            console.log("Reacting to resize!");
            const width = parentDiv.clientWidth;
            const height = parentDiv.clientHeight;

            camera.aspect = width/height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
        }

        onResize(parentElement);

        // For simplicity, re-render every frame rather than on updates.
        // For performance, it might be better to render on updates only.
        let controls = new OrbitControls( camera, renderer.domElement );
        controls.minDistance = MIN_CAMERA_DISTANCE;
        controls.maxDistance = MAX_CAMERA_DISTANCE;

        controls.addEventListener( 'change', () => {
            renderer.render(currentScene, camera); 
        });

        const checkForResize = (renderer, parentDiv) => {
            if (!renderer || !parentDiv) { return; }
            let rendererSize = renderer.getSize(new THREE.Vector2());
            if (rendererSize.x != parentElement.clientWidth || rendererSize.y != parentElement.clientHeight) {
                onResize(parentDiv);
            }
        }

        const animate = () => {
            requestAnimationFrame(animate);

            renderer.render(currentScene, camera);

            // 'Listen' (poll) for changes in size to adjust the renderer and camera.
            checkForResize(renderer, parentElement);
            
        }

        animate();
    }

    function updateModelPosition() {
        console.log("Attempting to render the scene.");
        // if (model != null) {
        //     model.position.y += 0.25;
        // }
        // requestAnimationFrame(()=>{ renderer.render(scene,camera)});
    }

    const measuredRef = useCallback(node => {
        currentDiv = node;
        if (node === null) return;
        currentDiv.appendChild(props.sceneInfo.renderer.domElement);
        renderScene(node, props.sceneInfo.scene, props.sceneInfo.renderer);
    }, []);

    useEffect(() => {
        function handleResize() {
            refreshRendererSize(currentDiv, props.sceneInfo.renderer, props.sceneInfo.scene, props.sceneInfo.camera);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
    });


    return (
        <div
            style={{"width": "100%", "height": "100%", "background-color": "green"}}
            ref={measuredRef}
            id="visualizationBase" 
        />
    )
}