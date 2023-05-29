
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface Composition {
    token: Token;
    value: string;
    valueUSD: string;
}

export interface BridgeSide {
    id: string;
    contractAddress: string;
    chainId: number;
    typedChainId: string;
    volumeUSD: string;
    composition: Composition[];
    maxDepositAmount: string;
    minDepositAmount: string;
    averageDepositAmount: string;
    averageWithdrawAmount: string;
    token: string;
    numberOfDeposits: number;
    numberOfWithdraws: number;
}

export interface Bridge {
    id: string;
    sides: BridgeSide[];
}

export interface IQuery {
    bridges(): Bridge[] | Promise<Bridge[]>;
    bridgeSides(): BridgeSide[] | Promise<BridgeSide[]>;
}

export interface Token {
    id: string;
    address: string;
    isFungibleTokenWrapper: boolean;
    name: string;
    symbol: string;
    decimals: number;
}

export interface BrideSideDayData {
    id: string;
    date: string;
    compositions: Composition[];
    numberOfDeposits: string;
    numberOfWithdraws: string;
    numberOfTransfers: string;
    fees: string;
    volumeUSD: string;
}

export interface BrideDayData {
    id: string;
    date: string;
    compositions: Composition[];
    numberOfDeposits: string;
    numberOfWithdraws: string;
    numberOfTransfers: string;
    fees: string;
    volumeUSD: string;
}

export interface DayData {
    id: string;
    date: string;
    compositions: Composition[];
    numberOfDeposits: string;
    numberOfWithdraws: string;
    numberOfTransfers: string;
    fees: string;
    volumeUSD: string;
}

export interface DepositTx {
    id: string;
    depositor: string;
    value: string;
    isWrapAndDeposit: boolean;
    wrappingFee: string;
    RelayerFee: string;
    fullFee: string;
    gasUsed: string;
    finalValue: string;
    blockTimestamp: string;
    transactionHash: string;
    vAnchor: BridgeSide;
    wrappedToken: Token;
    blockNumber: string;
}

export interface WithdrawTx {
    id: string;
    beneficiary: string;
    value: string;
    gasUsed: string;
    isUnwrapAndWithdraw: boolean;
    unWrappingFee: string;
    RelayerFee: string;
    fullFee: string;
    finalValue: string;
    blockTimestamp: string;
    transactionHash: string;
    vAnchor: BridgeSide;
    wrappedToken: Token;
    blockNumber: string;
}

export interface TransferTx {
    id: string;
    from: string;
    fee: string;
    blockNumber: string;
    blockTimestamp: string;
    transactionHash: string;
    contractAddress: string;
}

type Nullable<T> = T | null;
