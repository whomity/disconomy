import ms from "ms";
import { join } from "path";
import * as db from "quick.db";
import { DisconomyOptions } from "../interfaces/DisconomyOptions";
import { EcoOptions } from "../interfaces/EcoOptions";
import { CooldownType } from "../types/CooldownType";

/**
 * Represents our basic economy methods
 */
export class Disconomy {
    protected version: string;
    private dailyAmount: number;
    private weeklyAmount: number;
    private monthlyAmount: number;
    public constructor(options: DisconomyOptions = {}) {
        /**
         * Amount to give per day
         * @type {Number}
         * @default 150
         */
        this.dailyAmount = options.dailyAmount ?? 150;

        /**
         * Amount to give per week
         * @type {Number}
         * @default 500
         */
        this.weeklyAmount = options.weeklyAmount ?? 500;

        /**
         * Amount to give per month
         * @type {Number}
         * @default 150
         */
        this.monthlyAmount = options.monthlyAmount ?? 1500;

        /**
         * Current version of disconomy
         * @type {string}
         */
        this.version = require(join(process.cwd(), 'package.json')).version;
    }

    /**
     * A simple method to create keys and simplify code
     * @param id ID of the user
     * @param type Type of key to build
     * @param ops Options to factor when building a key
     * @returns {string} Key that was built
     */
    protected buildKey(id: string, type: string, ops: EcoOptions = {}): string {
        let key = '';
        switch (type) {
            case 'bal':
            case 'balance':
                key = ops.guild ? `bal_${ops.guild}_${id}` : `bal_${id}`;
                break;
            case 'daily':
            case 'weekly':
            case 'monthly':
                key = ops.guild ? `cooldowns_${ops.guild}_${id}.${type}` : `cooldowns_${id}.${type}`;
                break;
        }

        return key;
    }

    /**
     * Add an amount to the user
     * @param id ID of the user
     * @param amount Amount to add
     * @param ops Options to factor when adding amount
     * @returns {Number} New balance of the user
     */
    add(id: string, amount: number, ops: EcoOptions = {}): number {
        if (!/^[0-9]{16,19}$/.test(id)) throw new Error(`User id "${id}" does not match user-id regex.`);
        return db.add(this.buildKey(id, 'bal', ops), amount);
    }

    /**
     * Retrieves balance of a user
     * @param id ID of the user
     * @param ops Options to factor when retrieving balance
     * @returns {Number} Balance of the user
     */
    balance(id: string, ops: EcoOptions = {}): number {
        if (!/^[0-9]{16,19}$/.test(id)) throw new Error(`User id "${id}" does not match user-id regex.`);

        const key = this.buildKey(id, 'bal', ops);
        if (!db.has(key)) this.set(key, 0, ops);

        return db.fetch(key);
    }

    /**
     * Set a user's balance to the given amount
     * @param id ID of the user
     * @param amount Amount to set
     * @param ops Options to factor when setting balance
     */
    set(id: string, amount: number, ops: EcoOptions = {}): number {
        return db.set(this.buildKey(id, 'bal', ops), amount as unknown as string);
    }

    /**
     * Subtract an amount from a user's balance
     * @param id ID of the user
     * @param amount Amount to subtract
     * @param ops Options to factor when subtracting balance
     * @returns {Number} New balance of the user
     */
    subtract(id: string, amount: number, ops: EcoOptions = {}): number {
        if (!/^[0-9]{16,19}$/.test(id)) throw new Error(`User id "${id}" does not match user-id regex.`);
        return db.subtract(this.buildKey(id, 'bal', ops), amount);
    }

    /**
     * An alias for Controller.subtract()
     * @param id ID of the user
     * @param amount Amount to deduct
     * @param ops Options to factor when deducting amount from balance
     * @returns {Number} New balance of the user
     */
    deduct(id: string, amount: number, ops: EcoOptions = {}) {
        return this.subtract(id, amount, ops);
    }

    /**
     * Adds the daily amount to the user
     * @param id ID of the user
     * @param ops Options to factor when adding daily amount
     * @returns {Boolean} Whether the user received their daily amount
     */
    daily(id: string, ops: EcoOptions = {}): Boolean {
        if (!/^[0-9]{16,19}$/.test(id)) throw new Error(`User id "${id}" does not match user-id regex.`);

        const cooldown = 8.64e+7;
        const lastDaily = db.fetch(this.buildKey(id, 'daily', ops));

        if (lastDaily && cooldown - (Date.now() - lastDaily) > 0) return false;

        db.add(this.buildKey(id, 'bal', ops), this.dailyAmount);
        db.set(this.buildKey(id, 'daily', ops), Date.now() as unknown as string);

        return true;
    }

    /**
     * Adds the weekly amount to a user
     * @param id ID of the user
     * @param ops Options to factor when adding weekly amount
     * @returns {Boolean} Whether the user received their weekly amount
     */
    weekly(id: string, ops: EcoOptions = {}): Boolean {
        if (!/^[0-9]{16,19}$/.test(id)) throw new Error(`User id "${id}" does not match user-id regex.`);

        const cooldown = 6.048e+8;
        const lastWeekly = db.fetch(this.buildKey(id, 'weekly', ops));

        if (lastWeekly && cooldown - (Date.now() - lastWeekly) > 0) return false;

        db.add(this.buildKey(id, 'bal', ops), this.weeklyAmount);
        db.set(this.buildKey(id, 'weekly', ops), Date.now() as unknown as string);

        return true;
    }

    /**
     * Adds the monthly amount to a user
     * @param id ID of the user
     * @param ops Options to factor when adding monthly amount
     * @returns {Boolean} Whether the user received their monthly amount
     */
    monthly(id: string, ops: EcoOptions = {}): Boolean {
        if (!/^[0-9]{16,19}$/.test(id)) throw new Error(`User id "${id}" does not match user-id regex.`);

        const cooldown = 2.592e+9;
        const lastMonthly = db.fetch(this.buildKey(id, 'monthly', ops));

        if (lastMonthly && cooldown - (Date.now() - lastMonthly) > 0) return false;

        db.add(this.buildKey(id, 'bal', ops), this.monthlyAmount);
        db.set(this.buildKey(id, 'monthly', ops), Date.now() as unknown as string);

        return true;
    }

    /**
     * Gets the formatted string of a type of cooldown
     * @param id ID of the user
     * @param type Type of cooldown
     * @param ops Options to factor when getting the cooldown
     * @returns {string|false} If returned a string, then a cooldown exists. Otherwise, there is none.
     */
    getCooldown(id: string, type: CooldownType = 'daily', ops: EcoOptions = {}): string | false {
        let cooldown: number = 8.64e+7;
        switch (type.toLowerCase()) {
            case 'weekly':
                cooldown = 6.048e+8;
                break;
            case 'monthly':
                cooldown = 2.592e+9;
                break;
        }

        const duration = db.get(this.buildKey(id, type, ops));
        if (duration) return ms(cooldown - (Date.now() - duration), { long: true });

        return false;
    }

    /**
     * Reset a user's cooldown for that type
     * @param id ID of the user
     * @param type Type of cooldown
     * @param ops Options to factor when resetting cooldown
     * @returns {boolean} Whether the cooldown was reset successfully
     */
    resetCooldown(id: string, type: CooldownType = 'daily', ops: EcoOptions = {}): boolean {
        if (!/^[0-9]{16,19}$/.test(id)) throw new Error(`User id "${id}" does not match user-id regex.`);

        if (!db.has(this.buildKey(id, type, ops))) return false;

        db.set(this.buildKey(id, type, ops), null as unknown as string);
        return true;
    }

    /**
     * Transfers an amount from one user to another
     * @param id_from ID to take balance from
     * @param id_to ID to transfer balance to
     * @param amount Amount to transfer
     * @param ops Options to factor when transferring the amount
     * @returns {boolean} Whether the transfer was successful
     */
    transfer(id_from: string, id_to: string, amount: number, ops: EcoOptions = {}): boolean {
        if (!/^[0-9]{16,19}$/.test(id_from)) throw new Error(`User id "${id_from}" does not match user-id regex.`);
        if (!/^[0-9]{16,19}$/.test(id_to)) throw new Error(`User id "${id_to} does not match user-id regex.`);

        if (amount < 0) throw new Error(`"${amount}" should be a positive number`);
        if (this.balance(id_from, ops) < amount) throw new Error(`"${id_from}" does not have enough to transfer "${amount}"`);
        
        this.add(this.buildKey(id_to, 'bal', ops), amount);
        this.subtract(this.buildKey(id_from, 'bal', ops), amount);

        return true;
    }

    /**
     * Serves as an alias for Disconomy.transfer()
     * @param id_from ID to take balance from
     * @param id_to ID to transfer balance to
     * @param amount Amount to transfer
     * @param ops Options to factor when transferring the amount
     * @returns {boolean} Whether the transfer was successful
     */
    pay(id_from: string, id_to: string, amount: number, ops: EcoOptions = {}): boolean {
        return this.transfer(id_from, id_to, amount, ops);
    }

    /**
     * Creates a leaderboard, sorted by sorted user balances
     * @param limit Max number of users on the leaderboard
     * @param reverse If set to true, goes in least to greatest and vice-versa
     * @param ops Options to factor when creating the leaderboard
     * @returns {object[]} Leaderboard sorted by user balances
     */
    buildLeaderboard(limit: number = 10, reverse: boolean = false, ops: EcoOptions = {}): object[] {
        const data = db.all().filter(c =>
            ops.guild ? c.ID.startsWith('bal') && c.ID.split('_')[1] === ops.guild : 
            c.ID.startsWith('bal'));

        data.length = limit;
        data.sort((a, b) => reverse ? a.data - b.data : b.data - a.data);

        const resp: object[] = [];
        data.forEach(k => {
            if (!k) return;
            resp.push({
                id: k.ID.split('_')[ops.guild ? 2 : 1],
                balance: JSON.parse(k.data)
            });
        });

        return resp;
    }
}