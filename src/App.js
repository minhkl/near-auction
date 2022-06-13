import "regenerator-runtime/runtime";
import { Container, Button, AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";
import { login, logout } from "./utils";
import AuctionsPage from "./AuctionsPage";
import AuctionPage from "./AuctionPage";
import { Routes, Route } from "react-router-dom";

import getConfig from "./config";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

export default function App() {
  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>Welcome to NEAR!</h1>
        <p>
          To make use of the NEAR blockchain, you need to sign in. The button
          below will sign you in using NEAR Wallet.
        </p>
        <p>
          By default, when your app runs in "development" mode, it connects to a
          test network ("testnet") wallet. This works just like the main network
          ("mainnet") wallet, but the NEAR Tokens on testnet aren't convertible
          to other currencies – they're just for testing!
        </p>
        <p>Go ahead and click the button below to try it out:</p>
        <p style={{ textAlign: "center", marginTop: "2.5em" }}>
          <Button variant="contained" color="primary" onClick={login}>
            Sign in
          </Button>
        </p>
      </main>
    );
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <div>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">NEAR Auction</Typography>
          <Button onClick={logout} color="secondary" variant="contained">
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ p: 4 }}>
        <Routes>
          <Route path="/" element={<AuctionsPage />} />
          <Route path="auctions" element={<AuctionsPage />}></Route>
          <Route path="auctions/:id" element={<AuctionPage />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
      </Container>
    </div>
  );
}
