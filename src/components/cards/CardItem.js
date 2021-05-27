import './CardItem.css'

export default function CardItem(props) {
    return (
      <div className="cardItem" style={{ float: props.floatLeft ? "left" : "none"}}>
          Hello world
      </div>  
    );
}