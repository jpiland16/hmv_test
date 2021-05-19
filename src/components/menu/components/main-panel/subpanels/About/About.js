export default function About() {
    return (
        <div>
            Test page for HMV project <br />
            Jonathan Piland | 2021

            <br /><br />

            <h2>Some notes</h2>
            The quaternions are constrained to be unit quaternions. This is why you may notice other sliders moving when you adjust one value.

            <h3>Viewport controls</h3>
            The viewport uses Three.js OrbitControls, which means that 
            <ul>
                <li>left click and drag is rotate (single finger drag on mobile),</li>
                <li>right click and drag is move (double finger drag on mobile), and</li>
                <li>scrolling controls zoom (pinch in/out on mobile).</li>
            </ul>

        </div>
    );
}