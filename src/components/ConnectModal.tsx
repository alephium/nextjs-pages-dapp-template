import React, { useCallback, useEffect, useState } from 'react';
import { useConnect, useConnectSettingContext } from '@alephium/web3-react';
import { Account } from '@alephium/web3';
import { Button, Modal, Box } from '@mui/material';

export function ConnectModal() {
  const [opened, setOpened] = useState(false)
  const [connectClicked, setConnectClicked] = useState(false)
  const context = useConnectSettingContext()

  const [account, setAccount] = useState<Account | undefined>(undefined)

  const { connect, disconnect } = useConnect()

  useEffect(() => {
    if (connectClicked && opened) {
      setConnectClicked(false)
      connect().then((account) => {
        setAccount(account)
        setOpened(false)
      })
    }
  }, [connectClicked, opened, setConnectClicked, connect, setOpened, setAccount])

  const onConnect = useCallback((id: 'injected' | 'walletConnect') => {
    context.setConnectorId(id)
    setConnectClicked(true)
  }, [context, setConnectClicked])

  const onDisconnect = useCallback(async () => {
    await disconnect()
    setAccount(undefined)
  }, [disconnect, setAccount])

  return (
    <div>
      {account !== undefined ? (
        <div>
          <Button variant="contained" onClick={onDisconnect}>Disconnect</Button>
        </div>
      ) : (
        <div>
          <Button variant="contained" onClick={() => setOpened(true)}>Connect</Button>
          <Modal
            open={opened}
            onClose={() => setOpened(false)}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
              <Button variant="contained" onClick={() => onConnect('injected')}>Extension Wallet</Button>
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => onConnect('walletConnect')}>Wallet Connect</Button>
            </Box>
          </Modal>
        </div>
      )}
    </div>
  );
}
