import './menu-components.css';
import IconButton from '@material-ui/core/IconButton'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import SettingsIcon from '@material-ui/icons/Settings'
import FolderIcon from '@material-ui/icons/Folder'
import InfoIcon from '@material-ui/icons/Info'
import Tooltip from '@material-ui/core/Tooltip'
import Zoom from '@material-ui/core/Zoom'
import FileCopyIcon from '@material-ui/icons/FileCopy';
import TuneIcon from '@material-ui/icons/Tune';


// const incrementalDelay = 50;

// const sidebarActions =
//     [
//         {
//             icon: <FileCopyIcon />,
//             clickAction: () => {},
//             tooltip: "Choose files"
//         },
//         {
//             icon: <FolderIcon />,
//             clickAction: () => () => { window.location.href = "/files"},
//             tooltip: "View data folder"
//         },
//         {
//             icon: <TuneIcon />,
//             clickAction: () => {},
//             tooltip: "Test model"
//         },
//         {
//             icon: <AccountCircleIcon />,
//             clickAction: () => {},
//             tooltip: "My account"
//         },
//         {
//             icon: <SettingsIcon />,
//             clickAction: () => {},
//             tooltip: "Settings"
//         },
//         {
//             icon: <InfoIcon />,
//             clickAction: () => {},
//             tooltip: "About"
//         }
//     ]

// function renderIcon(i, props) {
//     let action = sidebarActions[i];
//     return (
//         <Tooltip title={action.tooltip} placement="right">
//             <IconButton onClick={action.clickAction} style={
//                 i == 0 ? { marginTop: "48px" } : {}
//                     //i == (sidebarActions.length - 1) ? { position: "absolute", bottom: "0px" } : {}
//             }>
//                 {action.icon}
//             </IconButton>
//         </Tooltip>)
// }

export default function SideActionBar(props) {
    return (
        <div className="sidebar"> 
        
{/* //             <Zoom in={props.visible} style={{ transitionDelay: props.visible ? `500ms` : '0ms' }}>
//                 <div>
//                 {
                
                [0, 1, 2, 3, 4, 5].map ( (n) => {
                    return renderIcon(n, props)
                })
            
                }
</div>
            </Zoom> */}
            
            <Zoom in={props.visible} style={{ transitionDelay: props.visible ? '50ms' : '0ms' }}>
                <Tooltip title="Choose files" placement="right">
                    <IconButton style={{
                        marginTop: "48px"
                    }}>
                        <FileCopyIcon />
                    </IconButton>
                </Tooltip>
            </Zoom>
            <Zoom in={props.visible} style={{ transitionDelay: props.visible ? '100ms' : '0ms' }}>
                <Tooltip title="Open data folder" placement="right">
                    <IconButton onClick={() => { window.location.href = "/files"}}>
                        <FolderIcon />
                    </IconButton>
                </Tooltip>
            </Zoom>
            <Zoom in={props.visible} style={{ transitionDelay: props.visible ? '150ms' : '0ms' }}>
                <Tooltip title="Test model" placement="right">
                    <IconButton>
                        <TuneIcon />
                    </IconButton>
                </Tooltip>
            </Zoom>
            <Zoom in={props.visible} style={{ transitionDelay: props.visible ? '200ms' : '0ms' }}>
                <Tooltip title="My account" placement="right">
                    <IconButton>
                        <AccountCircleIcon />
                    </IconButton>
                </Tooltip>
            </Zoom>
            <Zoom in={props.visible} style={{ transitionDelay: props.visible ? '250ms' : '0ms' }}>
                <Tooltip title="Settings" placement="right">
                    <IconButton>
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
            </Zoom>
            <div className="infoIcon">
                <Tooltip title="About" placement="right">
                    <IconButton>
                        <InfoIcon />
                    </IconButton>
                </Tooltip>
            </div> 
        </div>
    );
}