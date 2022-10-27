import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormEvent, useState } from "react";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import Spinner from "../../../components/Spinner";
import axios from "axios";

const EditInventory = () => {
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [photo, setPhoto] = useState<File>();

  const editMutation = trpc.inventory.updateItem.useMutation({
    onSuccess: (data) => {
      if (data.signedUrl) {
        const config = {
          method: "put",
          url: data.signedUrl!,
          headers: {
            "Content-Type": `image/${photo?.type.split("/")[1]}`,
          },
          data: photo!,
        };

        axios(config)
          .then((response) => {
            router.push("/inventory");
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        router.push("/inventory");
      }
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editMutation.mutate({
      id: id as string,
      name,
      quantity,
      unit,
      pricePerUnit,
      extension: photo ? photo?.type.split("/")[1] : "",
    });
  };

  const { isLoading } = trpc.inventory.getById.useQuery(
    {
      id: id as string,
    },
    {
      onSuccess: (data) => {
        setName(data.name);
        setQuantity(data.quantity);
        setUnit(data.unit);
        setPricePerUnit(data.pricePerUnit);
      },
    }
  );

  if (isLoading) return <Spinner loadingText="Loading item..." />;

  if (editMutation.isLoading) return <Spinner loadingText="Updating item..." />;

  return (
    <Grid container spacing={3} direction="column" width="90%" margin="auto">
      <Grid item alignSelf="center">
        <Typography variant="h5" color="secondary" textAlign="center">
          Edit Inventory Item
        </Typography>
      </Grid>
      <Grid item>
        <form onSubmit={handleSubmit}>
          <Paper sx={{ padding: 3, width: "90%", marginX: "auto" }}>
            <Grid container direction="column" spacing={2}>
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
                  helperText="Leave blank to keep current photo"
                  label="Photo"
                  type="file"
                  variant="standard"
                  fullWidth
                  onChange={(e) => {
                    //@ts-ignore
                    setPhoto(e.target.files?.[0]);
                  }}
                />
              </Grid>
              <Grid item alignSelf="flex-end">
                <Button variant="outlined" color="primary" type="submit">
                  Update
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </form>
      </Grid>
    </Grid>
  );
};

export default EditInventory;
