import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import { useState, useEffect } from "react";
import Fab from "@mui/material/Fab";
import RemoveIcon from "@mui/icons-material/Remove";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { addItem, clearCart, hydrateCart, removeItem } from "../../redux/cart";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { openAlert } from "../../redux/alertReducer";
import { trpc } from "../../utils/trpc";
import { OrderStatus } from "@prisma/client";
import Spinner from "../../components/Spinner";
import { useRouter } from "next/router";

const Cart = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [tableNumber, setTableNumber] = useState("");

  const dispatch = useDispatch();
  const { items, totalPrice, totalQuantity, totalCalories } = useSelector(
    (state: RootState) => state.cart
  );

  const handleAddItem = (item: any) => {
    dispatch(addItem({ item }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem({ itemId: id }));
  };

  const { mutate, isLoading } = trpc.order.create.useMutation({
    onSuccess: (data) => {
      dispatch(openAlert({ message: data.message, type: "success" }));
      dispatch(clearCart());
      router.push("/waiters-deck");
    },
    onError: (err) => {
      dispatch(openAlert({ message: err.message, type: "error" }));
    },
  });

  const placeOrder = () => {
    if (tableNumber === "") {
      dispatch(
        openAlert({ message: "Please enter table number", type: "error" })
      );
      return;
    }

    mutate({
      tableNumber,
      totalCalories,
      totalPrice,
      totalQuantity,
      status: OrderStatus.PENDING,
      items: JSON.stringify(items),
    });
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart") || "null");
    dispatch(hydrateCart(items));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Spinner loadingText="Placing order..." />;

  return (
    <Grid
      container
      spacing={2}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item>
        <Typography variant="h5" color="secondary">
          Cart
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h6">Confirm your order</Typography>
      </Grid>
      <Grid item>
        <TextField
          label="Table Number"
          variant="outlined"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />
      </Grid>
      <Grid item width={"70%"}>
        <TextField
          fullWidth
          id="search"
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Grid>
      <Grid
        item
        width={"70%"}
        container
        direction="column"
        spacing={1}
        alignItems="center"
        justifyContent="center"
      >
        {Object.keys(items).map((item) => {
          return search === "" ||
            items[item].name.toLowerCase().includes(search.toLowerCase()) ? (
            <Grid item key={item} width="100%">
              <Card sx={{ paddingX: 3, paddingY: 2 }}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item xs={6} container direction="column">
                    <Grid item>
                      <Typography variant="body1">
                        {items[item].name}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" color="textSecondary">
                        {items[item].calories} Calories
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body1">
                      ₹ {items[item].price}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    container
                    spacing={1}
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <Grid item>
                      <Fab
                        color="warning"
                        aria-label="remove item"
                        size="small"
                        style={{ transform: "scale(0.7)" }}
                        onClick={() => handleRemoveItem(items[item].id)}
                      >
                        <RemoveIcon />
                      </Fab>
                    </Grid>
                    <Grid item>
                      <Chip
                        size="small"
                        label={items[item].quantity}
                        variant="filled"
                      />
                    </Grid>
                    <Grid item>
                      <Fab
                        color="success"
                        aria-label="add item"
                        size="small"
                        style={{ transform: "scale(0.7)" }}
                        onClick={() => handleAddItem(items[item])}
                      >
                        <AddIcon />
                      </Fab>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ) : (
            <></>
          );
        })}
      </Grid>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          background: "black",
          width: "100%",
          padding: 2,
        }}
      >
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item>
            <Button
              variant="outlined"
              color="error"
              onClick={() => router.push("/waiters-deck")}
            >
              Back to Menu
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="body1">Total Price: ₹ {totalPrice}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              Total Quantity: {totalQuantity}
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="info" onClick={placeOrder}>
              Place Order
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default Cart;
