# Blockchain workshop

This project makes use of `@truffle/hdwallet-provider` & `truffle` for contract migrations.

![Preview](https://youtu.be/Y0wJRDNO2yY)


## Install Dependencies
```
yarn
```

## Build/Deploy Contracts (migrations)
1. Create local .env file
```
cp .env.example .env` copy
```
2. Update`.env` with account address and private key. These values can be found in Metamask.

4. Run migrations
```
truffle migrate
```

## Start UI
```
yarn build && yarn ui
```