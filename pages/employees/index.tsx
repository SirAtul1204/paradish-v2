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
import { Role } from "@prisma/client";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Spinner from "../../components/Spinner";
import { openAlert } from "../../redux/alertReducer";
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
  const [selection, setSelection] = useState<any>([]);

  const router = useRouter();
  const dispatch = useDispatch();

  const { data, isLoading, refetch } = trpc.user.getAll.useQuery();

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
    { field: "role", headerName: "Role", width: 120 },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "aadharNumber",
      headerName: "Aadhar Number",
      width: 300,
    },
    { field: "salary", headerName: "Salary", width: 150 },
    {
      field: "dob",
      headerName: "Date of Birth",
      width: 150,
      renderCell: (params: any) => {
        const dateString = DateTime.fromISO(params.value).toFormat(
          "dd/MM/yyyy"
        );
        if (dateString === "Invalid DateTime") return "";
        return dateString;
      },
    },
    {
      field: "doj",
      headerName: "Date of Joining",
      width: 150,
      renderCell: (params: any) => {
        const dateString = DateTime.fromISO(params.value).toFormat(
          "dd/MM/yyyy"
        );
        if (dateString === "Invalid DateTime") return "";
        return dateString;
      },
    },
    { field: "panNumber", headerName: "Pan Number", width: 200 },
    {
      field: "address",
      headerName: "Address",
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
  ];

  const deleteMutation = trpc.user.deleteUser.useMutation({
    onSuccess: (data) => {
      dispatch(openAlert({ type: "success", message: data.message }));
      refetch();
    },
    onError: (error) => {
      dispatch(openAlert({ type: "error", message: error.message }));
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate({ ids: selection });
  };

  const handleEdit = () => {
    router.push(`/employees/edit/${selection[0]}`);
  };

  if (isLoading) return <Spinner loadingText="Loading Employees" />;

  if (deleteMutation.isLoading)
    return <Spinner loadingText="Deleting Employees" />;

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
            onSelectionModelChange={(newSelection) => {
              setSelection(newSelection);
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Employees;
