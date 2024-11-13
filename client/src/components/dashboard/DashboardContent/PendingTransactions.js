import React from 'react';
import { TransactionHistory } from './TransactionHistory';

export function PendingTransactions() {
  return <TransactionHistory defaultFilter="pending" />;
} 