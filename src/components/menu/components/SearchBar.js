import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import './menu-components.css';
import { IconButton } from '@material-ui/core';

export default function SearchBar() {
    return (
        <div className="searchBar">
            <Input className="searchBarInput" placeholder="Search files"/>
            <IconButton>
                <SearchIcon />
            </IconButton>
        </div>
    );
}
