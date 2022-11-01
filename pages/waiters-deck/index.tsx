import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Spinner from "../../components/Spinner";
import WaiterDeckTile from "../../components/WaiterDeckTile";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { clearCart, hydrateCart } from "../../redux/cart";

const WaitersDeck = () => {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");
  const { totalQuantity } = useSelector((state: RootState) => state.cart);

  const { data, isLoading } = trpc.menu.getAllSorted.useQuery(undefined, {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const dispatch = useDispatch();

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart") || "null");
    if (items) {
      dispatch(hydrateCart(items));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Box sx={{ position: "fixed", bottom: "1rem" }}>
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => router.push("/waiters-deck/cart")}
              disabled={totalQuantity <= 0}
            >
              <Grid
                container
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                <Grid item>Cart</Grid>
                <Grid item>
                  <Chip size="small" label={totalQuantity} variant="filled" />
                </Grid>
              </Grid>
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="error" onClick={handleClearCart}>
              Clear Cart
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default WaitersDeck;
