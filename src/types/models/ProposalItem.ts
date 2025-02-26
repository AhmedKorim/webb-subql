// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';



import {
    ProposalType,
} from '../enums'


export type ProposalItemProps = Omit<ProposalItem, NonNullable<FunctionPropertyNames<ProposalItem>>| '_name'>;

export class ProposalItem implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public nonce: number;

    public chainId?: bigint;

    public type: ProposalType;

    public status: string;

    public data: string;

    public signature?: string;

    public removed?: boolean;

    public blockNumber: number;

    public blockId: string;


    get _name(): string {
        return 'ProposalItem';
    }

    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save ProposalItem entity without an ID");
        await store.set('ProposalItem', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove ProposalItem entity without an ID");
        await store.remove('ProposalItem', id.toString());
    }

    static async get(id:string): Promise<ProposalItem | undefined>{
        assert((id !== null && id !== undefined), "Cannot get ProposalItem entity without an ID");
        const record = await store.get('ProposalItem', id.toString());
        if (record){
            return this.create(record as ProposalItemProps);
        }else{
            return;
        }
    }


    static async getByStatus(status: string): Promise<ProposalItem[] | undefined>{
      
      const records = await store.getByField('ProposalItem', 'status', status);
      return records.map(record => this.create(record as ProposalItemProps));
      
    }

    static async getByBlockId(blockId: string): Promise<ProposalItem[] | undefined>{
      
      const records = await store.getByField('ProposalItem', 'blockId', blockId);
      return records.map(record => this.create(record as ProposalItemProps));
      
    }


    static create(record: ProposalItemProps): ProposalItem {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
