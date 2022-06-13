import Big from "big.js";
import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import getConfig from "./config";

const nearConfig = getConfig(process.env.NODE_ENV || "development");

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  );

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near);

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId();

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: ["getAuctionList", "getAuction"],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: ["createAuction", "bid"],
    }
  );
}

export function logout() {
  window.walletConnection.signOut();
  // reload page
  window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName);
}

export function asNear(yocto, withSymbol) {
  const converted = Big(yocto)
    .div(10 ** 24)
    .toNumber();

  if (withSymbol) {
    return `${converted} Ⓝ`;
  }
  return converted;
}

export function toYocto(near) {
  return Big(near)
    .times(10 ** 24)
    .toFixed();
}

export const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 14)
  .toFixed();

// Milliseconds to nanoseconds
export const msToNs = (ms) => ms * 1000000;

// Nanoseconds to illiseconds
export const nsToMs = (ns) => ns / 1000000;

export const isAuctionEnded = (auction) =>
  msToNs(Date.now()) > auction.expireAt;
