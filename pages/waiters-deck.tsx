import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import Spinner from "../components/Spinner";
import WaiterDeckTile from "../components/WaiterDeckTile";
import TextField from "@mui/material/TextField";
import { useState } from "react";

const WaitersDeck = () => {
  const router = useRouter();

  const [searchVal, setSearchVal] = useState("");

  const { data, isLoading } = trpc.menu.getAllSorted.useQuery(undefined, {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  if (isLoading) return <Spinner loadingText="Loading menu..." />;

  return (
    <Grid
      container
      spacing={3}
      justifyContent="center"
      direction="column"
      alignItems="center"
    >
      <Grid item>
        <Typography textAlign="center" color="secondary" variant="h5">
          Waiter&apos;s Deck
        </Typography>
      </Grid>
      <Grid item width={"70%"}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
      </Grid>
      <Grid item width={"70%"}>
        <Paper elevation={2} sx={{ padding: 3 }}>
          {data?.items.map((item) => {
            if (
              searchVal === "" ||
              item.name.toLowerCase().includes(searchVal.toLowerCase())
            )
              return <WaiterDeckTile key={item.id} {...item} />;
            else return <></>;
          })}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default WaitersDeck;
