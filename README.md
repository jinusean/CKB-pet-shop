# Blockchain workshop

https://user-images.githubusercontent.com/6874981/129195934-4b6c5ded-f812-4949-b47f-5e9bc388acd7.mp4

This project makes use of `@truffle/hdwallet-provider` & `truffle` for contract migrations.

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
