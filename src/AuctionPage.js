import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useSWR, { mutate } from "swr";
import { useForm } from "react-hook-form";
import {
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Link } from "react-router-dom";
import ReactCountdown from "react-countdown";
import {
  asNear,
  toYocto,
  BOATLOAD_OF_GAS,
  isAuctionEnded,
  nsToMs,
} from "./utils";

const isValidId = (id) => {
  if (typeof id === "number") {
    return true;
  }
  if (typeof id === "string") {
    return !isNaN(id);
  }
  return false;
};

const AuctionPage = () => {
  const { id: auctionId } = useParams();

  const {
    data: auction,
    error,
    mutate,
  } = useSWR(
    isValidId(auctionId) ? [auctionId, "load-auctions-list"] : null,
    () => window.contract.getAuction({ id: parseInt(auctionId) })
  );

  if (error) {
    console.error("Failed to load auction ", auctionId, error);
  }

  return (
    <div>
      <Button variant="text" component={Link} to="/auctions" sx={{ mb: 2 }}>
        Back
      </Button>
      <Typography variant="h3" component="h1">
        Auction #{auctionId}
      </Typography>

      {!isValidId(auctionId) && <Alert severity="error">Invalid auction</Alert>}
      {error && <Alert severity="error">Failed to load the auction</Alert>}
      {!error && auction && (
        <AuctionDetails auction={auction} onBidSuccess={mutate} />
      )}
    </div>
  );
};

const AuctionDetails = ({ auction, onBidSuccess }) => {
  const [isEnded, setIsEnded] = useState(isAuctionEnded(auction));
  const isLeader =
    auction.highestPriceAccount === window.walletConnection.getAccountId();
  const [error, setError] = useState();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = (values) => {
    setError(null);
    const yocto = toYocto(values.price);
    return window.contract
      .bid({ id: auction.id }, BOATLOAD_OF_GAS, yocto)
      .then(() => {
        onBidSuccess();
        reset();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Stack spacing={2}>
      {!isEnded && (
        <Typography>
          Ends in{" "}
          <ReactCountdown
            daysInHours
            date={nsToMs(auction.expireAt)}
            onComplete={() => setIsEnded(true)}
          />
        </Typography>
      )}
      <Typography variant="h5" component="h2" sx={{ mt: 4 }}>
        Item: {auction.item}
      </Typography>

      {auction.highestPriceAccount.length > 0 ? (
        <Typography>
          Highest price: <b>{asNear(auction.highestPrice, true)}</b> -{" "}
          <i>by {auction.highestPriceAccount}</i>
        </Typography>
      ) : (
        <Typography>
          Mininum price: <b>{asNear(auction.highestPrice, true)}</b>
        </Typography>
      )}
      {error && <Alert severity="error">Failed to bid</Alert>}
      {isLeader && !isEnded && (
        <Alert severity="info">Your price is the highest price so far</Alert>
      )}
      {isLeader && isEnded && (
        <Alert severity="info">Congratulation! You are the winner.</Alert>
      )}
      {isEnded && !isLeader && auction.highestPriceAccount.length > 0 && (
        <Alert severity="info">
          <b>{auction.highestPriceAccount}</b> won the auction with{" "}
          {asNear(auction.highestPrice, true)}
        </Alert>
      )}
      {isEnded && auction.highestPriceAccount.length <= 0 && (
        <Alert severity="info">The auction ended</Alert>
      )}
      {!isLeader && !isEnded && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Your Price"
            sx={{ mr: 2 }}
            size="small"
            error={!!errors.price}
            helperText={errors.price?.message}
            InputProps={{
              endAdornment: <InputAdornment position="end">Ⓝ</InputAdornment>,
              ...register("price"),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            Bid
          </Button>
        </form>
      )}
    </Stack>
  );
};

export default AuctionPage;
