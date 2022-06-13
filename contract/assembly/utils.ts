import { u128 } from "near-sdk-as";

export type AccountId = string;

export type Amount = u128;

export const ONE_NEAR = u128.from("1000000000000000000000000");

export const asNear = (amount: Amount): string =>
  u128.div(amount, ONE_NEAR).toString();
