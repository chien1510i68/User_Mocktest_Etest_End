import { useState } from "react";

export const handlePlayAudios = (data) => {
  data?.map((item) => console.log(item?.file));
};
