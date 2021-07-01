import React from 'react';
import { useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import './Visualizer.css';

export default function ThreeScene(props) {

    const MIN_CAMERA_DISTANCE = 1.25;
    const MAX_CAMERA_DISTANCE = 7.5;

    // const [camera, setCamera] = useState(null);
    console.log("Printing scene info:");
    console.log(props.sceneInfo);

    function refreshRendererSize(currentScene, width, height, renderer, camera) {
        renderer.setSize( width, height );
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(currentScene, camera);
    }

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

        let camera = new THREE.PerspectiveCamera( 45, width / height, 0.01, 500 );
        camera.position.z = 3;
        camera.position.y = 0;

        // refreshRendererSize(currentScene, width, height);
        renderer.setSize(width, height);

        // For simplicity, re-render every frame rather than on updates.
        // For performance, it might be better to render on updates only.
        let controls = new OrbitControls( camera, renderer.domElement );
        controls.minDistance = MIN_CAMERA_DISTANCE;
        controls.maxDistance = MAX_CAMERA_DISTANCE;
        controls.addEventListener( 'change', () => {
            renderer.render(currentScene, camera); 
        });
        const animate = () => {
            requestAnimationFrame(animate);

            renderer.render(currentScene, camera);
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

    let currentDiv;

    const measuredRef = useCallback(node => {
        currentDiv = node;
        if (node === null) return;
        currentDiv.appendChild(props.sceneInfo.renderer.domElement);
        renderScene(node, props.sceneInfo.scene, props.sceneInfo.renderer);
    }, []);

    useEffect(() => {
        if (currentDiv == null) {
            console.log("No div reference to update!");
            return;
        }
        // renderScene(currentDiv, props.scene, props.renderer);
        // Maybe add some code to return a function that removes this from the DOM?
    });


    return (
        <div
            ref={measuredRef}
            id="visualizationBase" 
        />
    )
}