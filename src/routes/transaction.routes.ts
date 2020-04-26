import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

/**
 * A REGRAS : Não pode sacar mais do que tem de saldo Total
 * O repository: da apenas funcionalidade balanço financeiro que
 * será lógico pois a REGRA nos garante isso.
 */

const transactionsRepository = new TransactionsRepository();
interface Transaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

transactionRouter.get('/', (request, response) => {
  try {
    const transactionAll = transactionsRepository.all();

    // A regra de negoco vai esta aqui:
    const balance = transactionsRepository.getBalance();

    return response.json({ transactions: transactionAll, balance });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body;

    const createTransaction = new CreateTransactionService(
      transactionsRepository,
    );

    const transaction = createTransaction.execute({
      title,
      value,
      type,
    });

    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
