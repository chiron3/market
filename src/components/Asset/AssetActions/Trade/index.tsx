import React, { ReactElement, useEffect, useState } from 'react'
import FormTrade from './FormTrade'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'

import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'
import { Datatoken } from '@oceanprotocol/lib'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

export default function Trade(): ReactElement {
  const { accountId, balance, web3 } = useWeb3()
  const { isAssetNetwork } = useAsset()
  const [tokenBalance, setTokenBalance] = useState<PoolBalance>()
  const { price, ddo } = useAsset()
  const [maxDt, setMaxDt] = useState('0')
  const [maxOcean, setMaxOcean] = useState('0')

  // Get datatoken balance, and combine with OCEAN balance from hooks into one object
  useEffect(() => {
    if (
      !web3 ||
      !accountId ||
      !isAssetNetwork ||
      !balance?.ocean ||
      !accountId ||
      !ddo?.services[0].datatokenAddress
    )
      return

    async function getTokenBalance() {
      const datatokenInstance = new Datatoken(web3)
      const dtBalance = await datatokenInstance.balance(
        ddo.services[0].datatokenAddress,
        accountId
      )
      setTokenBalance({
        ocean: new Decimal(balance.ocean).toString(),
        datatoken: new Decimal(dtBalance).toString()
      })
    }
    getTokenBalance()
  }, [web3, balance.ocean, accountId, ddo, isAssetNetwork])

  // Get maximum amount for either OCEAN or datatoken
  useEffect(() => {
    if (!isAssetNetwork || !price || price.value === 0) return

    async function getMaximum() {
      // const maxTokensInPool = await ocean.pool.getDTMaxBuyQuantity(
      //   price.address
      // )
      // setMaxDt(
      //   isValidNumber(maxTokensInPool)
      //     ? new Decimal(maxTokensInPool).toString()
      //     : '0'
      // )
      // const maxOceanInPool = await ocean.pool.getOceanMaxBuyQuantity(
      //   price.address
      // )
      // setMaxOcean(
      //   isValidNumber(maxOceanInPool)
      //     ? new Decimal(maxOceanInPool).toString()
      //     : '0'
      // )
    }
    getMaximum()
  }, [isAssetNetwork, balance.ocean, price])

  return (
    <FormTrade
      ddo={ddo}
      price={price}
      balance={tokenBalance}
      maxDt={maxDt}
      maxBaseToken={maxOcean}
    />
  )
}
