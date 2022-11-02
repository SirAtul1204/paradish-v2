import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import { trpc } from "../utils/trpc";
import Spinner from "../components/Spinner";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Order, OrderStatus } from "@prisma/client";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Fab from "@mui/material/Fab";
import DoneIcon from "@mui/icons-material/Done";
import { useState } from "react";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

const Order = () => {
  const [statusMap, setStatusMap] = useState(new Map<string, OrderStatus>());
  const [filter, setFilter] = useState(
    new Map<OrderStatus, boolean>([
      [OrderStatus.PENDING, true],
      [OrderStatus.ACCEPTED, true],
      [OrderStatus.CANCELLED, true],
      [OrderStatus.COMPLETED, true],
      [OrderStatus.PROCESSING, true],
    ])
  );

  const { data, isLoading, refetch } = trpc.order.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const updateOrderStatusMutation = trpc.order.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const updateStatus = (id: string) => {
    const status = statusMap.get(id);
    if (status) {
      updateOrderStatusMutation.mutate({ id, status });
    }
  };

  if (isLoading) return <Spinner loadingText="Loading your orders!" />;

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
          Orders
        </Typography>
      </Grid>
      <Grid
        item
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        {Object.keys(OrderStatus).map((status) => {
          return (
            <Grid item key={status}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filter.get(status as OrderStatus)}
                    onChange={(e) => {
                      const newFilter = new Map(filter);
                      newFilter.set(status as OrderStatus, e.target.checked);
                      setFilter(newFilter);
                    }}
                  />
                }
                label={status}
                labelPlacement="start"
              />
            </Grid>
          );
        })}
      </Grid>
      <Grid item container spacing={2}>
        {data?.map((order) => {
          return filter.get(order.status as OrderStatus) ? (
            <Grid item key={order.id}>
              <Card sx={{ padding: 3, width: 350, height: 300 }}>
                <Grid
                  container
                  direction="column"
                  spacing={2}
                  alignItems="stretch"
                  justifyContent="space-between"
                  width={"100%"}
                  height={"100%"}
                >
                  <Grid item>
                    <List>
                      {makeCard(order)}
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ marginTop: 2 }}
                      >
                        <Grid item>
                          <Typography>Status: </Typography>
                        </Grid>
                        <Grid item>
                          <Chip label={order.status} />
                        </Grid>
                      </Grid>
                    </List>
                  </Grid>
                  <Grid
                    item
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item xs={10}>
                      <FormControl fullWidth>
                        <InputLabel id="select-label">Status</InputLabel>
                        <Select
                          label="Status"
                          labelId="select-label"
                          value={statusMap.get(order.id)}
                          onChange={(event) => {
                            setStatusMap(
                              new Map(
                                statusMap.set(
                                  order.id,
                                  event.target.value as OrderStatus
                                )
                              )
                            );
                          }}
                        >
                          {Object.keys(OrderStatus).map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                      <Fab
                        color="success"
                        aria-label="set-status"
                        size="small"
                        onClick={() => updateStatus(order.id)}
                      >
                        <DoneIcon />
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
    </Grid>
  );

  function makeCard(order: Order) {
    const parsedItems = JSON.parse(order.items);
    return Object.keys(parsedItems).map((p) => (
      <Grid
        container
        key={p}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ borderBottom: "1px solid #fff" }}
      >
        <Grid item>
          <Typography>{parsedItems[p].name} </Typography>
        </Grid>
        <Grid item>
          <Typography>{parsedItems[p].quantity}</Typography>
        </Grid>
      </Grid>
    ));
  }
};

export default Order;
