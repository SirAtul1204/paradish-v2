import { Alert, Snackbar } from "@mui/material";
import { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { closeAlert } from "../redux/alertReducer";

const MyAlert = () => {
  const { isOpen, message, type } = useSelector(
    (state: RootState) => state.alert
  );

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeAlert());
  };

  return (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MyAlert;
