import ms from "ms";
import * as db from "quick.db";
import { DisconomyOptions, EcoOptions, CooldownType } from "../../";

const bal = "bal";
const daily = "daily";
const weekly = "weekly";
const monthly = "monthly";

const cooldowns = new Map([
  ["d", 8.64e7],
  ["w", 6.048e8],
  ["m", 2.592e9],
]);

export class Disconomy {
  public version: string;
  public dailyAmount: number;
  public weeklyAmount: number;
  public monthlyAmount: number;
  public constructor(ops: DisconomyOptions = {}) {
    this.dailyAmount = ops.dailyAmount ?? 150;

    this.weeklyAmount = ops.weeklyAmount ?? 500;

    this.monthlyAmount = ops.monthlyAmount ?? 150;

    this.version = require("../../package.json");
  }

  private key(id: string, type: string, ops: EcoOptions = {}): string {
    let key: string = "";
    switch (type) {
      case "bal":
        key = `bal_${ops.guild ? `${ops.guild}_` : ""}${id}`;
        break;
      case daily:
      case weekly:
      case monthly:
        key = `cooldowns_${ops.guild ? `${ops.guild}_` : ""}${id}.${type}`;
        break;
    }

    return key;
  }

  public add(id: string, amount: number, ops: EcoOptions = {}): number {
    return db.add(this.key(id, "bal", ops), amount);
  }

  public balance(id: string, ops: EcoOptions = {}): number {
    const key = this.key(id, bal, ops);
    if (!db.has(key)) db.set(key, 0);

    return db.fetch(key);
  }

  public set(id: string, amount: number, ops: EcoOptions = {}): number {
    return db.set(this.key(id, bal, ops), amount);
  }

  public subtract(id: string, amount: number, ops: EcoOptions = {}): number {
    return db.subtract(this.key(id, bal, ops), amount);
  }

  public deduct(id: string, amount: number, ops: EcoOptions = {}): number {
    return this.subtract(id, amount, ops);
  }

  public daily(id: string, ops: EcoOptions = {}): boolean {
    if (!db.fetch(this.key(id, daily, ops))) {
      db.add(this.key(id, bal, ops), this.dailyAmount);
      db.set(this.key(id, daily, ops), (Date.now() as unknown) as string);

      return true;
    }

    return false;
  }

  public weekly(id: string, ops: EcoOptions = {}): boolean {
    if (!db.fetch(this.key(id, weekly, ops))) {
      db.add(this.key(id, bal, ops), this.weeklyAmount);
      db.set(this.key(id, weekly, ops), (Date.now() as unknown) as string);

      return true;
    }

    return false;
  }

  public monthly(id: string, ops: EcoOptions = {}): boolean {
    if (!db.fetch(this.key(id, monthly, ops))) {
      db.add(this.key(id, bal, ops), this.monthlyAmount);
      db.set(this.key(id, monthly, ops), (Date.now() as unknown) as string);

      return true;
    }

    return false;
  }

  public cooldown(
    id: string,
    type: CooldownType = daily,
    ops: EcoOptions = {}
  ): string {
    const cooldown: number = cooldowns.get(type.charAt(0))!;
    const duration = db.get(this.key(id, type, ops));

    return ms(duration ? cooldown - (Date.now() - duration) : 0, {
      long: true,
    });
  }

  public reset(
    id: string,
    type: CooldownType = daily,
    ops: EcoOptions = {}
  ): boolean {
    if (!db.has(this.key(id, type, ops))) return false;

    db.set(this.key(id, type, ops), null);
    return true;
  }

  public transfer(
    id_from: string,
    id_to: string,
    amount: number,
    ops: EcoOptions = {}
  ): boolean {
    if (amount < 0) throw new Error(`"${amount}" should be a positive number`);
    if (this.balance(id_from, ops) < amount)
      throw new Error(
        `"${id_from}" does not have enough to transfer "${amount}"`
      );

    this.add(id_to, amount, ops);
    this.subtract(id_from, amount, ops);

    return true;
  }

  public pay(
    id_from: string,
    id_to: string,
    amount: number,
    ops: EcoOptions = {}
  ): boolean {
    return this.transfer(id_from, id_to, amount, ops);
  }

  public delete(id: string, ops: EcoOptions = {}): boolean {
    return db.delete(this.key(id, "bal", ops));
  }

  public clear(id: string, ops: EcoOptions = {}): boolean {
    return this.delete(id, ops);
  }

  public leaderboard(
    limit: number = 10,
    reverse: boolean = false,
    ops: EcoOptions = {}
  ): { id: string; balance: string }[] {
    const data = db
      .all()
      .filter((c) =>
        c.ID.startsWith(bal) && ops.guild
          ? c.ID.split("_")[1] === ops.guild
          : true
      );

    data.length = limit;
    data.sort((a, b) => (reverse ? a.data - b.data : b.data - a.data));

    const res: { id: string; balance: string }[] = [];
    data.forEach((k) => {
      res.push({
        id: k.ID.split("_")[ops.guild ? 2 : 1],
        balance: JSON.parse(k.data),
      });
    });

    return res;
  }
}
