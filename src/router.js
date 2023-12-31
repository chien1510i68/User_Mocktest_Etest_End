import { createBrowserRouter } from "react-router-dom";
import FormExam from "./page/FormExam";
import MockTest from "./page/MockTest";
import MockTest from "./page/Toeic";
import MockTest from "./page/Vstep";
import MockTest from "./page/BeforeExam";

import PageShowListExam from "./page/PageShowListExam";
import Test from "./page/Test";
export const router = createBrowserRouter([
  {
    path: "exam/:examId",
    element: <FormExam />,
  },
  
  {
    path: "/test/:examId",
    element: <Test />,
  },
  {
    path: "/",
    element: <MockTest />,
  },
 
  {
    path: "/exam/all",
    element: <PageShowListExam />,
  },
 
  {
    path: "/vstep",
    element: <Vstep />,
  },
  
  {
    path: "/toeic",
    element: <Toeic />,
  },
 
  {
    path: "/beforeExam",
    element: <BeforeExam />,
  },
]);
