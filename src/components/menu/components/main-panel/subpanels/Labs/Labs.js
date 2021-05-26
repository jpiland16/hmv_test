import Sam20210521 from './Sam20210521/GeneratedData'
import Jonathan20210523 from './Jonathan20210523/OpportunityTest'
import LabOpener from './LabOpener'

export default function Labs(props) {

    return (
        <div style={{display: props.display}}>
            <LabOpener title="Sam 5/21/2021" {...props}>
                <Sam20210521 {...props}/>
            </LabOpener>
            <LabOpener title="Jonathan 5/23/2021" {...props}>
                <Jonathan20210523 {...props}/>
            </LabOpener>
        </div>
    )
}