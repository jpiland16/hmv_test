import CardItem from './CardItem'
import './CardSet.css'

export default function CardSet(props) {
    return (
        <div className="cardSet" style={{
            display: props.cardsPos !== 'hidden' ? "block" : "none",
            position: "absolute",
            zIndex: "1",
            bottom: "48px",
            left: props.cardsPos === 'bottom' ?
                props.menuIsOpen && props.getWindowDimensions()[0] > 768 ? "40vw" : "0px"
                : "82vw",
            height: props.cardsPos === 'bottom' ? "20vh" : "calc(100% - 48px)",
            width: props.cardsPos === 'bottom' ?
                props.menuIsOpen && props.getWindowDimensions()[0] > 768 ? "60vw" : "100vw"
                : "18vw",
            overflowX: props.cardsPos === 'bottom' ? "scroll" : "hidden",
            overflowY: props.cardsPos === 'bottom' ? "hidden" : "scroll"
        }}>
            <div style={{
                width: props.cardsPos === 'bottom' ?
                    `${props.outputTypes.current.length * 18}vw` :
                    "20vw"
            }}>
                {props.outputTypes.current.map((value) => <CardItem options={value} floatLeft={props.cardsPos === 'bottom'}/>)}
            </div>
        </div>
    );
}