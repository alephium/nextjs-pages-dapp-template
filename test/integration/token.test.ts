import { web3, Project, DUST_AMOUNT, groupOfAddress } from '@alephium/web3'
import { testNodeWallet } from '@alephium/web3-test'
import { deployToDevnet } from '@alephium/cli'
import { TokenFaucetInstance, Withdraw } from '../../artifacts/ts'

describe('integration tests', () => {
  beforeAll(async () => {
    web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
    await Project.build()
  })

  it('should withdraw on devnet', async () => {
    const signer = await testNodeWallet()
    const allDeployments = await deployToDevnet()

    // Test with all of the addresses of the wallet
    for (const account of await signer.getAccounts()) {
      const testAddress = account.address
      await signer.setSelectedAccount(testAddress)
      const testGroup = account.group

      const deployments = allDeployments.find((d) => groupOfAddress(d.deployerAddress) === testGroup)
      if (deployments === undefined) {
        console.log(`The contract is not deployed on group ${account.group}`)
        continue
      }
      const deployed = deployments.contracts.TokenFaucet
      expect(deployed.contractInstance.groupIndex).toEqual(testGroup)

      const faucet = deployed.contractInstance as TokenFaucetInstance
      const initialState = await faucet.fetchState()
      const initialBalance = initialState.fields.balance

      // Call `withdraw` function 10 times
      for (let i = 0; i < 10; i++) {
        await Withdraw.execute(signer, {
          initialFields: { token: faucet.contractId, amount: 1n },
          attoAlphAmount: DUST_AMOUNT * 2n
        })

        const newState = await faucet.fetchState()
        const newBalance = newState.fields.balance
        expect(newBalance).toEqual(initialBalance - BigInt(i) - 1n)
      }
    }
  }, 20000)
})

