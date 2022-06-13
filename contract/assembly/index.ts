import { Amount } from "./utils";
import { Auction, auctions } from "./models";

export function createAuction(item: string, minPrice: Amount): void {
  const id = auctions.length;
  const auction = new Auction(id, item, minPrice);
  auctions.push(auction);
}

export function getAuctionList(): Array<Auction> {
  const length = auctions.length;
  const result = new Array<Auction>(length);
  for (let i = 0; i < length; i++) {
    result[i] = auctions[length - i - 1];
  }
  return result;
}

export function getAuction(id: i32): Auction {
  assert(auctions.containsIndex(id), "Auction is not found");
  return auctions[id];
}

export function bid(id: i32): void {
  const auction = getAuction(id);
  auction.bid();
  auctions.replace(id, auction);
}
