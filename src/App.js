import React from "react";
import {   
  Routes,
  Route, 
  useNavigate,
  useLocation,
} from "react-router-dom";
import { history } from "./_helpers";
import Nav from "./_components/Nav/Nav";
import PrivateRoute from "./_components/PrivateRoutes/PrivateRoutes";
import Home from "./_components/Home/Home";
import List from "./_components/Users/List";
import AddEdit from "./_components/Users/AddEdit";
import Login from "./_components/Login/Login";
import Alert from "./_components/Alert/Alert"
function App() {
  history.navigate = useNavigate();
  history.location = useLocation();

  return (
    <div className="app-container bg-light">
      <Nav />
      <Alert/>
      <div className="container pt-4 pb-4">
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />  
          <Route path="/users">
            <Route index element={<List />} />  
            <Route path={"add"} element={<AddEdit />} />
            <Route path={":id"} element={<AddEdit />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
