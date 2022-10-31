import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMore from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import { useState } from "react";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Spinner from "../../components/Spinner";
import { Ingredient, Menu } from "@prisma/client";

const Menu = () => {
  const router = useRouter();
  const [isShowingIngredients, setIsShowingIngredients] = useState(false);

  const { data, isLoading } = trpc.menu.getMenu.useQuery(undefined, {
    onSuccess: (data) => {
      console.log(data);
    },
  });

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
          Menu
        </Typography>
      </Grid>
      <Grid
        item
        width={"70%"}
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Button
            variant="contained"
            color="warning"
            onClick={() => router.push("/menu/edit")}
          >
            Add Menu Item
          </Button>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                checked={isShowingIngredients}
                onChange={() => setIsShowingIngredients(!isShowingIngredients)}
              />
            }
            label="Show Ingredients"
            labelPlacement="start"
          />
        </Grid>
      </Grid>
      <Grid item width={"70%"}>
        <Paper elevation={2} sx={{ padding: 3 }}>
          {Object.keys(data?.menu).map((type) => {
            return (
              <Accordion key={type} sx={{ border: "1px solid #fff" }}>
                <AccordionSummary
                  expandIcon={<ExpandMore color="primary" fontSize="large" />}
                  aria-label="Expand"
                  aria-controls="1-content"
                  id="1-header"
                >
                  <Typography fontWeight={700} color="primary">
                    {type}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {data?.menu[type].map(
                    (item: Menu & { Ingredients: Ingredient[] }) => {
                      return (
                        <List key={item.id}>
                          <ListItem sx={{ border: "1px solid #fff" }}>
                            <ListItemText
                              primary={item.name}
                              secondary={`${item.calories} calories`}
                            />
                            {`₹ ${item.price}`}
                          </ListItem>
                          {isShowingIngredients &&
                            item.Ingredients &&
                            item.Ingredients.length > 0 && (
                              <List sx={{ px: 8, border: "1px solid #fff" }}>
                                {item.Ingredients.map((ingredient) => (
                                  <ListItem key={ingredient.id} disablePadding>
                                    <ListItemText
                                      primary={ingredient.name}
                                      primaryTypographyProps={{ fontSize: 15 }}
                                    />
                                    {ingredient.quantity}
                                  </ListItem>
                                ))}
                              </List>
                            )}
                        </List>
                      );
                    }
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Menu;
