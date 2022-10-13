import { Box, Button, Card, Grid, Typography } from "@mui/material";
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
    {
      title: "Inventory",
      image: "/assets/inventory.png",
      onClick: () => router.push("/inventory"),
    },
    {
      title: "Menu",
      image: "/assets/menu.png",
      onClick: () => router.push("/menu"),
    },
  ];

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        {buttons.map((button) => (
          <Grid item key={button.title}>
            <CardButton {...button} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
