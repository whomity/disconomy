/**
 * Represents the options in which a method can use
 */
export interface EcoOptions {
    guild: string;
}

export type CooldownType = 'daily' | 'weekly' | 'monthly';

declare module 'quick.eco' {
    function set(userID: string, amount: number, ops?: EcoOptions): number;
    function add(userID: string, amount: number, ops?: EcoOptions): number
    function subtract(userID: string, amount: number, ops?: EcoOptions): number;
    function transfer(id_from: string, id_to: string, amount: number, ops?: EcoOptions): boolean;
    function balance (userID: string, ops?: EcoOptions): number;

    function leaderboard(limit?: number, reverse?: boolean, ops?: EcoOptions): Object[];

    function cooldown(userID: string, type: CooldownType = 'daily', ops?: EcoOptions): any;
    function daily(userID: string, amount: number, ops?: EcoOptions): boolean;
    function weekly(userID: string, amount: number, ops?: EcoOptions): boolean;
    function monthly(userID: string, amount: number, ops: EcoOptions): boolean;
    
    export {
        add, 
        subtract,
        transfer,
        balance,
        leaderboard,
        cooldown,
        daily,
        weekly,
        monthly,
        set
    }
}