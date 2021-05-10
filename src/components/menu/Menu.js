import './Menu.css'
import MenuButton from './MenuButton'
import MenuPanel from './MenuPanel'
import BottomActionBar from './components/BottomActionBar'
import Slide from '@material-ui/core/Slide'
import Paper from '@material-ui/core/Paper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { useState } from 'react'
import SearchBar from './components/SearchBar'

export default function Menu() {
    const [isOpen, setIsOpen] = useState(false); // Menu is closed by default
    const [isPinned, setIsPinned] = useState(false); // Menu is unpinned by default
    return (
        <div>
            <ClickAwayListener onClickAway={() => (isPinned || setIsOpen(false))}>
                <div>
                    <Slide direction="right" in={isOpen}>
                        <Paper className="myMenuPanel" square elevation={4}>
                            <SearchBar />
                            <MenuPanel visible={isOpen}/>
                            <BottomActionBar pinActive={isPinned} onClick={() => setIsPinned(!isPinned)}/>
                        </Paper>
                    </Slide>
                    <MenuButton isCloseIcon={isOpen} onClick={() => (setIsOpen(!isOpen))}/>
                </div>
            </ClickAwayListener>
        </div>
    );
}