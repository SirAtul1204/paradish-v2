import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Spinner from "../../components/Spinner";
import { trpc } from "../../utils/trpc";
import { useState, FormEvent } from "react";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { openAlert } from "../../redux/alertReducer";

const filter = createFilterOptions<string>();

const AddMenu = () => {
  const [type, setType] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [calories, setCalories] = useState(0);
  const [includeIngredients, setIncludeIngredients] = useState(false);

  const dispatch = useDispatch();

  const { data, isLoading } = trpc.restaurant.getTypes.useQuery();
  const addMenuItemMutation = trpc.menu.addItem.useMutation({
    onSuccess: (data) => {
      setType("");
      setName("");
      setPrice(0);
      setCalories(0);
      dispatch(
        openAlert({
          message: data.message,
          type: "success",
        })
      );
    },
    onError: (error) => {
      dispatch(
        openAlert({
          message: error.message,
          type: "error",
        })
      );
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type) {
      addMenuItemMutation.mutate({
        type: String(type),
        name,
        price,
        calories,
      });
    }
  };

  if (isLoading) return <Spinner />;

  if (addMenuItemMutation.isLoading)
    return <Spinner loadingText="Adding menu item..." />;

  return (
    <Grid
      container
      spacing={3}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item>
        <Typography textAlign="center" color="secondary" variant="h5">
          Edit Menu
        </Typography>
      </Grid>
      <Grid item width={"70%"}>
        <form onSubmit={handleSubmit}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Autocomplete
                  disablePortal
                  freeSolo
                  fullWidth
                  id="combo-box"
                  onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                      setType(newValue);
                    } else if (newValue) {
                      // Create a new value from the user input
                      setType(newValue);
                    } else {
                      setType(newValue);
                    }
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some(
                      (option) => inputValue === option
                    );
                    if (inputValue !== "" && !isExisting) {
                      filtered.push(`${inputValue}`);
                    }

                    return filtered;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === "string") {
                      return option;
                    }
                    // Add "xxx" option created dynamically
                    if (option) {
                      return option;
                    }
                    // Regular option
                    return option;
                  }}
                  options={data?.categories ?? []}
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      InputProps={{ ...params.InputProps, type: "search" }}
                      label="Type"
                      helperText="Please keep the name in plural like Starters, Milk shakes"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <TextField
                  required
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  label="Name"
                />
              </Grid>
              <Grid item>
                <TextField
                  required
                  fullWidth
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  label="Price"
                />
              </Grid>
              <Grid item>
                <TextField
                  required
                  fullWidth
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  label="Calories"
                />
              </Grid>
              {/* <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={includeIngredients}
                      onChange={() =>
                        setIncludeIngredients(!includeIngredients)
                      }
                    />
                  }
                  label="Include Ingredients"
                  labelPlacement="start"
                />
              </Grid> */}
              <Grid item alignSelf="flex-end">
                <Button variant="outlined" color="primary" type="submit">
                  Add
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </form>
      </Grid>
    </Grid>
  );
};

export default AddMenu;
