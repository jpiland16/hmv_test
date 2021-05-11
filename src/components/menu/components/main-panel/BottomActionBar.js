import './main-panel.css';
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import TuneIcon from '@material-ui/icons/Tune'
import Tooltip from '@material-ui/core/Tooltip'
import { Transition } from 'react-transition-group'

const duration = 100;

const defaultStyle = {
  transition: `transform ${duration}ms ease-in-out`,
  transform: 'rotate(90deg)',
}

const transitionStyles = {
  entering: { transform: 'rotate(0deg)' },
  entered:  { transform: 'rotate(0deg)' },
  exiting:  { transform: 'rotate(90deg)' },
  exited:  { transform: 'rotate(90deg)' },
};

const SpinPin = (props) => (
    <Transition in={props.in} timeout={duration}>
      {state => (
        <div style={{
          ...defaultStyle,
          ...transitionStyles[state]
        }} className="pinIconDiv">
          <Tooltip title={props.in ? "Unpin menu" : "Pin menu"}>
                <IconButton className="pinIcon" style={{
                    position: "absolute",
                    right: 0
                }} onClick={props.onClick}>
                    { props.in ?
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
        </div>
      )}
    </Transition>
  );

export default function BottomActionBar(props) {
    return (
        <div className="bottomBar">
            {  
                props.getWindowDimensions()[0] >= 768 && <SpinPin in={props.pinActive} onClick={props.onClick}/> 
            }
        </div>
    );
}