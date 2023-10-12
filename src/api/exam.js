import request  from "./request.js";

export const getExamById = (id) => {
  return request.get(`/mocktest/exam/${id}`);
};

export const getAllExam = () =>{
   return request.get("mocktest/exam/");
}

export const getSectionByExamIdAndType = (id , type) =>{
    return request.get(`mocktest/exam/${id}/${type}`);
}
export const createUserResponse  = (data) =>{
    return request.post("mocktest/userresponse/add" , data );
}
export const detailExamResults = (id) =>{
  return request.get(`mocktest/results/${id}`)
}

export const getListUserResults  = (id) =>{
  return request.get(`mocktest/results/user/${id}`)
}