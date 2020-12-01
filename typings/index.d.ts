declare module "disconomy" {
  export interface EcoOptions {
    guild: string;
  }

  export interface DisconomyOptions {
    dailyAmount?: number;
    weeklyAmount?: number;
    monthlyAmount?: number;
  }

  export type CooldownType = "daily" | "weekly" | "monthly";

  export class Disconomy {
    public version: string;
    public dailyAmount: number;
    public weeklyAmount: number;
    public monthlyAmount: number;
    public constructor(ops?: DisconomyOptions);

    private key(id: string, type: string, ops?: EcoOptions): string;

    public add(id: string, amount: number, ops?: EcoOptions): number;
    
    public balance(id: string, ops?: EcoOptions): number;
    
    public set(id: string, amount: number, ops?: EcoOptions): number;
    
    public subtract(id: string, amount: number, ops?: EcoOptions): number;
    
    public deduct(id: string, amount: number, ops?: EcoOptions): number;
    
    public daily(id: string, ops?: EcoOptions): boolean;
    
    public weekly(id: string, ops?: EcoOptions): boolean;
    
    public monthly(id: string, ops?: EcoOptions): boolean;
    
    public cooldown(id: string, type?: CooldownType, ops?: EcoOptions): string;
    
    public reset(id: string, type?: CooldownType, ops?: EcoOptions): boolean;

    public transfer(
      id_from: string,
      id_to: string,
      amount: number,
      ops?: EcoOptions
    ): boolean;

    public pay(
      id_from: string,
      id_to: string,
      amount: number,
      ops?: EcoOptions
    ): boolean;

    public delete(id: string, ops?: EcoOptions): boolean;

    public clear(id: string, ops?: EcoOptions): boolean;

    public leaderboard(
      limit?: number,
      reverse?: boolean,
      ops?: EcoOptions
    ): { id: string; balance: string }[];
  }
}
