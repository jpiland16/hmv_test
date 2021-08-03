import React from 'react';
import { MannequinVisualizer } from './shared_visualizer_object/Models';

export default function MetadataTinkerer() {
    const [visualizer, setVisualizer] = React.useState(null);
    const [slider, setSlider] = React.useState(null);
    const [quaternions, setQuaternions] = React.useState({ });
    const elementRef = React.useRef(null);

    React.useEffect(() => {
        const newVis = new MannequinVisualizer();
        setVisualizer(newVis);
        newVis.initialize().then(() => {
            console.log("Model is loaded!");
            const allSliders = newVis.getSliders(quaternions, setQuaternions);
            if (allSliders === null) { 
                console.log("There are no sliders.")
                return null; 
            }
            console.log("There are sliders!")
            setSlider(allSliders.filter((slider) => slider.props.quaternionTarget.shortName === "RUA")[0]);
        });
        newVis.showSliders = true;

    }, []);

    // React.useEffect(() => {
    //     console.log("Quaternions have been changed!")
    // }, [quaternions]);

    // Copied from QuaternionSelectionDialog
    function getWindowDimensions() {
        console.log("Window width: ");
        console.log(window.innerWidth);
        return [
            200,
            200
        ];
    }

    function VisualizerContainer({ visualizerComponent }) {
        const element = React.useRef(null);
        return (
            <div style={{height: "60vh", width: "30vw", backgroundColor: "magenta"}}>
                {visualizer && 
                    <div style={{ width: "50vw", height: "25vh", backgroundColor: "red", display: "flex", flexDirection: "row"}}>
                        <div style={{ width: "25vw", height: "25vh", backgroundColor: "green"}} ref={element}>
                            {visualizerComponent.component(getWindowDimensions)}
                        </div>
                    </div>
                }
            </div>
        )
    }

    return (
        <div style={{height: "60vh", width: "30vw", backgroundColor: "magenta"}}>
            {visualizer && 
                <div style={{ width: "50vw", height: "25vh", backgroundColor: "red", display: "flex", flexDirection: "row"}}>
                    <div style={{ width: "25vw", height: "25vh", backgroundColor: "green"}}>
                        {visualizer.component(getWindowDimensions)}
                    </div>
                    <div style={{ width: "25vw", height: "25vh", backgroundColor: "yellow"}}>
                        {visualizer.modelLoaded && slider}
                    </div>
                </div>
            }
        </div>
    );
}