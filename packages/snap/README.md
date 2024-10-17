# Web3 Address Book Snap

This snap can be used to resolve several naming services in the sending input field of your MetaMask wallet. 

It supports resolution of

1. IDriss
2. Farcaster names
3. Lens handles
4. Unstoppable Domains
5. ENS domains on networks other than Ethereum Mainnet

Supported formats:
1. IDriss: Registered Twitter handles `@<name>`
2. Facraster: `<name>.fc`, or `<name>.farcaster`
3. Lens: `<name>.lens`
4. UD: any registered UD
5. ENS: Any registered ENS, given it does not resolve to a contract address

## Testing

The snap comes with some basic tests, to demonstrate a happy and failing path for each resolution service. 
To test the snap, run `yarn test` in this directory. This will use
[`@metamask/snaps-jest`](https://github.com/MetaMask/snaps/tree/main/packages/snaps-jest)
to run the tests in `src/index.test.ts`.
