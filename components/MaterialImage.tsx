import { Box } from "@mui/material";
import Image from "next/image";
import { FC } from "react";

interface MaterialImageProps {
  src: string;
  width: number;
  height: number;
}

const MaterialImage: FC<MaterialImageProps> = ({ src, width, height }) => {
  return (
    <Box sx={{ position: "relative", width: width, height: height }}>
      <Image src={src} layout="fill" alt="Logo" />
    </Box>
  );
};

export default MaterialImage;
