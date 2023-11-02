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
  // Audio,
  message,
} from "antd";
import { handlePlayAudios } from "../component/handlePlayAudio";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  createUserResponse,
  getAllExam,
  getSectionByExamIdAndType,
} from "../api/exam";
import Cookies from "js-cookie";
import Countdown from "react-countdown";
import ReactAudioPlayer from "react-audio-player";
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
  const [idUser, setIdUser] = useState(null);
  const location = useLocation();
  const timeExam = location.state;
  const [listFileAudio, setListFileAudio] = useState([]);
  // const timeExam = 1;
  const initialTime = timeExam * 60;
  const previousTimeLeft = localStorage.getItem("timeLeft");
  const [timeLeft, setTimeLeft] = useState(
    previousTimeLeft ? parseInt(previousTimeLeft) : initialTime
  );

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
    },
  };
  const isEmail = localStorage.getItem("email") !== null ? true : false;
  const handleGetData = () => {
    getSectionByExamIdAndType({ id: examId, type: type }).then((res) => {
      // console.log(res.data.data.items);
      setData(res?.data?.data?.items);
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
  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
        localStorage.setItem("timeLeft", timeLeft - 1);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

  // Xóa trạng thái trong Local Storage sau khi sử dụng
  useEffect(() => {
    if (previousTimeLeft) {
      localStorage.removeItem("timeLeft");
    }
    const userId = Cookies.get("id");
    if (userId != null) {
      setIdUser(userId);
    } else {
      notification.error({ message: "Không có id user" });
    }
  }, []);

  const renderer = ({ hours, minutes, seconds }) => {
    return (
      <div>
        <h1 className="font-medium text-lg text-orange-500">
          Thời gian còn lại : {hours.toString().padStart(2, "0")}:
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </h1>
      </div>
    );
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
  const handleWritingSubmit = () => {
    if (checkSuccess(type)) {
      onConfirm(
        "userChoicesWriting",
        userChoices.writing,
        "writing",
        setIsDisableWriting
      );
    }
    handleAutosubmit();
  };

  const handleAutosubmit = () => {
    const isEmail = localStorage.getItem("email") !== null ? true : false;
    if (!isEmail) {
      setIsOpenModalEmail(true);
    }

    const listChoice = JSON.parse(
      localStorage.getItem("userChoicesListening")
    )?.concat(
      JSON.parse(localStorage.getItem("userChoicesReading")),
      JSON.parse(localStorage.getItem("userChoicesWriting"))
    );

    const email = JSON.parse(localStorage.getItem("email"));

    const data = {
      exam_id: examId,
      responseUsers: listChoice,
      email: email,
    };

    if (idUser !== null) {
      data.user_id = idUser;
    }
    createUserResponse(data)
      .then((res) => {
        console.log(res);
        if (res.data.success === true) {
          setIsModalOpen(true);
          // notification.success({ message: res.data.data.point });
          setIdResults(res.data.data.id);
          localStorage.removeItem("timeLeft");
        } else {
          console.log(res?.data?.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSubmitEmail = (values) => {
    console.log(values.user.email);
    if (!isEmail) {
      localStorage.setItem("email", JSON.stringify(values.user.email));
      console.log(values.user.email);
    }
    setIsOpenModalEmail(false);
    handleAutosubmit();
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

  const hadnleModalEmail = () => {
    if (isEmail) {
      handleWritingSubmit();
    } else {
      setIsOpenModalEmail(true);
    }
  };

  const handleSubmitFreeExam = () => {
    getAllExam()
      .then((res) => {
        console.log(res.data.body.data.items);
        if (res.data.body.success) {
          // setData();
          const data = res.data.body.data.items;
          notification.success({ message: "Thanh cong " });
          navigate("/exam/all", { state: data });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handlePlayAudios = (data) => {
    //  console.log(data);
    data?.map((item) => {
      if (item?.file?.startsWith("https")) {
        setListFileAudio((prevList) => [...prevList, item.file]);
        console.log(item.file);
      }
      item?.questions?.map((question) => {
        if (question?.description?.startsWith("https")) {
          setListFileAudio((prevList) => [...prevList, question?.description]);
          console.log(question?.description);
        }
      });
    });
  };
  const [duration, setDuration] = React.useState(0);
  const [isReady, setIsReady] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = useRef(null);
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  // return (
  //   <div className="max-w-[1400px] mx-auto">
  //     {/* <Button onClick={handleTest}>Click me </Button> */}
  //     <h2 className="text-center font-semibold text-2xl">
  //       Bài thi {data?.name} {idUser}
  //     </h2>

  //     <Button onClick={() => handlePlayAudios(data)}>Click me </Button>
  //     {data?.map((section, sectionIndex) => (
  //       <div className="flex my-2" key={sectionIndex}>
  //         <h2 className="mr-5 font-semibold">{section.title} : </h2>
  //         {section.questions?.map((question, questionIndex) => (
  //           <span
  //             key={question.id}
  //             className={`px-3 border border-slate-800 rounded-sm mr-1 ${
  //               isQuestionInType(question.id) ? "bg-amber-600" : ""
  //             }`}
  //           >
  //             {questionIndex + 1}
  //           </span>
  //         ))}
  //       </div>
  //     ))}
  //     {data?.map((section, index) => (
  //       <>
  //         {section?.description?.startsWith("https") ? (

  //           <>
  //           <audio
  //             id={section.id}
  //             autoPlay={true}
  //             controls
  //             className="my-5"

  //           >
  //             <source src={section.description} type="audio/mp3" />
  //           </audio>
  //           </>

  //         ) : (
  //           <h2 className="font-medium text-lg">
  //             Require : {section?.description}
  //           </h2>
  //         )}
  //         {section?.file?.startsWith("https") && (
  //           <audio
  //             id="audioElement"
  //             onPlay={() => handlePlayFile(section.file)}

  //             controls
  //             className="my-5"
  //           >
  //             <source src={section.file} type="audio/mp3" />
  //           </audio>
  //         )}
  //       </>
  //     ))}
  //   </div>
  // );
  return (
    <div>
      {data?.map((section, index) => (
        <div key={index}>
          {section?.file?.startsWith("https") && (
            // <audio  controls ref={audioRef}>
            //   <source src={section.file} type="audio/mp3" />
            // </audio>

            <audio
            controls
            muted
              ref={audioRef}
              preload="metadata"
              onDurationChange={(e) => setDuration(e.currentTarget.duration)}
              onCanPlay={(e) => {
                setIsReady(true);
              }}
              onPlaying={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={section.file} type="audio/mp3" />
            </audio>
          )}
        </div>
      ))}
    </div>
  );
}

export default FormExam;
