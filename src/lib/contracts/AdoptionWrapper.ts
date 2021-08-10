import Web3 from 'web3';
// @ts-ignore
import * as AdoptionJSON from '../../../build/contracts/Adoption.json';
import { Adoption } from '../../types/Adoption';

const DEFAULT_SEND_OPTIONS = {
    gas: 6000000
};

export class AdoptionWrapper {
    web3: Web3;

    contract: Adoption;

    address: string;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.contract = new web3.eth.Contract(AdoptionJSON.abi as any) as any;
    }

    get isDeployed() {
        return Boolean(this.address);
    }

    async getAdopters() {
        const data = await this.contract.methods.getAdopters().call();
        return data
    }

    async adopt(petId: number, fromAddress: string) {
        const returnedId = await this.contract.methods.adopt(petId).send({...DEFAULT_SEND_OPTIONS, from: fromAddress })
        return returnedId
    }

    async abandon(petId: number, fromAddress: string) {
        const returnedId = await this.contract.methods.abandon(petId).send({ ...DEFAULT_SEND_OPTIONS, from: fromAddress })
        return returnedId
    }

    async deploy(fromAddress: string) {
        const contract = await (this.contract
            .deploy({
                data: AdoptionJSON.bytecode,
                arguments: []
            })
            .send({
                ...DEFAULT_SEND_OPTIONS,
                from: fromAddress,
                to: '0x0000000000000000000000000000000000000000'
            } as any) as any);

        this.useDeployed(contract.contractAddress);
        return contract.transactionHash;
    }


    useDeployed(contractAddress: string) {
        this.address = contractAddress;
        this.contract.options.address = contractAddress;
    }
}
