import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import Spinner from "../components/Spinner";
import { Order } from "@prisma/client";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const Bills = () => {
  const [search, setSearch] = useState("");

  const { data, isLoading } = trpc.order.getCompleted.useQuery();

  if (isLoading) return <Spinner loadingText="Getting Bills" />;

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
          Bills
        </Typography>
      </Grid>
      <Grid item width={"70%"}>
        <TextField
          fullWidth
          id="search"
          label="Search By Table Number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Grid>
      <Grid
        item
        container
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        {data?.map((order) => (
          <Grid item key={order.id}>
            <Bill order={order} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

function Bill({ order }: { order: Order }) {
  const utils = trpc.useContext();
  const { mutate } = trpc.order.setToPaid.useMutation({
    onSuccess: () => {
      utils.order.getCompleted.invalidate();
    },
  });
  const handlePaid = () => {
    if (
      confirm(
        `Are you sure you want to mark this bill of ₹ ${order.totalPrice} for table number ${order.tableNo} as paid?`
      )
    ) {
      mutate({ id: order.id });
    }
  };

  return (
    <Card sx={{ padding: 2, height: 400, width: 300, position: "relative" }}>
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <Typography variant="h6" color="secondary">
            Table Number: {order.tableNo}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">Total: ₹ {order.totalPrice}</Typography>
        </Grid>
        <Grid item>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{makeTable()}</TableBody>
          </Table>
        </Grid>
      </Grid>
      <Box sx={{ position: "absolute", bottom: 0, right: 0, width: "100%" }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handlePaid}
        >
          Set to Paid
        </Button>
      </Box>
    </Card>
  );

  function makeTable() {
    const parsedItems = JSON.parse(order.items);
    return Object.keys(parsedItems).map((item) => (
      <TableRow key={parsedItems[item].id}>
        <TableCell>{parsedItems[item].name}</TableCell>
        <TableCell>{parsedItems[item].quantity}</TableCell>
        <TableCell>{parsedItems[item].price}</TableCell>
      </TableRow>
    ));
  }
}

export default Bills;
