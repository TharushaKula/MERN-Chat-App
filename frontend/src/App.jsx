import { useState } from "react";
import "./App.css";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
     <div className="p-4 h-screen flex items-center justify-center">
      <SignUp></SignUp>

     </div>
    </>
  );
}

export default App;
