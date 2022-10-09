import {
  Grid,
  TextField,
  Typography,
  Box,
  Avatar,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DataGrid, GridLinkOperator } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

export type TCols =
  | "id"
  | "name"
  | "photo"
  | "email"
  | "role"
  | "phone"
  | "aadharNumber"
  | "panNumber"
  | "address"
  | null;

const Employees = () => {
  const [filter, setFilter] = useState<TCols>(null);
  const [search, setSearch] = useState("");

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 3 },
    {
      field: "photo",
      headerName: "Photo",
      flex: 3,
      renderCell: (params: any) => (
        <Avatar
          src={params.value}
          alt="photo"
          sx={{ width: 100, height: 100 }}
        />
      ),
    },
    { field: "email", headerName: "Email", flex: 3 },
    { field: "role", headerName: "Role", flex: 2 },
    { field: "phone", headerName: "Phone", flex: 3 },
    { field: "aadharNumber", headerName: "Aadhar Number", flex: 3 },
    { field: "panNumber", headerName: "Pan Number", flex: 3 },
    { field: "address", headerName: "Address", flex: 4 },
  ];

  const rows = [
    {
      id: 1,
      name: "John Doe",
      photo: "https://picsum.photos/200",
      email: "loremisum",
      role: "Admin",
      phone: "1234567890",
      address: "Lorem Ipsum",
      aadharNumber: "123456789012",
      panNumber: "1234567890",
    },
    {
      id: 2,
      name: "Jane Doe",
      photo: "https://picsum.photos/200",
      email: "loremisum",
      role: "Admin",
      phone: "1234567890",
      address: "Lorem Ipsum",
      aadharNumber: "123456789012",
      panNumber: "1234567890",
    },
    {
      id: 3,
      name: "Jane Doe",
      photo: "https://picsum.photos/200",
      email: "loremisum",
      role: "Admin",
      phone: "1234567890",
      address: "Lorem Ipsum",
      aadharNumber: "123456789012",
      panNumber: "1234567890",
    },
  ];

  useEffect(() => {
    console.log(filter);
  });

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h5" textAlign="center" color="secondary">
          Employee Details
        </Typography>
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
            <InputLabel id="select-filter">Age</InputLabel>
            <Select
              fullWidth
              label="Filter"
              labelId="select-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as TCols)}
            >
              <MenuItem value="id">ID</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="photo">Photo</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="role">Role</MenuItem>
              <MenuItem value="phone">Phone</MenuItem>
              <MenuItem value="aadharNumber">Aadhar Number</MenuItem>
              <MenuItem value="panNumber">Pan Number</MenuItem>
              <MenuItem value="address">Address</MenuItem>
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
            rows={rows}
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
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Employees;
