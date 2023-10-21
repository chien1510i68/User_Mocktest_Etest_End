import React, { useEffect, useState } from "react";
import { getAllExam, getListExamBuServiceUser } from "../api/exam";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Image, notification } from "antd";
import ImageBanner from "../image/banner_vstep.png";
import Cookies from "js-cookie";

function MockTest() {
  const navigate = useNavigate();

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

  const handleSubmitExamByService = () => {
    const id = Cookies.get("id");
    getListExamBuServiceUser(42)
      .then((res) => {
        
        if (res.data.success === true) {
          // notification.success({ message: "Thành công " });
          navigate("/exam/all", { state: res.data.data.items });
        }
        // if(res)
        console.log(res.data.data.items);
      })
      .catch((err) => {
        console.log(err.response.data);
        if(err.response.data.success === false){
          notification.error({message : err.response.data.error.message});
        }
      });
  };
  const isUserId = Cookies.get("id") !== null ?true  : false;
  return (
    <div>
      {/* <h2>this is the text</h2> */}

      <div className="tablet:h-[50vh] mobile:py-5 bg-[#FFF4E5] grid tablet:grid-cols-2 mobile:grid-cols-1 gap-10 px-10 items-center ">
        <div className="col-span-1 text-left tablet:ml-[10%] mobile:ml-2">
          <h2 className="text-slate-950 font-semibold text-3xl ">
            {" "}
            Thi thử VSTEP Online Miễn Phí{" "} {isUserId}
          </h2>

          <p className="text-left my-5">
            EduStar cung cấp miễn phí phần mềm thi trên máy tính, mô phỏng phần
            mềm thi chính thức của Bộ, hỗ trợ thí sinh nắm vững các chức năng
            của phần mềm & ôn luyện các bộ đề thi bám sát định dạng, giúp thí
            sinh tự tin trước khi bước vào các kỳ thi chính thức.
          </p>

          <div className="flex justify-start">
            <Button
              className=" hover:bg-orange-200 hover:border-transparent hover:text-gray-200 "
              onClick={handleSubmitFreeExam}
            >
              Thi thử miễn phí{" "}
            </Button>
            <Button className="hover:bg-orange-200 hover:border-transparent hover:text-gray-200 mx-5">
              Xem lịch thi thử VSTEP
            </Button>

            { isUserId !== true&& (
              <Button
                className="hover:bg-orange-200 hover:border-transparent hover:text-gray-200 "
                onClick={handleSubmitExamByService}
              >
                Bài thi dành tiêng cho bạn{" "}
              </Button>
            )}
          </div>
        </div>
        <div className="col-span-1">
          <Image src={ImageBanner} />
        </div>
      </div>

      <div></div>
    </div>
  );
}

export default MockTest;
