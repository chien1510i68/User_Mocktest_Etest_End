import { ExceptionMap } from "antd/es/result/index.js";
import request from "./request.js";

export const getExamById = (id) => {
  return request.get(`/client/exam/${id}`);
};

export const getAllExam = () => {
  return request.get("client/exam/all");
};

export const getSectionByExamIdAndType = (data) => {
  return request.post("client/exam/detail", data);
};
export const createUserResponse = (data) => {
  return request.post("client/response/add", data);
};
export const detailExamResults = (id) => {
  return request.get(`client/results/${id}`);
};

export const getListUserResults = (data) => {
  return request.post("client/result/all" , data);
};

export const getListExamByServiceUser = (id) =>{
  return request.get(`client/mocktest/exam/examService/${id}`);
}
