import { Typography } from '@material-ui/core'
import React from 'react'

export default function TestModel(props) {

    const [ quaternionValues, setQuaternionValues ] = React.useState({ })

    return (
        <div style={{width: "calc(100% - 30px)", marginTop: "12px", marginLeft: "6px", display: props.display}}>
            <Typography variant="h6">Global quaternions</Typography>
            <Typography variant="caption">View and modify the global quaternions here.</Typography>
            <br /><br />
            {(props.visualizer.showSliders = true) && props.visualizer.getSliders(quaternionValues, setQuaternionValues)}
        </div>
    );
}