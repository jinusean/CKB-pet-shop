import Web3 from 'web3'
import * as AdoptionJSON from '../../../build/contracts/Adoption.json'
import { Adoption } from '../../types/Adoption'

export class AdoptionWrapper {
    web3: Web3

    contract: Adoption

    constructor(web3: Web3) {
        this.web3 = web3
        this.contract = new web3.eth.Contract(
            AdoptionJSON.abi as any,
            (AdoptionJSON.networks as any)[process.env.NETWORK_ID].address
        ) as any
    }

    get address() {
        return this.contract.options.address
    }

    async getAdopters() {
        return this.contract.methods.getAdopters().call()
    }

    async adopt(petId: number, fromAddress: string) {
        return this.contract.methods.adopt(petId).send({ gas: process.env.GAS, from: fromAddress })
    }

    async abandon(petId: number, fromAddress: string) {
        return this.contract.methods
            .abandon(petId)
            .send({ gas: process.env.GAS, from: fromAddress })
    }
}
