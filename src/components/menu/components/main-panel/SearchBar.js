import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear'
import './main-panel.css';
import { IconButton } from '@material-ui/core';

export default function SearchBar(props) {
    return (
        <div className="searchBar">
            <Input className="searchBarInput" placeholder="Search files" value={props.searchFileText} onChange={(event) => {
                props.setSearchFileText(event.target.value);
                props.setSelected(0); // Switch to files tab
            }}/>
            <IconButton disabled={props.searchFileText === ''} onClick={() => props.setSearchFileText('')}>
                { props.searchFileText === '' ? <SearchIcon /> : <ClearIcon /> }
            </IconButton>
        </div>
    );
}
