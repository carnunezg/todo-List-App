import { BrowserRouter } from "react-router-dom";
import TodoList from "./components/TodoList.jsx";
function App() {

  // function eresPendejo() {
  //   var siONo = prompt("Eres Pendejo?");
  //   if (siONo === "si") {
  //     alert("MAC");
  //   } else {
  //     if (siONo === "no") {
  //       let otra = prompt("Tienes novia o familia?");
  //       if (otra === "si") {
  //         alert("Windows");
  //       } else {
  //         alert("Linux");
  //       }
  //     } 
  //   }
  // }
  // eresPendejo();
  return (
    <BrowserRouter>
      <TodoList />
    </BrowserRouter>
  );
}

export default App;
