import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { trpc } from "../utils/trpc";
import Spinner from "../components/Spinner";
import Typography from "@mui/material/Typography";

const Order = () => {
  const { data, isLoading } = trpc.order.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  if (isLoading) return <Spinner loadingText="Loading your orders!" />;

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Card sx={{ padding: 3 }}>
          {data?.map((order) => (
            <List key={order.id}>
              {Object.keys(JSON.parse(order.items)).map((p) => (
                <Typography key={p}>
                  {JSON.parse(order.items)[p].name}
                </Typography>
              ))}
            </List>
          ))}
        </Card>
      </Grid>
    </Grid>
  );
};

export default Order;
