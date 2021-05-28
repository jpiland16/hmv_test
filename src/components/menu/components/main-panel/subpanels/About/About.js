export default function About(props) {
    return (
        <div style={{display: props.display}}>
            Test page for HMV project <br />
            Jonathan Piland | 2021

            <h2>Some notes</h2>
            The quaternions are constrained to be unit quaternions. This is why you may notice other sliders moving when you adjust one value.

            <h3>Viewport controls</h3>
            The viewport uses Three.js OrbitControls, which means that 
            <ul>
                <li>left click and drag is rotate (single finger drag on mobile),</li>
                <li>right click and drag is move (double finger drag on mobile), and</li>
                <li>scrolling controls zoom (pinch in/out on mobile).</li>
            </ul>

            <br />

            <a href="https://github.com/jpiland16/hmv_test/" target="_blank" rel="noreferrer">View code on GitHub</a>

            <br /><br /><br />

            The mannequin shown is modified from <a href="https://skfb.ly/onNqw" target="_blank" rel="noreferrer">Mannequin</a> by <a href="https://sketchfab.com/xaratoni7" target="_blank" rel="noreferrer">3d</a> which is licensed under <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">Creative Commons Attribution</a>.

            <br/><br/>

            This project uses the <a href="https://github.com/recharts/recharts" target="_blank" rel="noreferrer">Recharts</a> library which is released by Recharts Group under the <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noreferrer">MIT</a> license.

        </div>
    );
}