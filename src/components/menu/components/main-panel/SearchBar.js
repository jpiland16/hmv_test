import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import './main-panel.css';
import { IconButton } from '@material-ui/core';

export default function SearchBar(props) {
    return (
        <div className="searchBar">
            <Input className="searchBarInput" placeholder="Search files" onChange={(event) => {
                props.setSearchFileText(event.target.value);
                props.setSelected(0); // Switch to files tab
            }}/>
            <IconButton>
                <SearchIcon />
            </IconButton>
        </div>
    );
}
