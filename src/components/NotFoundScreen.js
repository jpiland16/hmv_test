import TitleBar from "./TitleBar"

export default function NotFound() {

  return (
    <div style={{overflowY: 'auto', height: '100vh', width: '100vw', backgroundColor: 'lightskyblue'}}>
      <TitleBar />
      <img src="/img/404.png" style={{display: "block", margin: 'auto', height: "60vh"}} />
      <div style={{textAlign: "center"}}>
        <i>Sorry, but we couldn't find</i> <a href={window.location.href}>{window.location.pathname}</a>
        <br />
        <b>Try going back to the <a href="javascript:history.back()">previous page</a> or returning to the <a href="/">homepage</a>.</b>
      </div>
    </div>
  );
}