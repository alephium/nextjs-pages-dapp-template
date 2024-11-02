import React from 'react'
import styles from '@/styles/Home.module.css'
import { TokenDapp } from '@/components/TokenDapp'
import { AlephiumConnectButton, useWallet } from '@alephium/web3-react'
import { tokenFaucetConfig } from '@/services/utils'

export default function Home() {
  const { connectionStatus } = useWallet()

  return (
    <>
      <div className={styles.container}>
        <AlephiumConnectButton />

        {connectionStatus === 'connected' && (
          <TokenDapp config={tokenFaucetConfig} />
        )}
      </div>
    </>
  )
}
