import Button from '@material-ui/core/Button'

export default function About(props) {
    return (
        <div style={{display: props.display}}>
            <h2>Human Model Visualizer</h2>
            <h4><i><a href="https://github.com/jpiland16/hmv_test/" target="_blank" rel="noreferrer">View code on GitHub</a></i></h4>

            <h3>Authors <i>(alphabetically)</i></h3>
             - Jonathan Piland <br />
             - Samuel Thompson <br />
             - Sophie Williams <br />

            <br />
            <a href="/files/contact-form.html">Click here to send feedback</a>
            <br />

            <h2>Notes</h2>
            The quaternions are constrained to be unit quaternions. This is why you may notice other sliders moving when you adjust one value.

            <h3>Viewport controls</h3>
            The viewport uses Three.js OrbitControls, which means that 
            <ul>
                <li>left click and drag is rotate (single finger drag on mobile),</li>
                <li>right click and drag is move (double finger drag on mobile), and</li>
                <li>scrolling controls zoom (pinch in/out on mobile).</li>
            </ul>

            <h2>Credits</h2>

            The mannequin shown is modified from <a href="https://skfb.ly/onNqw" target="_blank" rel="noreferrer">Mannequin</a> by <a href="https://sketchfab.com/xaratoni7" target="_blank" rel="noreferrer">3d</a> which is licensed under <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">Creative Commons Attribution</a>.

            <br/><br/>
            
            The smartphone shown is modified from <a href="https://skfb.ly/YYsO" target="_blank" rel="noreferrer">Prototype of unnamed smartphone</a> by <a href="https://sketchfab.com/plzok" target="_blank" rel="noreferrer">plzok</a> which is licensed under <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">Creative Commons Attribution</a>.

            <br/><br/>

            This project uses the <a href="https://github.com/recharts/recharts" target="_blank" rel="noreferrer">Recharts</a> library which is released by Recharts Group under the <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noreferrer">MIT</a> license.

            <h5>{ props.dev ? "Done testing?" : "Interested in testing some things out?" }</h5>
            <Button 
                variant="contained" 
                color="secondary" 
                style={{marginBottom: "12px"}}
                onClick={() => {
                        window.location.href = props.dev ? 
                        window.location.href.replace("visualizer/dev", "visualizer")
                        : window.location.href.replace("visualizer", "visualizer/dev")
                    }
                }
            >
                {props.dev ? "exit development mode" : "enter development mode"}
            </Button>

        </div>
    );
}