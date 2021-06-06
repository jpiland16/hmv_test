import CardItem from './CardItem'
import './CardSet.css'

export default function CardSet(props) {
    return props.data.current.length > 0 && props.cardsPos !== 'hidden' && (
        <div className="cardSet" style={{
            position: "absolute",
            zIndex: "1",
            bottom: "48px",
            left: props.cardsPos === 'bottom' ?
                props.menuIsOpen && props.getWindowDimensions()[0] > 768 ? "40vw" : "0px"
                : "72vw",
            height: props.cardsPos === 'bottom' ? "25vw" : "calc(100% - 48px)",
            width: props.cardsPos === 'bottom' ?
                props.menuIsOpen && props.getWindowDimensions()[0] > 768 ? "60vw" : "100vw"
                : "28vw",
            overflowX: props.cardsPos === 'bottom' ? "scroll" : "hidden",
            overflowY: props.cardsPos === 'bottom' ? "hidden" : "scroll"
        }}>
            <div style={{
                width: props.cardsPos === 'bottom' ?
                    `${props.outputTypes.current.length * 28}vw` :
                    "28vw"
            }}>
                {props.outputTypes.current.map((value, index) => <CardItem 
                    key={index} 
                    options={value} 
                    floatLeft={props.cardsPos === 'bottom'} 
                    data={props.data}
                    lineNumber={props.timeSliderValue}
                />)}
            </div>
        </div>
    );
}