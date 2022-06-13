import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  InputAdornment,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Big from "big.js";

const CreateAuctionDialog = (props) => {
  const [formError, setFormError] = useState();
  const { onCreatedAuction, ...dialogProps } = props;
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const onSubmit = (values) => {
    const params = {
      item: values.item,
      minPrice: Big(values.minPrice)
        .times(10 ** 24)
        .toFixed(),
    };

    console.log("values", params);
    setFormError(null);
    return window.contract
      .createAuction(params)
      .then(onCreatedAuction)
      .catch((error) => {
        console.error("Create auction failed: ", error);
        setFormError(error);
      });
  };
  return (
    <Dialog {...dialogProps}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>New Auction</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error">Failed to create new auction</Alert>
          )}
          <TextField
            label="Name"
            sx={{ mt: 2 }}
            fullWidth
            size="small"
            error={!!errors.item}
            helperText={errors.item?.message}
            InputProps={{ ...register("item") }}
          />
          <TextField
            label="Min Price"
            sx={{ mt: 2 }}
            fullWidth
            size="small"
            error={!!errors.minPrice}
            helperText={errors.minPrice?.message}
            InputProps={{
              endAdornment: <InputAdornment position="end">Ⓝ</InputAdornment>,
              ...register("minPrice"),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            type="button"
            onClick={() => dialogProps.onClose()}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateAuctionDialog;
