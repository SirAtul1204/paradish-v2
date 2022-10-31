import Grid from "@mui/material/Grid";
import ListItemText from "@mui/material/ListItemText";
import Fab from "@mui/material/Fab";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/cart";

interface WaiterDeckTileProps {
  id: string;
  name: string;
  price: number;
  calories: number;
  type: string;
}

const WaiterDeckTile: FC<WaiterDeckTileProps> = ({
  id,
  name,
  price,
  calories,
  type,
}) => {
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  const handleAddItem = () => {
    setCount(count + 1);
    dispatch(addItem({ item: { id, name, calories, price, type } }));
  };

  const handleRemoveItem = () => {
    if (count > 0) {
      setCount(count - 1);
      dispatch(addItem({ item: { id, name, calories, price, type } }));
    }
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      sx={{ borderBottom: "1px solid #fff", marginBottom: 1, paddingBottom: 1 }}
    >
      <Grid item xs={5}>
        <ListItemText
          primary={name}
          secondary={`${type} , ${calories} calories`}
        />
      </Grid>
      <Grid item container xs={3} justifyContent="center">
        <Grid item>
          <ListItemText primary={`₹ ${price}`} />
        </Grid>
      </Grid>
      <Grid
        item
        container
        spacing={1}
        alignItems="center"
        justifyContent="flex-end"
        xs={4}
      >
        <Grid item>
          <Fab
            color="primary"
            aria-label="Add"
            size="small"
            disabled={count === 0 ? true : false}
          >
            <RemoveIcon onClick={handleRemoveItem} />
          </Fab>
        </Grid>
        <Grid item>
          <Chip label={count} />
        </Grid>
        <Grid item>
          <Fab color="primary" aria-label="Add" size="small">
            <AddIcon onClick={handleAddItem} />
          </Fab>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default WaiterDeckTile;
