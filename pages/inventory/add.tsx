import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { FormEvent, useState } from "react";
import { trpc } from "../../utils/trpc";
import Spinner from "../../components/Spinner";
import { useRouter } from "next/router";
const AddInventoryItem = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [photo, setPhoto] = useState<File>();

  const router = useRouter();

  const { mutate, isLoading, isSuccess } = trpc.inventory.addItem.useMutation({
    onSuccess: () => {
      router.push("/inventory");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      name,
      quantity,
      unit,
      pricePerUnit,
      extension: photo ? photo?.type.split("/")[1] : "",
    });
  };

  if (isLoading || isSuccess) return <Spinner loadingText="Adding item..." />;

  return (
    <Grid
      container
      direction="column"
      spacing={3}
      alignItems="center"
      justifyContent="center"
      sx={{ width: "40%", margin: "0 auto" }}
    >
      <Grid item>
        <Typography variant="h5" color="secondary" textAlign="center">
          Add Item to Inventory
        </Typography>
      </Grid>
      <Grid item sx={{ width: "100%" }}>
        <Paper sx={{ padding: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid
              container
              spacing={2}
              alignItems="stretch"
              justifyContent="center"
              direction="column"
              width={"100%"}
            >
              <Grid item>
                <TextField
                  required
                  label="Name"
                  variant="standard"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  required
                  label="Quantity"
                  type="number"
                  variant="standard"
                  fullWidth
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </Grid>
              <Grid item>
                <TextField
                  required
                  label="Unit"
                  variant="standard"
                  fullWidth
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  required
                  label="Price Per Unit"
                  type="number"
                  variant="standard"
                  fullWidth
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(parseInt(e.target.value))}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Photo"
                  type="file"
                  variant="standard"
                  fullWidth
                  helperText="Leave empty for auto generated photo"
                  onChange={(e) => {
                    //@ts-ignore
                    setPhoto(e.target.files?.[0]);
                  }}
                />
              </Grid>
              <Grid item alignSelf="flex-end">
                <Button variant="outlined" color="primary" type="submit">
                  Add
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AddInventoryItem;
