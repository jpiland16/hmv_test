import './Menu.css'
import MenuButton from './MenuButton'
import MenuPanel from './MenuPanel'
import Slide from '@material-ui/core/Slide'
import Paper from '@material-ui/core/Paper'

export default function Menu(props) {
    return (
        <div>
            {/* <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={() => (props.isPinned || props.setIsOpen(false))}> */}
                <div>
                    <Slide direction="right" in={props.isOpen}>
                        <Paper className="myMenuPanel" square elevation={4}>
                            <MenuPanel visible={props.isOpen} pinActive={props.isPinned} onClick={() => props.setIsPinned(!props.isPinned)} 
                             {...props}/>
                        </Paper>
                    </Slide>
                    <MenuButton isCloseIcon={props.isOpen} onClick={() => (props.setIsOpen(!props.isOpen))}/>
                </div>
            {/* </ClickAwayListener> */}
        </div>
    );
}