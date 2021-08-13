import React, { useState } from 'react'

interface AddressesProps {
    ethAddress?: string
    contractAddress?: string
}

export function Addresses({ ethAddress, contractAddress }: AddressesProps) {
    const [polyjuiceAddress, setPolyjuiceAddress] = useState<string | undefined>()
    const [l2Balance, setL2Balance] = useState<bigint>()

    return (
        <div>
            Your ETH address: <b>{ethAddress}</b>
            <br />
            Your Polyjuice address: <b>{polyjuiceAddress || ' - '}</b>
            <br />
            Nervos Layer 2 balance:{' '}
            <b>{l2Balance ? `${(l2Balance / 10n ** 8n).toString()} CKB` : ' - '}</b>
            <br />
            Contract address: <b>{contractAddress || '-'}</b> <br />
        </div>
    )
}
