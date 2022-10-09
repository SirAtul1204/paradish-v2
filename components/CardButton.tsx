import { Button, Grid, Typography } from "@mui/material";
import { FC } from "react";
import MaterialImage from "./MaterialImage";

export interface CardButtonProps {
  title: string;
  image: string;
  onClick: () => void;
}

const CardButton: FC<CardButtonProps> = ({ title, image, onClick }) => {
  return (
    <Button variant="contained" onClick={onClick}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <MaterialImage src={image} width={150} height={150} />
        </Grid>
        <Grid item>
          <Typography variant="body1" fontWeight={700}>
            {title}
          </Typography>
        </Grid>
      </Grid>
    </Button>
  );
};

export default CardButton;
