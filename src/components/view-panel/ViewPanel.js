import FileViewer from "./visualizer_experimental/FileViewer"
import PlayBar from "./PlayBar"
import CardSet from "./cards/CardSet"
import TopActionBar from "./TopActionBar"
import Animator from "../Animator"

import './ViewPanel.css'


export default function ViewPanel(props){
return (
    <div className = 'ViewPanel' style={{backgroundColor: props.isOrange ? "orange" : "rebeccapurple"}}>
        <FileViewer targetFile={""} {...props}/>
            <PlayBar {...props} disabled={!props.fileStatus || props.fileStatus.status !== "Complete"} />
            <CardSet {...props} />
            <TopActionBar {...props} />
            <Animator {...props} />
    </div>
)
}