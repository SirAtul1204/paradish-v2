import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";

const Inventory = () => {
  const router = useRouter();
  return (
    <Grid
      container
      spacing={3}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        item
        lg={12}
        container
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <Typography variant="h6" color="success.main">
            Add Item to Inventory
          </Typography>
        </Grid>
        <Grid item>&rarr;</Grid>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            onClick={() => router.push("/inventory/add")}
          >
            Add Item
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant="h5" color="secondary">
          Inventory Details
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Inventory;
