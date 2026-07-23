import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Students from "../components/Students";
import AllStudents from "../components/AllStudents";
import MakeComplaints from "../components/MakeComplaints";
import Courses from "../components/Courses";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children:[
        {
            index:true,
            element:<Home/>,
        },
        {
            path:"login",
            element:<Login/>,
        },
        {
            path:"signup",
            element:<Signup/>,
        },
        {
            path:"dashboard",
            element:<PrivateRoute><Dashboard/></PrivateRoute>,
        },
        {
            path:"students",
            element:<PrivateRoute><Students/></PrivateRoute>,
        },
        {
            path:"all-students",
            element:<PrivateRoute><AllStudents/></PrivateRoute>,
        },
        {
            path:"complaints",
            element:<PrivateRoute><MakeComplaints/></PrivateRoute>,
        },
        {
            path:"courses",
            element:<PrivateRoute><Courses/></PrivateRoute>,
        }
    ] ,
  },
]);