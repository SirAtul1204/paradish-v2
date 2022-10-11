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
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { trpc } from "../../utils/trpc";

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

  const router = useRouter();

  const { data, isLoading } = trpc.user.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "name",
      headerName: "Name",
      width: 120,
    },
    {
      field: "photo",
      headerName: "Photo",
      width: 120,
      renderCell: (params: any) => (
        <Avatar
          src={params.value}
          alt="photo"
          sx={{ width: 100, height: 100 }}
        />
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    { field: "role", headerName: "Role", width: 80 },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "aadharNumber",
      headerName: "Aadhar Number",
      width: 300,
      renderCell: (params: any) => {
        if (!params.value) return null;
        const vals = params.value.split(",");

        return (
          <Box>
            {vals.map((val: string) => (
              <Typography key={val}>{val}</Typography>
            ))}
          </Box>
        );
      },
    },
    { field: "panNumber", headerName: "Pan Number", width: 200 },
    { field: "address", headerName: "Address", width: 300 },
  ];

  if (isLoading) return <Spinner loadingText="Loading Employees" />;

  return (
    <Grid container direction="column" spacing={2}>
      <Grid
        item
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <Typography variant="h6" color="success" textAlign="center">
            Add Employee
          </Typography>
        </Grid>
        <Grid item>&rarr;</Grid>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            sx={{ fontWeight: 700 }}
            onClick={(e) => router.push("/employees/add")}
          >
            Add
          </Button>
        </Grid>
      </Grid>
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
        <Box>
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
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Employees;
