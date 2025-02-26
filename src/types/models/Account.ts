// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export type AccountProps = Omit<Account, NonNullable<FunctionPropertyNames<Account>>| '_name'>;

export class Account implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public creatorId?: string;

    public createdAt?: string;

    public createAtBlockId?: string;

    public display?: string;

    public legal?: string;

    public web?: string;

    public riot?: string;

    public email?: string;

    public pgpFingerprint?: string;

    public image?: string;

    public twitter?: string;

    public countryCodeId?: string;


    get _name(): string {
        return 'Account';
    }

    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Account entity without an ID");
        await store.set('Account', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Account entity without an ID");
        await store.remove('Account', id.toString());
    }

    static async get(id:string): Promise<Account | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Account entity without an ID");
        const record = await store.get('Account', id.toString());
        if (record){
            return this.create(record as AccountProps);
        }else{
            return;
        }
    }


    static async getByCreatorId(creatorId: string): Promise<Account[] | undefined>{
      
      const records = await store.getByField('Account', 'creatorId', creatorId);
      return records.map(record => this.create(record as AccountProps));
      
    }

    static async getByCreateAtBlockId(createAtBlockId: string): Promise<Account[] | undefined>{
      
      const records = await store.getByField('Account', 'createAtBlockId', createAtBlockId);
      return records.map(record => this.create(record as AccountProps));
      
    }

    static async getByCountryCodeId(countryCodeId: string): Promise<Account[] | undefined>{
      
      const records = await store.getByField('Account', 'countryCodeId', countryCodeId);
      return records.map(record => this.create(record as AccountProps));
      
    }


    static create(record: AccountProps): Account {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
