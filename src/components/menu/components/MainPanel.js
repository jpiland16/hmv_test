import BottomActionBar from './main-panel/BottomActionBar';
import './menu-components.css';
import SearchBar from './main-panel/SearchBar';
import InteractionPanel from './main-panel/InteractionPanel';

export default function MainPanel(props) {
    return (
        <div className="mainPanel">
            <SearchBar />
            <InteractionPanel />
            <BottomActionBar {...props} />
        </div>
    );
}