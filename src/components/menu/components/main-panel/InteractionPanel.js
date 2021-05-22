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
            {
                [<ChooseFiles {...props}/>, <TestModel {...props} />, <MyAccount />, <Settings />, <Labs {...props}/>, <About />][props.selectedPanel]
            }
        </div>
    );
}