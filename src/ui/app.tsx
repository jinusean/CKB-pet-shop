/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */

import React, {useEffect, useState} from 'react';
import Web3 from 'web3';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/bootstrap.min.css'
import '../js/bootstrap.min'

import './app.scss';
import {PolyjuiceHttpProvider} from '@polyjuice-provider/web3';
import {AddressTranslator} from 'nervos-godwoken-integration';

import {AdoptionWrapper} from '../lib/contracts/AdoptionWrapper';
import {CONFIG} from '../config';
import pets from '../pets';
import {log} from "util";
import {SimpleStorageWrapper} from "../../../blockchain-workshop-godwoken-simple/src/lib/contracts/SimpleStorageWrapper";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'


async function createWeb3() {
    // Modern dapp browsers...
    if ((window as any).ethereum) {
        const godwokenRpcUrl = CONFIG.WEB3_PROVIDER_URL;
        const providerConfig = {
            rollupTypeHash: CONFIG.ROLLUP_TYPE_HASH,
            ethAccountLockCodeHash: CONFIG.ETH_ACCOUNT_LOCK_CODE_HASH,
            web3Url: godwokenRpcUrl
        };

        const provider = new PolyjuiceHttpProvider(godwokenRpcUrl, providerConfig);
        // const provider = new Web3.providers.HttpProvider('http://localhost:8545')
        const web3 = new Web3(provider || Web3.givenProvider);
        try {
            // Request account access if needed
            await (window as any).ethereum.enable();
        } catch (error) {
            console.error('Error requesting access')
            console.error(error)

            // User denied account access...
        }

        return web3;
    }

    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    return null;
}

export function App() {
    const [web3, setWeb3] = useState<Web3>(null);
    const [contract, setContract] = useState<AdoptionWrapper>();
    const [accounts, setAccounts] = useState<string[]>();
    const [adopters, setAdopters] = useState<string[]>();
    const [deployTxHash, setDeployTxHash] = useState<string | undefined>();
    const [transactionInProgress, setTransactionInProgress] = useState(false);
    const [polyjuiceAddress, setPolyjuiceAddress] = useState<string | undefined>();
    const [l2Balance, setL2Balance] = useState<bigint>();
    const [existingContractIdInputValue, setExistingContractIdInputValue] = useState<string | undefined>();
    async function fetchAdopters() {
        const _adopters = await contract.getAdopters();
        setAdopters(_adopters);
        console.log('adopters', _adopters);
    }

    async function adoptPet(pet: any) {
        await contract.adopt(pet.id, ethAccount);
        toast('Adopted pet :)');
        await fetchAdopters();
    }

    async function abandonPet(pet: any) {
        await contract.abandon(pet.id, ethAccount);
        toast('Abandoned pet :(');
        await fetchAdopters();
    }

    async function setExistingContractAddress(contractAddress: string) {
        const _contract = new AdoptionWrapper(web3);
        _contract.useDeployed(contractAddress.trim());

        setContract(_contract);
    }

    async function deployContract() {
        const _contract = new AdoptionWrapper(web3);

        try {
            setDeployTxHash(undefined);
            setTransactionInProgress(true);
            const transactionHash = await _contract.deploy(ethAccount);

            setDeployTxHash(transactionHash);
            setExistingContractAddress(_contract.address);
            toast(
                'Successfully deployed a smart-contract. You can now proceed to get or set the value in a smart contract.',
                {type: 'success'}
            );
        } catch (error) {
            console.error(error);
            toast.error(
                'There was an error sending your transaction. Please check developer console.'
            );
        } finally {
            setTransactionInProgress(false);
        }
    }

    useEffect(() => {
        if (accounts?.[0]) {
            const addressTranslator = new AddressTranslator();
            setPolyjuiceAddress(addressTranslator.ethAddressToGodwokenShortAddress(accounts?.[0]));
        } else {
            setPolyjuiceAddress(undefined);
        }
    }, [accounts?.[0]]);


    useEffect(() => {
        if (web3) {
            return;
        }

        (async () => {
            const _web3 = await createWeb3();
            setWeb3(_web3);

            const _accounts = [(window as any).ethereum.selectedAddress];
            setAccounts(_accounts);

            if (_accounts && _accounts[0]) {
                // This is using the polyjuice provider, so it is different from the eth address
                const _l2Balance = BigInt(await _web3.eth.getBalance(_accounts[0]));
                setL2Balance(_l2Balance);
            }
        })();
    }, [web3]);

    useEffect(() => {
        if (contract || !web3) {
            return
        }
        const contractAddress = '0xD5f3cA08F47B564349F8d13282c8BA2F9dB60ea9';
        setExistingContractAddress(contractAddress);
    }, [web3])

    useEffect(() => {
        if (adopters || !contract?.address) {
            return
        }

        fetchAdopters()

    }, [contract])


    const ethAccount = accounts?.[0].toLowerCase();
    // @ts-ignore
    return (
        <div>
            <div className="container">
                <h1 className="text-center">Pet Shop</h1>

                <hr/>

                <div>
                    Your ETH address: <b>{accounts?.[0]}</b>
                    <br />
                    Your Polyjuice address: <b>{polyjuiceAddress || ' - '}</b>
                    <br />
                    Nervos Layer 2 balance: <b>{l2Balance ? (l2Balance / 10n ** 8n).toString() + ' CKB' : ' - '}</b>
                    <br />
                    Deployed contract address: <b>{contract?.address || '-'}</b> <br />
                    Deploy transaction hash: <b>{deployTxHash || '-'}</b>
                    <br />

                    <div>
                        <button onClick={deployContract} disabled={!l2Balance}>
                            Deploy contract
                        </button>
                        &nbsp;or&nbsp;
                        <input
                            placeholder="Existing contract id"
                            onChange={e => setExistingContractIdInputValue(e.target.value)}
                        />
                        <button
                            disabled={!existingContractIdInputValue || !l2Balance}
                            onClick={() => setExistingContractAddress(existingContractIdInputValue)}
                        >
                            Use existing contract
                        </button>
                    </div>
                </div>

                <hr/>


                <div id="petsRow" className="row">
                    {pets.map(function (pet) {
                        return (<div key={pet.id} style={{display: null}}>
                            <div className="col-sm-6 col-md-4 col-lg-3">
                                <div className="panel panel-default panel-pet">
                                    <div className="panel-heading">
                                        <h3 className="panel-title">{pet.name}</h3>
                                    </div>
                                    <div className="panel-body">
                                        <img alt="nothing"
                                             className="img-rounded img-center"
                                             style={{width: '100%'}}
                                             src={`../../images/${pet.breed.toLowerCase().replace(/\s/g, '-')}.jpeg`}
                                             data-holder-rendered="true"/>
                                        <br/><br/>
                                        <strong>Breed</strong>: <span className="pet-breed">{pet.breed}</span><br/>
                                        <strong>Age</strong>: <span className="pet-age">{pet.age}</span><br/>
                                        <strong>Location</strong>: <span className="pet-location">{pet.location}</span><br/>
                                        {adopters?.[pet.id] === ZERO_ADDRESS &&
                                            <button className="btn btn-default" type="button"
                                                    onClick={() => adoptPet(pet)}>Adopt
                                            </button>
                                        }
                                        {adopters?.[pet.id].toLowerCase() === polyjuiceAddress &&
                                            <div>
                                                <strong>Owner:</strong> <span>{adopters?.[pet.id]}</span><br/>
                                                <button className="btn btn-warning" type="button"
                                                        onClick={() => abandonPet(pet)}>Abandon
                                                </button>
                                            </div>

                                        }

                                    </div>
                                </div>
                            </div>
                        </div>)
                    })}
                </div>
            </div>

            <ToastContainer/>
        </div>
    );
}
