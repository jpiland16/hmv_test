import Sam20210521 from './Sam20210521/GeneratedData'
import Jonathan20210523 from './Jonathan20210523/OpportunityTest'
import Jonathan20210526 from './Jonathan20210526/RequestFile'
import Jonathan20210527 from './Jonathan20210527/RequestFile2'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'

import LabOpener from './LabOpener'

export default function Labs(props) {

    return (
        <div style={{display: props.display, marginTop: "12px"}}>

            <Tooltip title={props.playTimerId.current !== 0 ? "Cannot reset model while viewing pre-recorded data. Pause playback first, then try again." : ""} >
                <div>
                    <Button style={{marginLeft: "6px", marginBottom: "12px"}}
                        color="secondary"
                        variant="contained"
                        disabled={props.playTimerId.current !== 0}
                        onClick={() => props.resetModel()}
                    >
                        Reset model
                    </Button>
                </div>
            </Tooltip>

            <LabOpener title="Sam 5/21/2021" {...props}>
                <Sam20210521 {...props}/>
            </LabOpener>

            <LabOpener title="Jonathan 5/23/2021" {...props}>
                <Jonathan20210523 {...props}/>
            </LabOpener>

            <LabOpener title="Jonathan 5/26/2021" {...props}>
                <Jonathan20210526 {...props} />
            </LabOpener>

            <LabOpener title="Jonathan 5/27/2021" {...props}>
                <Jonathan20210527 {...props} />
            </LabOpener>
            
        </div>
    )
}