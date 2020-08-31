declare module 'disconomy' {
    export interface EcoOptions {
        guild: string;
    }
    
    export interface DisconomyOptions {
        dailyAmount?: number;
        weeklyAmount?: number;
        monthlyAmount?: number;
    }
    
    export type CooldownType = 'daily' | 'weekly' | 'monthly';
    
    
    export class Disconomy {
        public constructor(options?: DisconomyOptions);
        protected version: string;
        public dailyAmount: number;
        public weeklyAmount: number;
        public monthlyAmount: number;
        protected buildKey(id: string, type: string, ops?: EcoOptions): string;

        public add(id: string, amount: number, ops?: EcoOptions): number;
        public balance(id: string, ops?: EcoOptions): number;
        public set(id: string, amount: number, ops?: EcoOptions): number;
        public subtract(id: string, amount: number, ops?: EcoOptions): number;
        public deduct(id: string, amount: number, ops?: EcoOptions): number;
        public daily(id: string, ops?: EcoOptions): Boolean;
        public weekly(id: string, ops?: EcoOptions): Boolean;
        public monthly(id: string, ops?: EcoOptions): Boolean;
        public getCooldown(id: string, type?: CooldownType, ops?: EcoOptions): string | false;
        public resetCooldown(id: string, type?: CooldownType, ops?: EcoOptions): boolean;
        public transfer(id_from: string, id_to: string, amount: number, ops?: EcoOptions): boolean;
        public pay(id_from: string, id_to: string, amount: number, ops?: EcoOptions): boolean;
        public buildLeaderboard(limit?: number, reverse?: boolean, ops?: EcoOptions): object[];
    }
}