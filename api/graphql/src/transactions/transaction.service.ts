import { Injectable } from '@nestjs/common';
import {
  BridgeSide,
  DepositTx,
  TransactionFilterInput,
  WithdrawTx,
  TransferTx,
} from '../../gql/graphql';
import { BridgeService } from '../bridge/bridge.service';
import { Subgraph, VAnchorService } from '../subgraph/v-anchor.service';
import {
  DepositTXesListingQueryVariables,
  DepositTxFragmentFragment,
  TransferTXesListingQueryVariables,
  TransferTxFragmentFragment,
  WithdrawTXesListingQueryVariables,
  WithdrawTxFragmentFragment,
} from '../generated/graphql';
import { mapTokenFragment } from '../helpers';
import { NetworksService } from '../subgraph/networks.service';

export type RawDepositTx = Omit<DepositTx, 'bridgeSide'> & {
  vAnchorId: string;
  networkName: string;
};

export type RawWithdrawTx = Omit<WithdrawTx, 'bridgeSide'> & {
  vAnchorId: string;
  networkName: string;
};

export type RawTransferTx = Omit<TransferTx, 'bridgeSide'> & {
  vAnchorId: string;
  networkName: string;
};
interface RawTx {
  vAnchorId: string;
  networkName: string;

  // typedChainId:string,
  // chainId:number
}

@Injectable()
export class TransactionService {
  constructor(
    private readonly vAnchorService: VAnchorService,
    private readonly bridgeService: BridgeService,
    private readonly networkService: NetworksService,
  ) {}

  private mapWithdrawTx(
    tx: WithdrawTxFragmentFragment,
    networkName: string,
  ): RawWithdrawTx {
    return {
      id: tx.id,
      value: tx.value,
      beneficiary: tx.beneficiary,
      isUnwrapAndWithdraw: tx.isUnwrapAndWithdraw,
      unWrappingFee: String(tx.unWrappingFee),
      RelayerFee: String(tx.RelayerFee),
      fullFee: String(tx.fullFee),
      gasUsed: String(tx.gasUsed),
      finalValue: String(tx.finalValue),
      blockTimestamp: String(tx.blockTimestamp),
      transactionHash: String(tx.transactionHash),
      wrappedToken: mapTokenFragment(tx.wrappedToken),
      vAnchorId: tx.vAnchor.id,
      blockNumber: String(tx.blockNumber),
      networkName,
    };
  }

  private mapDepositTx(
    tx: DepositTxFragmentFragment,
    networkName: string,
  ): RawDepositTx {
    return {
      id: tx.id,
      depositor: tx.depositor,
      value: tx.value,
      isWrapAndDeposit: tx.isWrapAndDeposit,
      wrappingFee: String(tx.wrappingFee),
      RelayerFee: String(tx.RelayerFee),
      fullFee: String(tx.fullFee),
      gasUsed: String(tx.gasUsed),
      finalValue: String(tx.finalValue),
      blockTimestamp: String(tx.blockTimestamp),
      transactionHash: String(tx.transactionHash),
      wrappedToken: mapTokenFragment(tx.wrappedToken),
      vAnchorId: tx.vAnchor.id,
      blockNumber: String(tx.blockNumber),
      networkName,
    };
  }

  private mapTransferTx(
    tx: TransferTxFragmentFragment,
    networkName: string,
  ): RawTransferTx {
    return {
      id: tx.id,
      vAnchorId: tx.vAnchor.id,

      blockTimestamp: String(tx.blockTimestamp),
      transactionHash: String(tx.transactionHash),
      blockNumber: String(tx.blockNumber),
      networkName,
    };
  }

  public async fetchTransferTransactions(
    filterInput?: TransactionFilterInput,
  ): Promise<RawTransferTx[]> {
    const transactions = [];
    const graphs = this.filterInputIntoSubgraph(filterInput);
    const bridgeSet = filterInput?.bridges ?? [];
    const queryVariables: TransferTXesListingQueryVariables | undefined =
      bridgeSet.length > 0
        ? {
            where: {
              vAnchor_in: bridgeSet,
            },
          }
        : undefined;

    for (const subgraph of graphs) {
      const rawTXs = await this.vAnchorService.fetchTransferTransactions(
        subgraph,
        queryVariables,
      );

      const mappedTxs = rawTXs.transferTxes.map(
        (tx): RawTransferTx => this.mapWithdrawTx(tx, subgraph.network),
      );
      transactions.push(...mappedTxs);
    }
    return transactions;
  }
  public async fetchWithdrawTransactions(
    filterInput?: TransactionFilterInput,
  ): Promise<RawWithdrawTx[]> {
    const graphs = this.filterInputIntoSubgraph(filterInput);
    const bridgeSet = filterInput?.bridges ?? [];
    const transactions = [];
    const queryVariables: WithdrawTXesListingQueryVariables | undefined =
      bridgeSet.length > 0
        ? {
            where: {
              vAnchor_in: bridgeSet,
            },
          }
        : undefined;
    for (const subgraph of graphs) {
      const rawTXs = await this.vAnchorService.fetchWithdrawTransactions(
        subgraph,
        queryVariables,
      );

      const mappedTxs = rawTXs.withdrawTxes.map(
        (tx): RawWithdrawTx => this.mapWithdrawTx(tx, subgraph.network),
      );
      transactions.push(...mappedTxs);
    }
    return transactions;
  }

  private filterInputIntoSubgraph(
    filterInput?: TransactionFilterInput,
  ): Subgraph[] {
    const networks = filterInput?.networks ?? [];
    return networks.length === 0
      ? this.networkService.subgraphs
      : networks.map((network) =>
          this.networkService.getSubgraphConfig(network),
        );
  }

  public async fetchDepositTransactions(
    filterInput?: TransactionFilterInput,
  ): Promise<RawDepositTx[]> {
    const bridgeSet = filterInput?.bridges ?? [];

    const graphs = this.filterInputIntoSubgraph(filterInput);

    const queryVariables: DepositTXesListingQueryVariables | undefined =
      bridgeSet.length > 0
        ? {
            where: {
              vAnchor_in: bridgeSet,
            },
          }
        : undefined;

    const transactions = [];
    for (const subgraph of graphs) {
      const rawTXs = await this.vAnchorService.fetchDepositTransactions(
        subgraph,
        queryVariables,
      );

      const mappedTransactions = rawTXs.depositTxes.map(
        (tx): RawDepositTx => this.mapDepositTx(tx, subgraph.network),
      );
      transactions.push(...mappedTransactions);
    }
    return transactions;
  }

  public async fetchBridgeOfTransaction<T extends RawTx>(
    rawTransaction: T,
  ): Promise<BridgeSide> {
    const subgraph = this.networkService.getSubgraphConfig(
      rawTransaction.networkName,
    );
    return this.bridgeService.fetchBridgeSide(
      subgraph,
      rawTransaction.vAnchorId,
    );
  }
}
