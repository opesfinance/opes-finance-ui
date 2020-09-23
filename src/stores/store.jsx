import config from "../config";
import async from 'async';
import * as moment from 'moment';
import {
  ERROR,
  CONFIGURE,
  CONFIGURE_RETURNED,
  GET_BALANCES,
  GET_BALANCES_RETURNED,
  GET_BALANCES_PERPETUAL,
  GET_BALANCES_PERPETUAL_RETURNED,
  STAKE,
  STAKE_RETURNED,
  WITHDRAW,
  WITHDRAW_RETURNED,
  GET_REWARDS,
  GET_REWARDS_RETURNED,
  EXIT,
  EXIT_RETURNED,
  PROPOSE,
  PROPOSE_RETURNED,
  GET_PROPOSALS,
  GET_PROPOSALS_RETURNED,
  VOTE_FOR,
  VOTE_FOR_RETURNED,
  VOTE_AGAINST,
  VOTE_AGAINST_RETURNED,
  GET_CLAIMABLE_ASSET,
  GET_CLAIMABLE_ASSET_RETURNED,
  CLAIM,
  CLAIM_RETURNED,
  GET_CLAIMABLE,
  GET_CLAIMABLE_RETURNED,
  GET_YCRV_REQUIREMENTS,
  GET_YCRV_REQUIREMENTS_RETURNED,
  GET_GOVERNANCE_REQUIREMENTS,
  GET_GOVERNANCE_REQUIREMENTS_RETURNED,
  REGISTER_VOTE,
  REGISTER_VOTE_RETURNED,
  GET_VOTE_STATUS,
  GET_VOTE_STATUS_RETURNED,
  GET_BOOSTEDBALANCES,
  GET_BOOSTEDBALANCES_RETURNED,
  BOOST_STAKE,
  BOOST_STAKE_RETURNED
} from '../constants';
import Web3 from 'web3';

import {
  injected,
  walletconnect,
  walletlink,
  ledger,
  trezor,
  frame,
  fortmatic,
  portis,
  squarelink,
  torus,
  authereum
} from "./connectors";

const rp = require('request-promise');
const ethers = require('ethers');

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

class Store {
  constructor() {

    this.store = {
      votingStatus: false,
      governanceContractVersion: 2,
      currentBlock: 0,
      universalGasPrice: '70',
      account: {},
      web3: null,
      connectorsByName: {
        MetaMask: injected,
        WalletLink: walletlink,

       /*  Frame: frame,
        TrustWallet: injected,
        WalletConnect: walletconnect,
        Ledger: ledger,
        Trezor: trezor,
        Fortmatic: fortmatic,
        Portis: portis,
        Squarelink: squarelink,
        Torus: torus,
        Authereum: authereum */
      },
      web3context: null,
      languages: [
        {
          language: 'English',
          code: 'en'
        },
        {
          language: 'Japanese',
          code: 'ja'
        },
        {
          language: 'Chinese',
          code: 'zh'
        }
      ],
      proposals: [
      ],
      claimableAsset: {
        id: 'wPE',
        name: 'opes.finance',
        address: config.yfiAddress,
        abi: config.yfiABI,
        symbol: 'wPE',
        balance: 0,
        decimals: 18,
        rewardAddress: '0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d',
        rewardSymbol: 'aDAI',
        rewardDecimals: 18,
        claimableBalance: 0
      },
      rewardPools: [
        {
          id: 'yearn',
          name: 'Seed Pool',
          website: 'curve.fi/s',
          link: 'https://www.curve.fi/susdv2/deposit',
          depositsEnabled: true,
          boost: false,
          tokens: [
            {
              id: 'ycurvefi',
              address: '0xC25a3A3b969415c80451098fa907EC722572917F',
              symbol: 'sCrv',
              abi: config.erc20ABI,
              decimals: 18,
              rewardsAddress: config.yCurveFiRewardsAddress,
              rewardsABI: config.yCurveFiRewardsABI,
              rewardsSymbol: 'WPE',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0
            }
          ]
        },{
          id: 'boost',
          name: 'UNI Boost Pool',
          website: 'app.opes.finance',
          description : 'Used in the 2nd Pool UI',
          link: 'https://www.curve.fi/susdv2/deposit',
          depositsEnabled: true,
          boost: true,
          tokens: [
            {
              id: 'boostrewards',
              address: '0x75F89FfbE5C25161cBC7e97c988c9F391EaeFAF9',
              symbol: 'UNI-LP',
              abi: config.erc20ABI,
              decimals: 18,
              rewardsAddress: config.boostRewardAddress,
              rewardsABI: config.boostRewardABI,
              rewardsSymbol: 'WPE',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0,
              boostTokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
              boostTokenSymbol:'UNI',
              boostTokenBalance: 0,
              boostBalance : 0,
              costBooster : 0,
              costBoosterUSD : 0,
              currentActiveBooster : 0,
              currentBoosterStakeValue : 0,
              stakeValueNextBooster : 0

            }
          ]
        },
        {
          id: 'Balancer',
          name: 'Harvest',
          website: 'pools.balancer.exchange',
          link: 'https://pools.balancer.exchange/#/pool/0x60626db611a9957C1ae4Ac5b7eDE69e24A3B76c5',
          depositsEnabled: true,
          tokens: [
            {
              id: 'bpt',
              address: '0x617707E185f9c73C35A59010Db535bc8745Af1b1',
              symbol: 'BPT',
              abi: config.erc20ABI,
              decimals: 18,
              rewardsAddress: config.balancerRewardsAddress,
              rewardsABI: config.balancerRewardsABI,
              rewardsSymbol: 'WPE',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0
            }
          ]
        },
        {
          id: 'Governance',
          name: 'Governance',
          website: 'pools.balancer.exchange',
          link: 'https://pools.balancer.exchange/#/pool/0x95c4b6c7cff608c0ca048df8b81a484aa377172b',
          depositsEnabled: false,
          tokens: [
            {
              id: 'bpt',
              address: '0x95c4b6c7cff608c0ca048df8b81a484aa377172b',
              symbol: 'BPT',
              abi: config.bpoolABI,
              decimals: 18,
              rewardsAddress: config.governanceAddress,
              rewardsABI: config.governanceABI,
              rewardsSymbol: 'YFI',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0
            }
          ]
        },
        {
          id: 'FeeRewards',
          name: 'Fee Rewards',
          website: 'ygov.finance',
          link: 'https://ygov.finance/',
          depositsEnabled: false,
          tokens: [
            {
              id: 'yfi',
              address: config.yfiAddress,
              symbol: 'YFI',
              abi: config.yfiABI,
              decimals: 18,
              rewardsAddress: config.feeRewardsAddress,
              rewardsABI: config.feeRewardsABI,
              rewardsSymbol: '$',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0
            }
          ]
        },
        {
          id: 'GovernanceV2',
          name: 'Governance',
          website: 'opes.finance',
          link: 'https://opes.finance/',
          depositsEnabled: true,
          boost: false,
          tokens: [
            {
              id: 'wPE',
              address: config.yfiAddress,
              symbol: 'wPE',
              abi: config.yfiABI,
              decimals: 18,
              rewardsAddress: config.governanceV2Address,
              rewardsABI: config.governanceV2ABI,
              rewardsSymbol: '$',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0
            }
          ]
        }
      ]
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case CONFIGURE:
            this.configure(payload);
            break;
          case GET_BOOSTEDBALANCES:
            this.getBoostBalances(payload);
            break;
          case GET_BALANCES:
            this.getBalances(payload);
            break;
          case GET_BALANCES_PERPETUAL:
            this.getBalancesPerpetual(payload);
            break;
          case BOOST_STAKE:
            this.boostStake(payload);
            break;
          case STAKE:
            this.stake(payload);
            break;
          case WITHDRAW:
            this.withdraw(payload);
            break;
          case GET_REWARDS:
            this.getReward(payload);
            break;
          case EXIT:
            this.exit(payload);
            break;
          case PROPOSE:
            this.propose(payload)
            break;
          case GET_PROPOSALS:
            this.getProposals(payload)
            break;
          case REGISTER_VOTE:
            this.registerVote(payload)
            break;
          case GET_VOTE_STATUS:
            this.getVoteStatus(payload)
            break;
          case VOTE_FOR:
            this.voteFor(payload)
            break;
          case VOTE_AGAINST:
            this.voteAgainst(payload)
            break;
          case GET_CLAIMABLE_ASSET:
            this.getClaimableAsset(payload)
            break;
          case CLAIM:
            this.claim(payload)
            break;
          case GET_CLAIMABLE:
            this.getClaimable(payload)
            break;
          case GET_YCRV_REQUIREMENTS:
            this.getYCRVRequirements(payload)
            break;
          case GET_GOVERNANCE_REQUIREMENTS:
            this.getGovernanceV2Requirements(payload)
          default: {
          }
        }
      }.bind(this)
    );
  }

  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    // console.log(this.store)
    return emitter.emit('StoreUpdated');
  };

  configure = async () => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const currentBlock = await web3.eth.getBlockNumber()

    store.setStore({ currentBlock: currentBlock })

    window.setTimeout(() => {
      emitter.emit(CONFIGURE_RETURNED)
    }, 100)
  }

  getBalancesPerpetual = async () => {
    const pools = store.getStore('rewardPools')
    const account = store.getStore('account')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    const currentBlock = await web3.eth.getBlockNumber()
    store.setStore({ currentBlock: currentBlock })

    async.map(pools, (pool, callback) => {

      async.map(pool.tokens, (token, callbackInner) => {

        async.parallel([
          (callbackInnerInner) => { this._getERC20Balance(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getstakedBalance(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getRewardsAvailable(web3, token, account, callbackInnerInner) }
        ], (err, data) => {
          if(err) {
            console.log(err)
            return callbackInner(err)
          }

          token.balance = data[0]
          token.stakedBalance = data[1]
          token.rewardsAvailable = data[2]

          callbackInner(null, token)
        })
      }, (err, tokensData) => {
        if(err) {
          console.log(err)
          return callback(err)
        }

        pool.tokens = tokensData
        callback(null, pool)
      })

    }, (err, poolData) => {
      if(err) {
        console.log(err)
        return emitter.emit(ERROR, err)
      }
      store.setStore({rewardPools: poolData})
      emitter.emit(GET_BALANCES_PERPETUAL_RETURNED)
      emitter.emit(GET_BALANCES_RETURNED)
    })
  }

  getBalances = () => {
    const pools = store.getStore('rewardPools')
    const account = store.getStore('account')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.map(pools, (pool, callback) => {

      async.map(pool.tokens, (token, callbackInner) => {

        async.parallel([
          (callbackInnerInner) => { this._getERC20Balance(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getstakedBalance(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getRewardsAvailable(web3, token, account, callbackInnerInner) }//,
          //(callbackInnerInner) => { this._getBoostBalanceAvailable(web3, token, account, callbackInnerInner) }
        ], (err, data) => {
          if(err) {
            console.log(err)
            return callbackInner(err)
          }

          token.balance = data[0]
          token.stakedBalance = data[1]
          token.rewardsAvailable = data[2]
         /*  try{
            token.boostBalance = data[3]
            token.costBooster = 11
            token.costBoosterUSD = 12
            token.currentActiveBooster = 13
            token.currentBoosterStakeValue = 14
            token.stakeValueNextBooster = 15
             console.log("BOOST_final", token.boostBalance)
          }catch(e){} */

          callbackInner(null, token)
        })
      }, (err, tokensData) => {
        if(err) {
          console.log(err)
          return callback(err)
        }

        pool.tokens = tokensData
        callback(null, pool)
      })

    }, (err, poolData) => {
      if(err) {
        console.log(err)
        return emitter.emit(ERROR, err)
      }
      store.setStore({rewardPools: poolData})
      emitter.emit(GET_BALANCES_RETURNED)
    })
  }


  getBoostBalances = () => {
    const pools = store.getStore('rewardPools')
    const account = store.getStore('account')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.map(pools, (pool, callback) => {
      if(pool.boost == true){
        async.map(pool.tokens, (token, callbackInner) => {

          async.parallel([
            (callbackInnerInner) => { this._getBoosters(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getBoosterCost(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getBoostTokenBalance(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getboostedBalances(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getBoosterPrice(callbackInnerInner) }
            //(callbackInnerInner) => { this._getBoostBalanceAvailable(web3, token, account, callbackInnerInner) }
          ], (err, data) => {
            if(err) {
              console.log(err)
              return callbackInner(err)
            }

            token.boosters = data[2]
            token.costBooster = data[1][0]

            console.log(data)

            console.log("DATA" + data )
            //token.boostBalance = data[0]

            token.boostBalance = data[2]
            //token.costBooster = 11
            token.costBoosterUSD = data[4]*data[1][0]
            token.currentActiveBooster = data[0]
            token.currentBoosterStakeValue = data[3]
            token.stakeValueNextBooster = data[1][1]

            callbackInner(null, token)
          })
        }, (err, tokensData) => {
          if(err) {
            console.log(err)
            return callback(err)
          }

          pool.tokens = tokensData
          callback(null, pool)
        })
      }
    }, (err, poolData) => {
      if(err) {
        console.log(err)
        return emitter.emit(ERROR, err)
      }
      store.setStore({rewardPools: poolData})
      emitter.emit(GET_BOOSTEDBALANCES_RETURNED)
    })
  }
  _getBoosterPrice = async (callback) => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=uniswap&vs_currencies=USD');
      const myJson = await response.json();
      console.log(myJson.uniswap.usd)
      var balance = parseFloat(myJson.uniswap.usd)
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }
  _getBoosters = async (web3, asset, account, callback) => {
    let boostContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    try {
      var balance = await boostContract.methods.numBoostersBought(account.address).call({ from: account.address });
      balance = parseFloat(balance)
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }
  _getBoosterCost = async (web3, asset, account, callback) => {
    let boostContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    try {
      var balance = await boostContract.methods.getBoosterPrice(account.address).call({ from: account.address });
      console.log(balance)
      console.log(balance[0])
      console.log(balance[1])

      var boostInfo = [parseFloat(balance[0])/10**asset.decimals, parseFloat(balance[1])/10**asset.decimals]
      callback(null, boostInfo)
    } catch(ex) {
      return callback(ex)
    }
  }
  _getboostedBalances = async (web3, asset, account, callback) => {
    let boostContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    try {
      var balance = await boostContract.methods.boostedBalances(account.address).call({ from: account.address });
      console.log(balance)

      var boostInfo = parseFloat(balance)/10**asset.decimals
      callback(null, boostInfo)
    } catch(ex) {
      return callback(ex)
    }
  }

  _getBoostTokenBalance = async (web3, asset, account, callback) => {
    let boostTokenContract = new web3.eth.Contract(asset.abi, asset.boostTokenAddress)

    try {
      var balance = await boostTokenContract.methods.balanceOf(account.address).call({ from: account.address });

      var boostInfo = parseFloat(balance)/10**asset.decimals
      callback(null, boostInfo)
    } catch(ex) {
      return callback(ex)
    }
  }

  _checkApproval = async (asset, account, amount, contract, callback) => {
    try {
      const web3 = new Web3(store.getStore('web3context').library.provider);

      const erc20Contract = new web3.eth.Contract(asset.abi, asset.address)
      const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

      const ethAllowance = web3.utils.fromWei(allowance, "ether")

      if(parseFloat(ethAllowance) < parseFloat(amount)) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        callback()
      }
    } catch(error) {
      console.log(error)
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  _checkApprovalWaitForConfirmation = async (asset, account, amount, contract, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address)
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    const ethAllowance = web3.utils.fromWei(allowance, "ether")

    if(parseFloat(ethAllowance) < parseFloat(amount)) {
      erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        .on('transactionHash', function(hash){
          callback()
        })
        .on('error', function(error) {
          if (!error.toString().includes("-32601")) {
            if(error.message) {
              return callback(error.message)
            }
            callback(error)
          }
        })
    } else {
      callback()
    }
  }

  _getERC20Balance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address)

    try {
      var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getstakedBalance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)
    try {
      var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }


  _getBoostBalanceAvailable = async (web3, asset, account, callback) => {
    let boostTokenContract = new web3.eth.Contract(config.erc20ABI, config.boostTokenAddress)
    let boostContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)
    console.log("++++++++++"+asset+"+++++++++++");
    try {
      var boosters = await boostContract.methods.numBoostersBought(account.address).call({ from: account.address });//await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      var balance = parseFloat(balance)/10**asset.decimals

      asset.boostBalance = await boostTokenContract.methods.balanceOf(account.address).call({ from: account.address });

      var boostedPriceFuture = await boostContract.methods.getBoosterPrice(account.address).call({ from: account.address });
      console.log(">>>>>>>"+boostedPriceFuture)

      asset.costBooster = boostedPriceFuture[0]/10**asset.decimals
      asset.costBoosterUSD = 0
      asset.currentActiveBooster = boosters
      asset.currentBoosterStakeValue = 0
      asset.stakeValueNextBooster = boostedPriceFuture[1]/10**asset.decimals
      console.log(">>>>>>>"+balance)
      console.log(">>>>>>>"+boostedPriceFuture)
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getRewardsAvailable = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    try {
      var earned = await erc20Contract.methods.earned(account.address).call({ from: account.address });
      earned = parseFloat(earned)/10**asset.decimals
      callback(null, parseFloat(earned))
    } catch(ex) {
      return callback(ex)
    }
  }

  _checkIfApprovalIsNeeded = async (asset, account, amount, contract, callback, overwriteAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, (overwriteAddress ? overwriteAddress : asset.address))
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    const ethAllowance = web3.utils.fromWei(allowance, "ether")
    if(parseFloat(ethAllowance) < parseFloat(amount)) {
      asset.amount = amount
      callback(null, asset)
    } else {
      callback(null, false)
    }
  }

  _callApproval = async (asset, account, amount, contract, last, callback, overwriteAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, (overwriteAddress ? overwriteAddress : asset.address))
    try {
      if(last) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
          .on('transactionHash', function(hash){
            callback()
          })
          .on('error', function(error) {
            if (!error.toString().includes("-32601")) {
              if(error.message) {
                return callback(error.message)
              }
              callback(error)
            }
          })
      }
    } catch(error) {
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }


  getBoosterBalances = (payload) =>{
    const account = store.getStore('account')
  }

  /**
 * -------------------------
 * START STAKE ON BOOST
 * ----------------------------
 */
  boostStake = (payload)=>{
    console.log("BOOOST!!!")
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._boostcheckApproval(asset, account, config.boostRewardAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._boostcallStake(asset, account, amount, (err, res) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(STAKE_RETURNED, res)
      })
    })
  };
  _boostcheckApproval = async (asset, account, contract, callback) => {
    try {
      const web3 = new Web3(store.getStore('web3context').library.provider);

      const erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.boostTokenAddress)
      const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

      const ethAllowance = web3.utils.fromWei(allowance, "ether")

      if(parseFloat(ethAllowance) < parseFloat("9999999999")) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("9999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        callback()
      }
    } catch(error) {
      console.log(error)
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  _boostcallStake = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const boostContract = new web3.eth.Contract(config.boostRewardABI, config.boostRewardAddress)


    boostContract.methods.boost().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

/**
 * -------------------------
 * END STAKE ON BOOST
 * ----------------------------
 */
  stake = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._checkApproval(asset, account, amount, asset.rewardsAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callStake(asset, account, amount, (err, res) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(STAKE_RETURNED, res)
      })
    })
  }

  _callStake = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals != 18) {
      amountToSend = (amount*10**asset.decimals).toFixed(0);
    }

    yCurveFiContract.methods.stake(amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  withdraw = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._callWithdraw(asset, account, amount, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(WITHDRAW_RETURNED, res)
    })
  }

  _callWithdraw = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals != 18) {
      amountToSend = (amount*10**asset.decimals).toFixed(0);
    }

    yCurveFiContract.methods.withdraw(amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getReward = (payload) => {
    const account = store.getStore('account')
    const { asset } = payload.content

    this._callGetReward(asset, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(GET_REWARDS_RETURNED, res)
    })
  }

  _callGetReward = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    yCurveFiContract.methods.getReward().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  exit = (payload) => {
    const account = store.getStore('account')
    const { asset } = payload.content

    this._callExit(asset, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(EXIT_RETURNED, res)
    })
  }

  _callExit = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    yCurveFiContract.methods.exit().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  propose = (payload) => {
    const account = store.getStore('account')
    const { executor, hash } = payload.content

    this._callPropose(account, executor, hash, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(PROPOSE_RETURNED, res)
    })
  }

  _callPropose = async (account, executor, hash, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const governanceContractVersion = store.getStore('governanceContractVersion')
    const abi = governanceContractVersion === 1 ? config.governanceABI  : config.governanceV2ABI
    const address = governanceContractVersion === 1 ? config.governanceAddress  : config.governanceV2Address

    const governanceContract = new web3.eth.Contract(abi,address)

    let call = null

    call = governanceContract.methods.propose(executor, hash)
    // if(governanceContractVersion === 1) {
    //   call = governanceContract.methods.propose()
    // } else {
    //   call = governanceContract.methods.propose(executor, hash)
    // }

    call.send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getProposals = (payload) => {
    // emitter.emit(GET_PROPOSALS_RETURNED)
    const account = store.getStore('account')
    const web3 = new Web3(store.getStore('web3context').library.provider);

    this._getProposalCount(web3, account, (err, proposalCount) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      let arr = Array.from(Array(parseInt(proposalCount)).keys())

      if(proposalCount == 0) {
        arr = []
      }

      async.map(arr, (proposal, callback) => {
        this._getProposals(web3, account, proposal, callback)
      }, (err, proposalsData) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        store.setStore({ proposals: proposalsData })
        emitter.emit(GET_PROPOSALS_RETURNED)
      })

    })
  }

  _getProposalCount = async (web3, account, callback) => {
    try {

      const governanceContractVersion = store.getStore('governanceContractVersion')
      const abi = governanceContractVersion === 1 ? config.governanceABI  : config.governanceV2ABI
      const address = governanceContractVersion === 1 ? config.governanceAddress  : config.governanceV2Address

      const governanceContract = new web3.eth.Contract(abi, address)
      var proposals = await governanceContract.methods.proposalCount().call({ from: account.address });
      callback(null, proposals)
    } catch(ex) {
      return callback(ex)
    }
  }

  _getProposals = async (web3, account, number, callback) => {
    try {

      const governanceContractVersion = store.getStore('governanceContractVersion')
      const abi = governanceContractVersion === 1 ? config.governanceABI  : config.governanceV2ABI
      const address = governanceContractVersion === 1 ? config.governanceAddress  : config.governanceV2Address

      const governanceContract = new web3.eth.Contract(abi, address)
      var proposal = await governanceContract.methods.proposals(number).call({ from: account.address });

      proposal.executor = governanceContractVersion === 1 ? '0x0000000000000000000000000000000000000000' : proposal.executor
      proposal.hash = governanceContractVersion === 1 ? 'na' : proposal.hash
      proposal.quorum = governanceContractVersion === 1 ? 'na' : proposal.quorum
      proposal.quorumRequired = governanceContractVersion === 1 ? 'na' : proposal.quorumRequired

      callback(null, proposal)
    } catch(ex) {
      return callback(ex)
    }
  }

  getVoteStatus = async (payload) => {
    try {
      const account = store.getStore('account')
      const web3 = new Web3(store.getStore('web3context').library.provider);

      const governanceContract = new web3.eth.Contract(config.governanceV2ABI,config.governanceV2Address)

      const status = await governanceContract.methods.voters(account.address).call({ from: account.address })

      store.setStore({votingStatus: status})
      emitter.emit(GET_VOTE_STATUS_RETURNED, status)

    } catch(ex) {
      return emitter.emit(ERROR, ex);
    }
  }

  registerVote = (payload) => {
    const account = store.getStore('account')

    this._callRegisterVote(account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(REGISTER_VOTE_RETURNED, res)
    })
  }

  _callRegisterVote = async (account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const governanceContract = new web3.eth.Contract(config.governanceV2ABI, config.governanceV2Address)
    governanceContract.methods.register().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_VOTE_STATUS, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  voteFor = (payload) => {
    const account = store.getStore('account')
    const { proposal } = payload.content

    this._callVoteFor(proposal, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(VOTE_FOR_RETURNED, res)
    })
  }

  _callVoteFor = async (proposal, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const governanceContractVersion = store.getStore('governanceContractVersion')
    const abi = governanceContractVersion === 1 ? config.governanceABI  : config.governanceV2ABI
    const address = governanceContractVersion === 1 ? config.governanceAddress  : config.governanceV2Address

    const governanceContract = new web3.eth.Contract(abi,address)

    governanceContract.methods.voteFor(proposal.id).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  voteAgainst = (payload) => {
    const account = store.getStore('account')
    const { proposal } = payload.content

    this._callVoteAgainst(proposal, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(VOTE_AGAINST_RETURNED, res)
    })
  }

  _callVoteAgainst = async (proposal, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const governanceContractVersion = store.getStore('governanceContractVersion')
    const abi = governanceContractVersion === 1 ? config.governanceABI  : config.governanceV2ABI
    const address = governanceContractVersion === 1 ? config.governanceAddress  : config.governanceV2Address

    const governanceContract = new web3.eth.Contract(abi,address)

    governanceContract.methods.voteAgainst(proposal.id).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getClaimableAsset = (payload) => {
    const account = store.getStore('account')
    const asset = store.getStore('claimableAsset')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.parallel([
      (callbackInnerInner) => { this._getClaimableBalance(web3, asset, account, callbackInnerInner) },
      (callbackInnerInner) => { this._getClaimable(web3, asset, account, callbackInnerInner) },
    ], (err, data) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      asset.balance = data[0]
      asset.claimableBalance = data[1]

      store.setStore({claimableAsset: asset})
      emitter.emit(GET_CLAIMABLE_ASSET_RETURNED)
    })
  }

  _getClaimableBalance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.abi, asset.address)

    try {
      var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getClaimable = async (web3, asset, account, callback) => {
    let claimContract = new web3.eth.Contract(config.claimABI, config.claimAddress)

    try {
      var balance = await claimContract.methods.claimable(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  claim = (payload) => {
    const account = store.getStore('account')
    const asset = store.getStore('claimableAsset')
    const { amount } = payload.content

    this._checkApproval(asset, account, amount, config.claimAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callClaim(asset, account, amount, (err, res) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(CLAIM_RETURNED, res)
      })
    })
  }

  _callClaim = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const claimContract = new web3.eth.Contract(config.claimABI, config.claimAddress)

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals != 18) {
      amountToSend = (amount*10**asset.decimals).toFixed(0);
    }

    claimContract.methods.claim(amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_CLAIMABLE_ASSET, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getClaimable = (payload) => {
    const account = store.getStore('account')
    const asset = store.getStore('claimableAsset')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.parallel([
      (callbackInnerInner) => { this._getClaimableBalance(web3, asset, account, callbackInnerInner) },
      (callbackInnerInner) => { this._getClaimable(web3, asset, account, callbackInnerInner) },
    ], (err, data) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      asset.balance = data[0]
      asset.claimableBalance = data[1]

      store.setStore({claimableAsset: asset})
      emitter.emit(GET_CLAIMABLE_RETURNED)
    })
  }

  getYCRVRequirements = async (payload) => {
    try {
      const account = store.getStore('account')
      const web3 = new Web3(store.getStore('web3context').library.provider);

      const governanceContract = new web3.eth.Contract(config.governanceABI,config.governanceAddress)

      let balance = await governanceContract.methods.balanceOf(account.address).call({ from: account.address })
      balance = parseFloat(balance)/10**18

      const voteLock = await governanceContract.methods.voteLock(account.address).call({ from: account.address })
      const currentBlock = await web3.eth.getBlockNumber()

      const returnOBJ = {
        balanceValid: (balance > 1000),
        voteLockValid: voteLock > currentBlock,
        voteLock: voteLock
      }

      emitter.emit(GET_YCRV_REQUIREMENTS_RETURNED, returnOBJ)

    } catch(ex) {
      return emitter.emit(ERROR, ex);
    }
  }

  getGovernanceV2Requirements = async (payload) => {
    try {
      const account = store.getStore('account')
      const web3 = new Web3(store.getStore('web3context').library.provider);

      const governanceContract = new web3.eth.Contract(config.governanceV2ABI,config.governanceV2Address)

      const voteLock = await governanceContract.methods.voteLock(account.address).call({ from: account.address })
      const currentBlock = await web3.eth.getBlockNumber()

      const returnOBJ = {
        voteLockValid: voteLock > currentBlock,
        voteLock: voteLock
      }

      emitter.emit(GET_GOVERNANCE_REQUIREMENTS_RETURNED, returnOBJ)

    } catch(ex) {
      return emitter.emit(ERROR, ex);
    }
  }

  _getGasPrice = async () => {
    try {
      const url = 'https://gasprice.poa.network/'
      const priceString = await rp(url);
      const priceJSON = JSON.parse(priceString)
      if(priceJSON) {
        return priceJSON.fast.toFixed(0)
      }
      return store.getStore('universalGasPrice')
    } catch(e) {
      console.log(e)
      return store.getStore('universalGasPrice')
    }
  }
}

var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
