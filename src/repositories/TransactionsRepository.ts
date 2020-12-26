import { response } from 'express';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface AllTransactionsResponse {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): AllTransactionsResponse {
    const responseTransactions = this.transactions;

    const responseBalance = this.getBalance();

    return { transactions: responseTransactions, balance: responseBalance };
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce<number>(
      (accumulator, currentValue) =>
        currentValue.type === 'income'
          ? accumulator + currentValue.value
          : accumulator,
      0,
    );

    const outcome = this.transactions.reduce<number>(
      (accumulator, currentValue) =>
        currentValue.type === 'outcome'
          ? accumulator + currentValue.value
          : accumulator,
      0,
    );
    const total: number = income - outcome;

    return { income, outcome, total };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
