import './Menu.css'
import MenuButton from './MenuButton'
import MenuPanel from './MenuPanel'
import Slide from '@material-ui/core/Slide'
import Paper from '@material-ui/core/Paper'

export default function Menu(props) {
    return (
        <div>
            {/* <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={() => (props.menuIsPinned || props.setIsOpen(false))}> */}
                <div>
                    <Slide direction="right" in={props.menuIsOpen}>
                        <Paper className="myMenuPanel" square elevation={4}>
                            <MenuPanel visible={props.menuIsOpen} pinActive={props.menuIsPinned} onClick={() => props.setMenuIsPinned(!props.menuIsPinned)} 
                             {...props} dev={props.dev}/>
                        </Paper>
                    </Slide>
                    <MenuButton disabled={!props.modelLoaded} isCloseIcon={props.menuIsOpen} onClick={() => (props.setMenuIsOpen(!props.menuIsOpen))}/>
                </div>
            {/* </ClickAwayListener> */}
        </div>
    );
}