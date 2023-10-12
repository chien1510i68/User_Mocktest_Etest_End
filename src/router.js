import { createBrowserRouter } from "react-router-dom";
import FormExam from './page/FormExam';
import MockTest from './page/MockTest';
import DetailExamresults from "./page/DetailExamresults";
import TableExamResults from "./page/TableExamResults";
import PageMocktest from "./page/PageMocktest";

export const router = createBrowserRouter([
  {
    path: "exam/:examId",
    element: <FormExam />,
  },
  {
    path: "/mocktest",
    element: <MockTest />,
  },
  {
    path : "/" ,
    element : <PageMocktest/>
  },
  {
    path : "/detail-results/:resultId" , 
    element : <DetailExamresults/>
  }
  ,
  {
    path : "/all" ,
    element : <TableExamResults/>
  }
 
]);
