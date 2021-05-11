import "./main-panel.css"
import ChooseFiles from "./subpanels/ChooseFiles/ChooseFiles"
import TestModel from "./subpanels/TestModel/TestModel"
import Settings from "./subpanels/Settings/Settings"
import MyAccount from "./subpanels/MyAccount/MyAccount"
import About from "./subpanels/About/About"

export default function InteractionPanel(props) {
    return (
        <div className="interactionPanel">
            {
                [<ChooseFiles {...props}/>, <TestModel />, <MyAccount />, <Settings />, <About />][props.selectedPanel]
            }
        </div>
    );
}