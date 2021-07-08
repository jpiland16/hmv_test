import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default function TitleBar(props) {
return (<AppBar position="relative">
    <Toolbar>
        <img src="/hmv-outline-512.png" style={{ height: "40px", padding: "4px", marginRight: "6px", marginLeft: "-16px", cursor: "pointer"}} onClick={() => window.location.href = "/"}/>
        <Typography style={{cursor: "pointer"}} variant="h6" color="inherit" noWrap className={props.classes.title} onClick={() => window.location.href = "/"}>
        Human Activity Visualizer
        </Typography>
        <Button color="inherit" onClick={()=>window.location.href = "/getting-started"}>Getting Started</Button>
        <Button color="inherit" onClick={() => window.location.href = "/files/contact-form.html"}>Contact Us</Button>
    </Toolbar>
</AppBar>);
}