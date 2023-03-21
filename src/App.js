import "./appInit";
import "./App.css";

import Background from "./components/background";
import Router from "./components/routeDecider";
import Popup from "./components/popup";

function App() {
  return (
    <>
      <Background />
      <Router />
      <Popup />
    </>
  );
}

export default App;
