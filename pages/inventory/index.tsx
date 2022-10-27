import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import { DateTime } from "luxon";
import { trpc } from "../../utils/trpc";
import Spinner from "../../components/Spinner";

const Inventory = () => {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState<any>([]);

  const { data, isLoading, refetch } = trpc.inventory.getAllItems.useQuery();

  const deleteMutation = trpc.inventory.deleteMultiple.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "quantity", headerName: "Quantity", width: 130 },
    { field: "unit", headerName: "Unit", width: 130 },
    { field: "pricePerUnit", headerName: "Price Per Unit", width: 130 },
    {
      field: "photo",
      headerName: "Photo",
      width: 130,
      renderCell: (params: any) => {
        return (
          <Avatar
            src={params.value}
            alt="photo"
            sx={{ width: 100, height: 100 }}
          />
        );
      },
    },
    {
      field: "dateOfLastUpdate",
      headerName: "Date of Last Update",
      width: 200,
      renderCell: (params: any) => {
        return (
          <Typography variant="body2">
            {DateTime.fromISO(params.value).toFormat("dd/MM/yyyy")}
          </Typography>
        );
      },
    },
  ];

  const handleEdit = () => {
    router.push(`/inventory/edit/${selection[0]}`);
  };

  const handleDelete = () => {
    deleteMutation.mutate({ ids: selection });
  };

  if (isLoading) return <Spinner loadingText="Loading Inventory" />;

  if (deleteMutation.isLoading) return <Spinner loadingText="Deleting Items" />;

  return (
    <Grid container spacing={3} direction="column">
      <Grid
        item
        container
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <Typography variant="h6" color="success.main" textAlign="center">
            Add Item to Inventory
          </Typography>
        </Grid>
        <Grid item>&rarr;</Grid>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            sx={{ fontWeight: 700 }}
            onClick={() => router.push("/inventory/add")}
          >
            Add Item
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant="h5" color="secondary" textAlign="center">
          Inventory Details
        </Typography>
      </Grid>
      <Grid
        item
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Button
            variant="contained"
            color="warning"
            onClick={handleEdit}
            disabled={selection.length === 1 ? false : true}
          >
            Edit
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={selection.length >= 1 ? false : true}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
      <Grid
        item
        container
        spacing={3}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item lg={4}>
          <FormControl fullWidth>
            <InputLabel id="select-filter">Filter</InputLabel>
            <Select
              fullWidth
              label="Filter"
              labelId="select-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="id">ID</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="quantity">Quantity</MenuItem>
              <MenuItem value="unit">Unit</MenuItem>
              <MenuItem value="pricePerUnit">Price Per Unit</MenuItem>
              <MenuItem value="photo">Photo</MenuItem>
              <MenuItem value="dateOfLastUpdate">Date Of Last Update</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={4}>
          <TextField
            label="Search"
            variant="filled"
            color="info"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid item>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            columns={columns}
            rows={data}
            rowHeight={200}
            autoHeight
            showColumnRightBorder
            showCellRightBorder
            disableColumnFilter
            filterModel={{
              items: [
                {
                  columnField: filter ?? "",
                  operatorValue: "contains",
                  value: search,
                },
              ],
            }}
            checkboxSelection
            disableSelectionOnClick
            scrollbarSize={1}
            onSelectionModelChange={(newSelection) => {
              setSelection(newSelection);
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Inventory;
