import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Collapse from '@material-ui/core/Collapse';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button'
import SyncIcon from '@material-ui/icons/Sync'
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import './ChooseFiles.css'
import { Typography } from '@material-ui/core';

const data = {
    id: '/',
    name: 'files',
    children: [],
};


async function doXHR(method, url) {
    return new Promise(function(myResolve, myReject) {
        let x = new XMLHttpRequest();
        x.open(method, url);
        x.onload = () => {
            myResolve(x);
        }
        x.onerror = () => { myReject(x); }
        x.send()
    });
}

async function getFileList() {
    data.children = [{name: "placeholder", id: "placeholder"}];
    doXHR("GET", "/api/get-file-list").then(
        (xhrr) => {
            try {
                data.children = JSON.parse(xhrr.responseText);
            } catch (e) {
                console.warn("Error in processing files...");
                console.error(e);
                data.children = [{
                    id: 'root2',
                    name: 'We apologize, but the files could not be loaded due to a JSON error. So, we capitalized upon this to create a very longer folder name for testing.',
                    children: [{
                      id: 'test1',
                      name: 'test1',
                      children: [{
                        id: 'test2',
                        name: 'test2'
                      }]
                    }],
                }]
            }
        },
        (errXhrr) => {
            console.error("XHR Error");
            console.log(errXhrr.status);
            console.log(errXhrr.statusText);
            console.log(errXhrr.responseText);
        }
    )
}

function MinusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}

function PlusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
}

function CloseSquare(props) {
    return (
        <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M 22.047 22.074 v 0 v 0 v -20.147 v 0 h -20.12 v 0 v 20.147 v 0 h 20.12 z M 22.047 24 h -20.12 q -0.803 0 -1.365 -0.562 t -0.562 -1.365 v -20.147 q 0 -0.776 0.562 -1.351 t 1.365 -0.575 h 20.147 q 0.776 0 1.351 0.575 t 0.575 1.351 v 20.147 q 0 0.803 -0.575 1.365 t -1.378 0.562 v 0 z M 17.873 11.023 h -11.826 q -0.375 0 -0.669 0.281 t -0.294 0.682 v 0.014 q 0 0.401 0.294 0.682 t 0.669 0.281 h 11.826 q 0.375 0 0.669 -0.281 t 0.294 -0.682 v 0 q 0 -0.401 -0.294 -0.682 t -0.669 -0.281 z M 17.873 16.023 h -11.826 q -0.375 0 -0.669 0.281 t -0.294 0.682 v 0.014 q 0 0.401 0.294 0.682 t 0.669 0.281 h 11.826 q 0.375 0 0.669 -0.281 t 0.294 -0.682 v 0 q 0 -0.401 -0.294 -0.682 t -0.669 -0.281 z M 17.873 5.873 h -11.826 q -0.375 0 -0.669 0.281 t -0.294 0.682 v 0.014 q 0 0.401 0.294 0.682 t 0.669 0.281 h 11.826 q 0.375 0 0.669 -0.281 t 0.294 -0.682 v 0 q 0 -0.401 -0.294 -0.682 t -0.669 -0.281 z" />
        </SvgIcon>
    );
}

function TransitionComponent(props) {
    const style = useSpring({
        from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
        to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
    });

    return (
        <animated.div style={style}>
            <Collapse {...props} />
        </animated.div>
    );
}

TransitionComponent.propTypes = {
    /**
     * Show the component; triggers the enter or exit states
     */
    in: PropTypes.bool,
};

const StyledTreeItem = withStyles((theme) => ({
    iconContainer: {
        '& .close': {
          opacity: 0.4,
        },
    },
    group: {
        marginLeft: 7,
        paddingLeft: 18,
        borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
}))((props) => <TreeItem {...props} TransitionComponent={TransitionComponent} />);

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

export default function CustomizedTreeView(props) {
    data.children.length === 0 && getFileList();
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null); // For download menu
    const [filePath, setFilePath] = React.useState(""); // For download menu
    const [selectedIsFolder, setSelectedIsFolder] = React.useState(false); // For download menu

    const handleContextMenu = (event, path, isFolder) => {
            setSelectedIsFolder(isFolder);
            event.preventDefault();
            event.stopPropagation();
            setFilePath(path);
            setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
            setAnchorEl(null);
    };

    const handleDownload = () => {
            (window.open(`/files${filePath}`))
            handleClose();
    }

    const getAllIds = function(root) {
        if (!root.children || root.children.length === 0) return [];
        let fileIdList = [ root.id ];
        for (let i = 0; i < root.children.length; i++) {
            fileIdList = fileIdList.concat(getAllIds(root.children[i]));
        }
        console.log(fileIdList);
        return fileIdList;
    }

    const renderTree = function (nodes) {
        const isFolder = !(!nodes.children || nodes.children.length === 0);
        const thisNode = <StyledTreeItem 
                key={nodes.id} 
                nodeId={nodes.id} 
                label={nodes.name} 
                onContextMenu={ (event) => handleContextMenu(event, nodes.id, isFolder) } 
                onClick={ (event) => { 
                        props.setSelectedFile(nodes.id) 
                } }
                style={{
                        whiteSpace: "nowrap",
                        opacity: nodes.name.substr(-4) === ".dat" || isFolder ? 1 : 0.5,
                        WebkitTouchCallout: "none",
                        WebkitUserSelect: "none",
                        MozUserSelect: "none",
                        msUserSelect: "none",
                        userSelect: "none",
                        color: props.searchFileText !== "" && nodes.name.toLowerCase().indexOf(props.searchFileText.toLowerCase()) >= 0 ? "blue" : "black" 
                    }}
                >
                {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
            </StyledTreeItem>
    return (props.searchFileText === "" || 
    nodes.name.toLowerCase().indexOf(props.searchFileText.toLowerCase()) >= 0 || isFolder) && thisNode;
  };

  return (
    <div>
        <Typography variant="caption" style={{ 
            opacity: 0.7, 
            display: "block", 
            lineHeight: "1.1em", 
            minHeight: "24px",
            marginTop: "12px", 
            marginBottom: "12px" 
            }}><i>Right click a file to download it, or 
                  right click a folder to open in a new window. 
                  (mobile: long-press)
                </i>
            </Typography>
            <Button size="small" style={{marginLeft: "0px", opacity: 0.74, marginBottom: "6px", marginTop: "0px"}} onClick={() => window.location.href="/api/scan-all-files"}>
                <SyncIcon style={{marginRight: "6px", fontSize:"small"}}/> Refresh file list
            </Button>
        <TreeView
            className={classes.root}
            expanded={props.searchFileText === "" ? props.expandedItems : getAllIds(data)}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}
            onNodeToggle={(event, nodeIds) => props.setExpandedItems(nodeIds)}
        >
            {renderTree(data)}
        </TreeView>
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <MenuItem onClick={handleDownload}>{ selectedIsFolder ? "Open folder" : "Download file" }</MenuItem>
        </Menu>
    </div>
  );
}