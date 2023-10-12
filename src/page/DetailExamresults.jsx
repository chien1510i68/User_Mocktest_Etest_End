


import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { detailExamResults } from "../api/exam";
import { Button } from "antd";

function DetailExamresults() {
  const { resultId } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    detailExamResults(resultId)
      .then((res) => {
        console.log(res.data.body);
        setData(res.data.body);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const isAnswerCorrect = (question) => {
    return question.choiceUser?.every((choice) => question.choiceCorrect?.includes(choice));
  };

  return (
    <div className="w-[1400px] mx-auto">
      <h2 className="text-3xl font-medium text-center my-5">Kết quả bài thi  {resultId}</h2>


    <Button className="font-medium mr-10" onClick={() => navigate('/')}> Quay lại tiếp tục thi</Button>
    <Button className="font-medium " onClick={() => navigate('/all')}> Xem thêm các kết quả bài thi khác </Button>

      <div className="text-center">

        <p>Nhận xét bài thi : {data?.data?.comment}</p>
        <p>Điểm số đạt được : {data?.data?.point}</p>
      </div>
      {data &&
        data?.data?.detailResults?.map((item) => {
          const correct = isAnswerCorrect(item);
          return (
            <div key={item.question.id} className="my-4">
              <h2 className={`font-medium text-base`}>
               Câu hỏi : {item.question.content}
              </h2>
              <div className="grid grid-cols-2">
                {item.question.listAnswer?.map((answer) => {
                  const userAnswerIsCorrect = item.choiceUser?.includes(answer.answerKey) && item.choiceCorrect?.includes(answer.answerKey);
                  return (
                    <p
                      key={answer.id}
                      className={`col-span-1 ${userAnswerIsCorrect ? 'text-green-500' : (item.choiceUser?.includes(answer.answerKey) ? 'text-red-500' : '')}`}
                    >
                      {answer.answer}
                    </p>
                  );
                })}
              </div>
              {(!correct && item.choiceUser?.length > 0) && (
                <div>
                  <p className="font-medium text-blue-600">Câu trả lời đúng:</p>
                  {item?.question?.listAnswer
                    ?.filter((answer) => item.choiceCorrect?.includes(answer.answerKey))
                    ?.map((correctAnswer) => (
                      <p key={correctAnswer.id} className="font-medium text-blue-600">{correctAnswer.answer}</p>
                    ))}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default DetailExamresults;
