import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const { total } = this.transactionsRepository.getBalance();

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    if (transaction.value > total && transaction.type === 'outcome') {
      throw Error('Transaction fali');
    }

    return transaction;
  }
}

export default CreateTransactionService;
