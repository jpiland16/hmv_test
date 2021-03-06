import Sam20210521 from './Sam20210521/GeneratedData'
import Jonathan20210523 from './Jonathan20210523/OpportunityTest'
import Jonathan20210526 from './Jonathan20210526/RequestFile'
import Sam20210526 from './Sam20210526/GeneratedOrientation'
import Jonathan20210527 from './Jonathan20210527/RequestFile2'
import Sophie20210530 from './Sophie20210530/test1'
import Sam20210531 from './Sam20210531/OrientationStudy.js'
import Sophie20210603 from './Sophie20210603/test2.js'
import Sam20210605 from './Sam20210605/GyroIntegration.js'
import Sam20210611 from './Sam20210611/ServerSideProcessing.js'
import Jonathan20210608 from './Jonathan20210608/UseAccel'
import Sophie20210705 from './Sophie20210705/Sophie20210705.js'

import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'

import LabOpener from './LabOpener'

export default function Labs(props) {

    return (
        <div style={{display: props.display, marginTop: "12px"}}>

            <div>
                <Button style={{marginLeft: "6px", marginBottom: "12px"}}
                    color="secondary"
                    variant="contained"
                    onClick={() => props.visualizer.reset()}
                >
                    Reset model
                </Button>
            </div>

            <LabOpener title="Sam 5/21/2021" {...props}>
                <Sam20210521 {...props}/>
            </LabOpener>

            <LabOpener title="Jonathan 5/23/2021" {...props}>
                <Jonathan20210523 {...props}/>
            </LabOpener>
            <LabOpener title="Jonathan 5/26/2021" {...props}>
                <Jonathan20210526 {...props} />
            </LabOpener>
            <LabOpener title="sam 5/26/2021" {...props}>
                <Sam20210526 {...props}></Sam20210526>
            </LabOpener>
            <LabOpener title="Jonathan 5/27/2021" {...props}>
                <Jonathan20210527 {...props} />
            </LabOpener>
            <LabOpener title="Sophie 5/30/2021" {...props}>
                <Sophie20210530 {...props} />
                
            </LabOpener>
            <LabOpener title="Sam 5/31/2021: Using generated data" {...props}>
                <Sam20210531 {...props}/>
            </LabOpener>
            <LabOpener title="Sophie 6/3/2021" {...props}>
                <Sophie20210603 {...props}/>
            </LabOpener>
            <LabOpener title="Sam 6/05/2021: Gyro integration" {...props}>
                <Sam20210605 {...props}/>
            </LabOpener>
            <LabOpener title="Sam 6/11/2021: Server-side processing" {...props}>
                <Sam20210611 {...props}/>
            </LabOpener>
            <LabOpener title="Jonathan 6/8/2021: testing BT accelerometer data" {...props}>
                <Jonathan20210608 {...props} />
            </LabOpener>
            <LabOpener title="Sophie 7/5/2021: leg movement" {...props}>
                <Sophie20210705 {...props} />
            </LabOpener>
        </div>
    )
}