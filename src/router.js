import { createBrowserRouter } from "react-router-dom";
import FormExam from "./page/FormExam";
import MockTest from "./page/MockTest";

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
]);
