/*
    Copyright 2020 The caver-js Authors
    This file is part of the caver-js library.

    The caver-js library is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    The caver-js library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with the caver-js. If not, see <http://www.gnu.org/licenses/>.
*/

const _ = require('lodash')
const BigNumber = require('bignumber.js')

const Contract = require('../caver-klay-contract')
const { validateTokenInfoForDeploy, determineSendParams, kip7JsonInterface, kip7ByteCode } = require('./kctHelper')
const { isAddress } = require('../../caver-utils')

class KIP7 extends Contract {
    static deploy(tokenInfo, deployer) {
        validateTokenInfoForDeploy(tokenInfo)

        const { name, symbol, decimals, initialSupply } = tokenInfo
        const kip7 = new KIP7()

        return kip7
            .deploy({
                data: kip7ByteCode,
                arguments: [name, symbol, decimals, initialSupply],
            })
            .send({ from: deployer, gas: 3500000, value: 0 })
    }

    constructor(tokenAddress, abi = kip7JsonInterface) {
        if (tokenAddress) {
            if (_.isString(tokenAddress)) {
                if (!isAddress(tokenAddress)) throw new Error(`Invalid token address ${tokenAddress}`)
            } else {
                abi = tokenAddress
                tokenAddress = undefined
            }
        }

        super(abi, tokenAddress)
    }

    clone(tokenAddress = this.options.address) {
        return new this.constructor(tokenAddress, this.options.jsonInterface)
    }

    async name() {
        const name = await this.methods.name().call()
        return name
    }

    async symbol() {
        const symbol = await this.methods.symbol().call()
        return symbol
    }

    async decimals() {
        const decimals = await this.methods.decimals().call()
        return Number(decimals)
    }

    async totalSupply() {
        const totalSupply = await this.methods.totalSupply().call()
        return new BigNumber(totalSupply)
    }

    async balanceOf(account) {
        const balance = await this.methods.balanceOf(account).call()
        return new BigNumber(balance)
    }

    async allowance(owner, spender) {
        const allowance = await this.methods.allowance(owner, spender).call()
        return new BigNumber(allowance)
    }

    async isMinter(account) {
        const isMinter = await this.methods.isMinter(account).call()
        return isMinter
    }

    async isPauser(account) {
        const isPauser = await this.methods.isPauser(account).call()
        return isPauser
    }

    async paused() {
        const isPaused = await this.methods.paused().call()
        return isPaused
    }

    async approve(spender, amount, sendParam = {}) {
        const executableObj = this.methods.approve(spender, amount)
        sendParam = await determineSendParams(executableObj, sendParam, this.options.from)

        return executableObj.send(sendParam)
    }

    async transfer(recipient, amount, sendParam = {}) {
        const executableObj = this.methods.transfer(recipient, amount)
        sendParam = await determineSendParams(executableObj, sendParam, this.options.from)

        return executableObj.send(sendParam)
    }

    async transferFrom(sender, recipient, amount, sendParam = {}) {
        const executableObj = this.methods.transferFrom(sender, recipient, amount)
        sendParam = await determineSendParams(executableObj, sendParam, this.options.from)

        return executableObj.send(sendParam)
    }

    async mint(account, amount, sendParam = {}) {
        const executableObj = this.methods.mint(account, amount)
        sendParam = await determineSendParams(executableObj, sendParam, this.options.from)

        return executableObj.send(sendParam)
    }

    async addMinter(account, sendParam = {}) {
        const executableObj = this.methods.addMinter(account)
        sendParam = await determineSendParams(executableObj, sendParam, this.options.from)

        return executableObj.send(sendParam)
    }

    async renounceMinter(sendParam = {}) {
        const executableObj = this.methods.renounceMinter()
        sendParam = await determineSendParams(executableObj, sendParam, this.options.from)

        return executableObj.send(sendParam)
    }

    async burn(amount, sendParam = {}) {
        const executableObj = this.methods.burn(amount)
        sendParam = await determineSendParams(executableObj, sendParam, this.options.from)

        return executableObj.send(sendParam)
    }

    async burnFrom(account, amount, sendParam = {}) {
        const executableObj = this.methods.burnFrom(account, amount)
        sendParam = await determineSendParams(executableObj, sendParam, this.options.from)

        return executableObj.send(sendParam)
    }

    async addPauser(account, sendParam = {}) {
        const executableObj = this.methods.addPauser(account)
        sendParam = await determineSendParams(executableObj, sendParam, this.options.from)

        return executableObj.send(sendParam)
    }

    async pause(sendParam = {}) {
        const executableObj = this.methods.pause()
        sendParam = await determineSendParams(executableObj, sendParam, this.options.from)

        return executableObj.send(sendParam)
    }

    async unpause(sendParam = {}) {
        const executableObj = this.methods.unpause()
        sendParam = await determineSendParams(executableObj, sendParam, this.options.from)

        return executableObj.send(sendParam)
    }

    async renouncePauser(sendParam = {}) {
        const executableObj = this.methods.renouncePauser()
        sendParam = await determineSendParams(executableObj, sendParam, this.options.from)

        return executableObj.send(sendParam)
    }
}

module.exports = KIP7
