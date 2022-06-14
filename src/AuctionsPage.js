import React, { useState } from "react";
import { Link } from "react-router-dom";
import useSWR, { mutate } from "swr";
import {
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@mui/material";
import CreateAuctionDialog from "./components/CreateAuctionDialog";
import { asNear, isAuctionEnded } from "./utils";
import ReactCountdown from "react-countdown";

const AuctionsPage = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const {
    data: auctions,
    error,
    mutate,
  } = useSWR("load-auctions-list", () => window.contract.getAuctionList());
  const handleCreateAuctionSuccess = () => {
    setIsOpenDialog(false);
    mutate();
  };

  return (
    <>
      <div>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography component="h1" variant="h3">
            Auction List
          </Typography>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setIsOpenDialog(true)}
          >
            Create
          </Button>
        </Stack>

        {error && <Alert severity="error">Failed to load auctions</Alert>}
        {!error && auctions && auctions.length <= 0 && (
          <Alert severity="info">There are no auctions so far</Alert>
        )}
        {auctions?.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Minimum Price</TableCell>
                <TableCell>Highest Price</TableCell>
                <TableCell>Ends In</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auctions.map((auction) => (
                <TableRow hover key={auction.id}>
                  <TableCell>
                    <Link to={`/auctions/${auction.id}`}>{auction.item}</Link>
                  </TableCell>
                  <TableCell>{asNear(auction.minPrice, true)}</TableCell>
                  <TableCell>
                    {auction.highestPriceAccount ? (
                      <>
                        <Typography>
                          {asNear(auction.highestPrice, true)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontStyle: "italic" }}
                        >
                          by {auction.highestPriceAccount}
                        </Typography>
                      </>
                    ) : (
                      "--"
                    )}
                  </TableCell>
                  <TableCell>
                    {isAuctionEnded(auction) ? (
                      "Ended"
                    ) : (
                      <ReactCountdown
                        daysInHours
                        date={auction.expireAt / 1000000}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <CreateAuctionDialog
        open={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
        onCreatedAuction={handleCreateAuctionSuccess}
      />
    </>
  );
};

export default AuctionsPage;
