import { createBrowserRouter } from "react-router-dom";
import FormExam from './page/FormExam';
import MockTest from './page/MockTest';
import DetailExamresults from "./page/DetailExamresults";
import TableExamResults from "./page/TableExamResults";

import PageShowListExam from "./page/PageShowListExam";
export const router = createBrowserRouter([
  {
    path: "exam/:examId",
    element: <FormExam />,
  },
  {
    path: "/",
    element: <MockTest />,
  },
  {
    path : "/detail-results/:resultId" , 
    element : <DetailExamresults/>
  }
  ,
  {
    path : "/all" ,
    element : <TableExamResults/>
  },
  {
    path : "/exam/all",
    element : <PageShowListExam/>
  }

 
]);
