import {
  PersistentVector,
  PersistentMap,
  Context,
  logging,
  ContractPromiseBatch,
  ContractPromise,
} from "near-sdk-as";
import { AccountId, Amount, asNear } from "./utils";

// 1 day, in nanoseconds
const EXPIRE_IN: u64 = 1 * 24 * 60 * 60 * 1000 * 1000 * 1000;

@nearBindgen
export class Auction {
  private id: i32;
  private item: string;
  private minPrice: Amount;
  private highestPrice: Amount;
  private highestPriceAccount: AccountId;
  private createdAt: u64;
  private expireAt: u64;

  constructor(id: i32, item: string, minPrice: Amount) {
    this.id = id;
    this.item = item;
    this.minPrice = minPrice;
    this.highestPrice = minPrice;
    this.highestPriceAccount = "";
    this.createdAt = Context.blockTimestamp;
    this.expireAt = Context.blockTimestamp + EXPIRE_IN;
  }

  bid(): void {
    assert(this.checkIsEnded() == false, "The auction has ended");
    assert(
      Context.attachedDeposit > this.highestPrice,
      "The price must be higher than " + asNear(this.highestPrice)
    );
    assert(
      Context.sender != this.highestPriceAccount,
      "Your are the leader already"
    );

    if (this.highestPriceAccount.length > 0) {
      const lastAccount = this.highestPriceAccount;
      const toReturn = this.highestPrice;
      const promise = ContractPromiseBatch.create(lastAccount);
      promise.transfer(toReturn);
    }

    this.highestPrice = Context.attachedDeposit;
    this.highestPriceAccount = Context.sender;
  }

  checkIsEnded(): boolean {
    return Context.blockTimestamp > this.expireAt;
  }
}

export const auctions = new PersistentVector<Auction>("a");
