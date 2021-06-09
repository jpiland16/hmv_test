import "./main-panel.css"
import ChooseFiles from "./subpanels/ChooseFiles/ChooseFiles"
import TestModel from "./subpanels/TestModel/TestModel"
import Settings from "./subpanels/Settings/Settings"
import MyAccount from "./subpanels/MyAccount/MyAccount"
import Labs from "./subpanels/Labs/Labs"
import About from "./subpanels/About/About"

export default function InteractionPanel(props) {
    return (
        <div className="interactionPanel" style={{ height: props.getWindowDimensions()[0] > 768 ? "calc(100% - 96px)" : "calc(100% - 48px)" }}>
                <ChooseFiles {...props} display={props.selectedPanel === 0 ? 'block' : 'none'}/>
                <TestModel   {...props} display={props.selectedPanel === 1 ? 'block' : 'none'}/>
                <MyAccount              display={props.selectedPanel === 2 ? 'block' : 'none'}/>
                <Settings    {...props} display={props.selectedPanel === 3 ? 'block' : 'none'}/>
                <Labs        {...props} display={props.selectedPanel === 4 ? 'block' : 'none'}/>
                <About       {...props} display={props.selectedPanel === 5 ? 'block' : 'none'}/>
        </div>
    );
}