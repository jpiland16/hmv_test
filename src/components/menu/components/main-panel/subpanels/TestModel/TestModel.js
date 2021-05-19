import QuaternionEditor from './QuaternionEditor'

export default function TestModel(props) {
    return (
        <div style={{width: "calc(100% - 24px)"}}>
            {
            
            props.modelLoaded && props.bones && props.sliderValues ?

            Object.keys(props.bones).map((boneId) => {
                    return <QuaternionEditor {...props} title={boneId} />
            }) 

            :

            "Model not yet loaded. Please wait..."
            
            }

        </div>
    );
}