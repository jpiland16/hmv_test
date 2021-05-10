import './menu-components.css';
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import TuneIcon from '@material-ui/icons/Tune'
import InfoIcon from '@material-ui/icons/Info'
import Tooltip from '@material-ui/core/Tooltip'
import { Transition, CSSTransition } from 'react-transition-group'

export default function BottomActionBar(props) {
    return (
        <div className="bottomBar">
            <Tooltip title="About">
                <IconButton>
                    <InfoIcon />
                </IconButton>
            </Tooltip>
            <Button>
                <TuneIcon /> Test model
            </Button>
            <CSSTransition
                in={props.pinActive}
                timeout={300}
                classNames='pinIcon'
            >
                <Tooltip title={props.pinActive ? "Unpin menu" : "Pin menu"}>
                    <IconButton className="pinIcon" style={{
                        position: "absolute",
                        right: 0
                    }} onClick={props.onClick}>
                        { props.pinActive ?
                            <span className="material-icons">
                                push_pin
                            </span>
                        :
                            <span className="material-icons-outlined">
                                push_pin
                            </span>
                        }
                    </IconButton>
                </Tooltip>
            </CSSTransition>
        </div>
    );
}