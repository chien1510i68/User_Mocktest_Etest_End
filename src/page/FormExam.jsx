import { CheckCircleFilled } from "@ant-design/icons";

import {
  BackTop,
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Popconfirm,
  Radio,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createUserResponse, getSectionByExamIdAndType } from "../api/exam";

function FormExam(props) {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenModalEmail, setIsOpenModalEmail] = useState(false);
  const { examId } = useParams();
  const [type, setType] = useState("listening");
  const [isDisableListening, setIsDisableListening] = useState(false);
  const [isDisableReading, setIsDisableReading] = useState(false);
  const [isDisableWriting, setIsDisableWriting] = useState(false);
  const [listQuestion, setListQuestion] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [idResults, setIdResults] = useState(null);

  const [userChoices, setUserChoices] = useState({
    listening: [],
    reading: [],
    writing: [],
  });

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    }
  };

  const handleGetData = () => {
    getSectionByExamIdAndType({ id: examId, type: type }).then((res) => {
      console.log(res.data.data.items);
      setData(res.data.data.items);
    });
  };

  useEffect(() => {
    handleGetData();
  }, [type]);

  const onConfirm = (key, value, type, typeDisable) => {
    localStorage.setItem(key, JSON.stringify(value));
    setType(type);
    typeDisable(true);
  };
  const handleListeningSubmit = () => {
    if (checkSuccess(type)) {
      onConfirm(
        "userChoicesListening",
        userChoices.listening,
        "reading",
        setIsDisableListening
      );
    } else {
      notification.error({
        message:
          "Bạn cần hoàn thành tất cả các câu trả lời trước khi chuyển sang phần thi mới",
      });
    }
  };

  const handleReadingSubmit = () => {
    if (checkSuccess(type)) {
      onConfirm(
        "userChoicesReading",
        userChoices.reading,
        "writing",
        setIsDisableReading
      );
    } else {
      notification.error({
        message:
          "Bạn cần hoàn thành tất cả các câu trả lời trước khi chuyển sang phần thi mới",
      });
    }
  };
  const handleWritingSubmit = (values) => {
    if (checkSuccess(type)) {
      onConfirm(
        "userChoicesWriting",
        userChoices.writing,
        "writing",
        setIsDisableWriting
      );
    }

    const listChoice = JSON.parse(
      localStorage.getItem("userChoicesListening")
    ).concat(
      JSON.parse(localStorage.getItem("userChoicesReading")),
      JSON.parse(localStorage.getItem("userChoicesWriting"))
    );
    const email = JSON.parse(localStorage.getItem("email"));

    createUserResponse({
      exam_id: examId,
      user_id: 19,
      responseUsers: listChoice,
      email : email 
    })
      .then((res) => {
        console.log(res);
        if (res.data.success === true) {
          setIsModalOpen(true);
          // notification.success({ message: res.data.data.point });
          setIdResults(res.data.data.id);
          // navigate()
        }
      })
      .catch((err) => {
        console.log(err);
      });
    if (!isEmail) {
      localStorage.setItem("email", JSON.stringify(values.user.email));
      console.log(values.user.email);
    }
    setIsOpenModalEmail(false);
  };

  const checkSuccess = (type) => {
    const questionIds = userChoices[type].map((choice) => choice.questionId);

    const section = data.find((item) => item.type === type);

    if (section && section.questions) {
      const listQuestion = section.questions.map((item) => item.id);
      return listQuestion.every((item) => questionIds.includes(item));
    } else {
      return false;
    }
  };

  const handleOptionChange = (questionId, answerKey, text) => {
    const newUserChoices = { ...userChoices };
    newUserChoices[type] = [
      ...newUserChoices[type].filter(
        (choice) => choice.questionId !== questionId
      ),
      { questionId, answerKey: [answerKey], value: text }, // Lưu answerKey trong một mảng
    ];
    setUserChoices(newUserChoices);
  };

  const handleOptionChangeMultiChoice = (questionId, checkedValues, text) => {
    const newUserChoices = { ...userChoices };
    newUserChoices[type] = [
      ...newUserChoices[type].filter(
        (choice) => choice.questionId !== questionId
      ),
      { questionId, answerKey: checkedValues, value: null },
    ];
    setUserChoices(newUserChoices);
  };

  const handleQuestionEssay = (questionId, value) => {
    console.log(questionId, value);
    setFormData({ ...formData, [questionId]: value });
    const newUserChoices = { ...userChoices };
    newUserChoices[type] = [
      ...newUserChoices[type].filter(
        (choice) => choice.questionId !== questionId
      ),
      { questionId, answerKey: null, value: value },
    ];
    setUserChoices(newUserChoices);
    console.log(userChoices[type]);
  };

  const isQuestionInType = (questionId) => {
    return userChoices[type].some((choice) => choice.questionId === questionId);
  };
  const handleCheckWriting = () => {
    if (type === "listening") {
      setType("reading");
      setIsDisableListening(true);
    }
  };

  const isEmail = localStorage.getItem("email") !== null ? true : false;
  const hadnleModalEmail = () => {
    if (isEmail) {
      handleWritingSubmit();
    } else {
      setIsOpenModalEmail(true);
    }
  };
  return (
    <div className="max-w-[1400px] mx-auto">
      {/* <Button onClick={handleTest}>Click me </Button> */}
      <h2 className="text-center font-semibold text-2xl">
        Bài thi {data?.name}
      </h2>

      <div className="flex justify-end">
        <Popconfirm
          placement="bottom"
          text={"Bạn có muốn chuyển sang phần thi mới"}
          description={`Khi chuyển sang phần thi mới câu trả lời sẽ được lưu lại và không thể quay lại phần thi ${type}`}
          onConfirm={handleListeningSubmit}
          okText="Yes"
          cancelText="No"
        >
          <Button
            className={`hover:bg-teal-500 font-semibold bg-white ${
              isDisableListening ? "bg-teal-500" : ""
            }`}
            // onClick={}
            disabled={isDisableListening}
          >
            Listening
          </Button>
        </Popconfirm>
        <Popconfirm
          placement="bottom"
          text={"Bạn có muốn chuyển sang phần thi mới"}
          description={`Khi chuyển sang phần thi mới câu trả lời sẽ được lưu lại và không thể quay lại phần thi ${type}`}
          onConfirm={handleListeningSubmit}
          okText="Yes"
          cancelText="No"
        >
          <Button
            className="hover:bg-teal-500 font-semibold mx-5"
            // onClick={handleListeningSubmit}
            disabled={isDisableReading}
          >
            Reading
          </Button>
        </Popconfirm>
        <Popconfirm
          placement="bottom"
          text={"Bạn có muốn chuyển sang phần thi mới"}
          description={`Khi chuyển sang phần thi mới câu trả lời sẽ được lưu lại và không thể quay lại phần thi ${type}`}
          onConfirm={handleReadingSubmit}
          okText="Yes"
          cancelText="No"
        >
          <Button
            className="hover:bg-teal-500 font-semibold mr-3"
            // onClick={handleReadingSubmit}
            onClick={handleCheckWriting}
            disabled={isDisableWriting}
          >
            Writing
          </Button>
        </Popconfirm>

        <Button
          className="hover:bg-teal-500 font-semibold "
          // onClick={handleWritingSubmit}

          onClick={hadnleModalEmail}
          htmlType="submit"
        >
          Nộp bài
        </Button>
      </div>
      <h2 className="font-semibold text-2xl text-orange-700 my-10 uppercase">
        Phần thi {type}
      </h2>

      {data?.map((section, sectionIndex) => (
        <div className="flex my-2" key={sectionIndex}>
          <h2 className="mr-5 font-semibold">{section.title} : </h2>
          {section.questions?.map((question, questionIndex) => (
            <span
              key={question.id}
              className={`px-3 border border-slate-800 rounded-sm mr-1 ${
                isQuestionInType(question.id) ? "bg-amber-600" : ""
              }`}
            >
              {questionIndex + 1}
            </span>
          ))}
        </div>
      ))}
      {data?.map((section, index) => (
        <>
          <h2 className="mx-10 my-7 font-medium">{section.description}</h2>
          <Form layout="vertical" key={index}>
            {section?.questions.map((question, questionIndex) => (
              <>
                <h2 className="font-medium text-base">
                  Câu hỏi số {questionIndex + 1} : {question.content}
                </h2>
                {question.questionType === "Single_answer" && (
                  <Form.Item className="mx-10" key={question.id}>
                    <Radio.Group
                      className="grid phone:grid-cols-1 tablet:grid-cols-2 laptop:gap-x-40"
                      onChange={(e) =>
                        handleOptionChange(question.id, e.target.value, null)
                      }
                      value={
                        userChoices[type].find(
                          (choice) => choice.questionId === question.id
                        )?.answerKey[0]
                      }
                    >
                      {question?.listAnswer.map((item) => (
                        <Radio
                          key={item.answerKey}
                          className="col-span-1 my-2"
                          value={item.answerKey}
                        >
                          {item.answer}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                )}
                {question.questionType === "Multi_answer" && (
                  <Form.Item className="mx-10" key={question.id}>
                    <Checkbox.Group
                      onChange={(checkedValues) => {
                        handleOptionChangeMultiChoice(
                          question.id,
                          checkedValues,
                          null
                        );
                      }}
                    >
                      {question?.listAnswer.map((item) => (
                        <Checkbox
                          className="col-span-1 my-2"
                          value={item.answerKey}
                        >
                          {item.answer}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>
                )}
                {question.questionType === "Essay_answers" && (
                  <Form.Item
                    name={question.id}
                    // getValueProps={(e) => {console.log(e.target.value);}}
                    label="Plase input your answer "
                    rules={[
                      {
                        required: true,
                        message: "Please input  your answer",
                      },
                    ]}
                  >
                    <Input.TextArea
                      showCount
                      maxLength={200}
                      rows={5}
                      onChange={(e) =>
                        handleQuestionEssay(question.id, e.target.value)
                      }
                    />
                  </Form.Item>
                )}
              </>
            ))}
          </Form>
        </>
      ))}
      <BackTop />
      <h2 className="text-center my-20 text-2xl font-medium">
        ---------- Kết thúc phần thi {type} ----------
      </h2>

      <Modal open={isModalOpen} footer={null}>
        <div className="text-center">
          <h2 className="text-center text-red-800 font-medium text-xl">
            Chúc mừng bạn đã hoàn thành xong bài thi{" "}
          </h2>
          {/* <p> */}
          <CheckCircleFilled className="text-7xl text-green-500 block" />

          {/* </p> */}
          <p className="my-5">
            Hãy ôn tập nhiều hơn để đạt kết quả tốt hơn trong lần thi tiếp theo
          </p>
          <div className=" flex items-center justify-end ">
            <Button
              onClick={() => {
                navigate(`/detail-results/${idResults}`);
              }}
            >
              {" "}
              Xem kết quả{" "}
            </Button>
            <Button className="ml-5">Tiếp tục thi</Button>
          </div>
        </div>
      </Modal>

      {!isEmail && (
        <Modal
          open={isOpenModalEmail}
          footer={null}
          validateMessages={validateMessages}
        >
          <h2 className="text-orange-500 font-medium text-center text-xl my-5">
            Nhập vào thông tin email của bạn{" "}
          </h2>
          <Form
            name="nest-messages"
            onFinish={handleWritingSubmit}
            style={{
              maxWidth: 600,
            }}
            validateMessages={validateMessages}
          >
            <Form.Item
              name={["user", "email"]}
              label="Email"
              rules={[
                {
                  type: "email",
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button
                className="bg-orange-500 ml-auto block hover:opacity-80"
                htmlType="submit"
              >
                Nộp bài
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}

export default FormExam;
