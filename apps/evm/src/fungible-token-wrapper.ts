import { log } from '@graphprotocol/graph-ts';
import { Transfer as TransferEvent } from '../generated/FungibleTokenWrapper/FungibleTokenWrapper';
import { DepositTx, Transfer, WithdrawTx } from '../generated/schema';
import { isVAnchorAddress } from './utils/consts';

function newTransfer(event: TransferEvent): void {
  let entity = new Transfer(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.contractAddress = event.address;
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

enum TransactionType {
  Deposit,
  Withdraw,
  Transfer,
}

function getTransactionType(event: TransferEvent): TransactionType {
  const senderAddress = event.params.from;
  const receiverAddress = event.params.to;

  // Check for Deposit
  if (isVAnchorAddress(receiverAddress)) {
    return TransactionType.Deposit;
  }
  if (isVAnchorAddress(senderAddress)) {
    return TransactionType.Withdraw;
  }

  return TransactionType.Transfer;
}

function getTransactionTypeMessage(transactionType: TransactionType): string {
  switch (transactionType) {
    case TransactionType.Deposit:
      return 'deposit';
    case TransactionType.Withdraw:
      return 'withdraw';
    case TransactionType.Transfer:
      return 'transfer';
    default:
      return 'transfer+def';
  }
}

function handleDepositTx(event: TransferEvent): void {
  let entity = new DepositTx(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.fungibleTokenWrapper = event.address;
  entity.depositor = event.params.from;
  entity.value = event.params.value;
  entity.vAnchorAddress = event.params.to;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();
}

function handleWithdrawTx(event: TransferEvent): void {
  let entity = new WithdrawTx(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.fungibleTokenWrapper = event.address;
  entity.beneficiary = event.params.to;
  entity.vAnchorAddress = event.params.from;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();
}

export function handleTransfer(event: TransferEvent): void {
  const eventType = getTransactionType(event);
  log.debug(`Event type for vAnchor {}`, [getTransactionTypeMessage(eventType)]);
  switch (eventType) {
    case TransactionType.Deposit:
      handleDepositTx(event);
      break;
    case TransactionType.Withdraw:
      handleWithdrawTx(event);
      break;
    case TransactionType.Transfer:
      break;
  }
}
