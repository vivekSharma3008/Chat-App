import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={Homepage}  />
      <Route path="/chats" component={Chatpage} />
    </div>
  );
}

export default App