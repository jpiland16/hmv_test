import './Menu.css'
import MenuButton from './MenuButton'
import MenuPanel from './MenuPanel'
import Slide from '@material-ui/core/Slide'
import Paper from '@material-ui/core/Paper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { useState } from 'react'

export default function Menu(props) {
    const [isOpen, setIsOpen] = useState(false); // Menu is closed by default
    const [isPinned, setIsPinned] = useState(false); // Menu is unpinned by default
    return (
        <div>
            <ClickAwayListener onClickAway={() => (isPinned || setIsOpen(false))}>
                <div>
                    <Slide direction="right" in={isOpen}>
                        <Paper className="myMenuPanel" square elevation={4}>
                            <MenuPanel visible={isOpen} pinActive={isPinned} onClick={() => setIsPinned(!isPinned)} 
                            expandeditems={props.expandeditems} updateexpanded={props.updateexpanded }/>
                        </Paper>
                    </Slide>
                    <MenuButton isCloseIcon={isOpen} onClick={() => (setIsOpen(!isOpen))}/>
                </div>
            </ClickAwayListener>
        </div>
    );
}