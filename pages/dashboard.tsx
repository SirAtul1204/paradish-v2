import { Button, Card, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import CardButton from "../components/CardButton";
import MaterialImage from "../components/MaterialImage";

const Dashboard = () => {
  const router = useRouter();

  const buttons = [
    {
      title: "Employees",
      image: "/assets/employee.png",
      onClick: () => router.push("/employees"),
    },
  ];

  return (
    <Grid container justifyContent="center" alignItems="center" spacing={2}>
      <Grid item>
        {buttons.map((button) => (
          <CardButton key={button.title} {...button} />
        ))}
      </Grid>
    </Grid>
  );
};

export default Dashboard;
