import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  InputAdornment
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import Loader from '../loader'
import Snackbar from '../snackbar'

import Store from "../../stores";
import { colors } from '../../theme'

import '../../assets/css/style.css';
import { Container, Col, Row, Button, Navbar, Nav, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import Countdown from 'react-countdown-now';
import Web3 from 'web3';


import {
  ERROR,
  CONFIGURE_RETURNED,
  STAKE,
  STAKE_RETURNED,
  WITHDRAW,
  WITHDRAW_RETURNED,
  GET_REWARDS,
  GET_REWARDS_RETURNED,
  EXIT,
  EXIT_RETURNED,
  GET_YCRV_REQUIREMENTS,
  GET_YCRV_REQUIREMENTS_RETURNED,
  GET_GOVERNANCE_REQUIREMENTS,
  GET_GOVERNANCE_REQUIREMENTS_RETURNED,
  GET_BALANCES_RETURNED,
  GET_BOOSTEDBALANCES,
  GET_BOOSTEDBALANCES_RETURNED,
  BOOST_STAKE,
  BOOST_STAKE_RETURNED
} from '../../constants'

const countdownrenderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span>Rewards: ENDED</span>;
  } else {
    // Render a countdown
  return <span>Rewards Ends in {days} Day(s) {hours}:{minutes}:{seconds}</span>;
  }
};

const styles = theme => ({
  
  valContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },

  inputAdornment: {
    fontWeight: '600',
    fontSize: '1.5rem'
  },
  assetIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: '25px',
    background: '#dedede',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    marginRight: '16px'
  },
  balances: {
    width: '100%',
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer'
  },

  voteLockMessage: {
    margin: '20px'
  },
 
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Stake extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    const pool = store.getStore('currentPool')
    const governanceContractVersion = store.getStore('governanceContractVersion')

    if(!pool) {
      props.history.push('/')
    }

    this.state = {
      pool: pool,
      loading: !(account || pool),
      account: account,
      value: 'options',
      voteLockValid: false,
      balanceValid: false,
      voteLock: null,
      stakevalue : 'main',
      governanceContractVersion: governanceContractVersion
    }

    if(pool && ['FeeRewards', 'Governance'].includes(pool.id)) {
      dispatcher.dispatch({ type: GET_YCRV_REQUIREMENTS, content: {} })
    }

    if(pool && ['GovernanceV2'].includes(pool.id)) {
      dispatcher.dispatch({ type: GET_GOVERNANCE_REQUIREMENTS, content: {} })
    }
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(STAKE_RETURNED, this.showHash);
    emitter.on(WITHDRAW_RETURNED, this.showHash);
    emitter.on(EXIT_RETURNED, this.showHash);
    emitter.on(GET_REWARDS_RETURNED, this.showHash);
    emitter.on(GET_YCRV_REQUIREMENTS_RETURNED, this.yCrvRequirementsReturned);
    emitter.on(GET_GOVERNANCE_REQUIREMENTS_RETURNED, this.govRequirementsReturned);
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(STAKE_RETURNED, this.showHash);
    emitter.removeListener(WITHDRAW_RETURNED, this.showHash);
    emitter.removeListener(EXIT_RETURNED, this.showHash);
    emitter.removeListener(GET_REWARDS_RETURNED, this.showHash);
    emitter.removeListener(GET_YCRV_REQUIREMENTS_RETURNED, this.yCrvRequirementsReturned);
    emitter.removeListener(GET_GOVERNANCE_REQUIREMENTS_RETURNED, this.govRequirementsReturned);
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
  };

  balancesReturned = () => {
    const currentPool = store.getStore('currentPool')
    const pools = store.getStore('rewardPools')
    let newPool = pools.filter((pool) => {
      return pool.id === currentPool.id
    })

    if(newPool.length > 0) {
      newPool = newPool[0]
      store.setStore({ currentPool: newPool })
    }
  }

  yCrvRequirementsReturned = (requirements) => {
    this.setState({
      balanceValid: requirements.balanceValid,
      voteLockValid: requirements.voteLockValid,
      voteLock: requirements.voteLock
    })
  }

  govRequirementsReturned = (requirements) => {
    this.setState({
      gov_voteLockValid: requirements.voteLockValid,
      gov_voteLock: requirements.voteLock
    })
  }

  showHash  = (txHash) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  errorReturned = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  };

  render() {
    const { classes } = this.props;
    const {
      value,
      account,
      modalOpen,
      pool,
      loading,
      snackbarMessage,
      voteLockValid,
      balanceValid,
      gov_voteLock,
      gov_voteLockValid
    } = this.state

    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    if(!pool) {
      return null
    }

    return (
      <>

      <Container>

      <Navbar >
          <Navbar.Brand className="headerTitle">
            <img
              alt=""
              src={ require('../../assets/App-Logo2.png') }
              width="40"
              height="40"
              className="d-inline-block align-top"
            />{' '}
            OPES.Finance
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end ">
            <Navbar.Text  onClick={this.overlayClicked } className="round-wallet">
              Wallet :  { address}
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>

        <Row>
          
          <Col lg="12" md="12" xs="12" className="text-left mt-2" >
          <Button
            className="smallBTN"
            variant="outlined"
            color="secondary"
            disabled={ loading }
            onClick={ () => { if(value!=='buyboost'){

              if(['seedzindex','seedzuni'].includes(pool.id)){       
                store.setStore({"valueopen":"seedz"})
              }else if(['group1','group2','group3','group4','group5','group6'].includes(pool.id)){
                store.setStore({"valueopen":"group-pools"})
              }else{
                store.setStore({"valueopen":""})
              }
             

              this.props.history.push('/staking') 
            }else{  this.navigateInternal('options') }} }
          >
            <Typography variant={ 'h4'}>Back</Typography>
          </Button> 
          

          </Col>
        </Row>

      

       

       

        { value === 'options' && this.renderOptions2() }
        { value === 'stake' && this.renderStake() }
        { value === 'buyboost' && this.renderBuyBoost() }
        { value === 'claim' && this.renderClaim() }
        { value === 'unstake' && this.renderUnstake() }
        { value === 'exit' && this.renderExit() }

        { snackbarMessage && this.renderSnackbar() }
        { loading && <Loader /> }
        <Row>
          <Col lg="12" md="12" xs="12 mt-5">
         
         
          </Col>
        </Row>
      </Container>
      
     
      <div className="text-center text-white w-100">
          © Copyright <strong>OPES.Finance.</strong> All Rights Reserved 
          </div>
       
      </>
    )
  }



  renderOptions2=()=>{
    const { pool, stakevalue } = this.state
    var address = null;
    let addy = ''
    if (pool.tokens && pool.tokens[0]) {
      addy = pool.tokens[0].rewardsAddress
      address = addy.substring(0,6)+'...'+addy.substring(addy.length-4,addy.length)
    }
    return (
      <>
     
     <Row>
          <Col lg="4" md="12" xs="12" className="p-1">

          <div className="mt-2 text-center rounded p-2">
            <h4 className="p-2 rounded text-white" >{ pool.name }</h4>
              <p>Total deposited: { pool.tokens[0].stakedBalance ? pool.tokens[0].stakedBalance.toFixed(pool.displayDecimal) : "0" }
              <br></br>
              Pool Rate: { pool.ratePerWeek ? pool.ratePerWeek.toFixed(4) : "0.0" } { pool.tokens[0].poolRateSymbol }
                <br/>
                Contract Address: <a style={ {color :'#FFFFFF'}} href={ 'https://etherscan.io/address/'+addy } target="_blank">{ address }</a>.
              </p>
          </div>


          </Col>
          <Col lg="8" md="12" xs="12" className="p-1">

            <table className="table mt-5">
                <thead >
                    <tr>
                      <th>Your Balance</th>
                      <th>Currently Staked</th>
                      <th>Beast Mode X</th>
                      <th>Rewards Available</th>
                    </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{ pool.tokens[0].balance ? pool.tokens[0].balance.toFixed(pool.displayDecimal) : "0" }  { pool.tokens[0].symbol }</td>
                    <td>{ pool.tokens[0].stakedBalance ? pool.tokens[0].stakedBalance.toFixed(pool.displayDecimal) : "0" }</td>
                    <td>{ pool.tokens[0].currentActiveBooster ? pool.tokens[0].currentActiveBooster.toFixed(2) : "0" }</td>
                    <td>{ pool.tokens[0].rewardsSymbol == '$' ? pool.tokens[0].rewardsSymbol : '' } { pool.tokens[0].rewardsAvailable ? pool.tokens[0].rewardsAvailable.toFixed(pool.displayDecimal) : "0" } { pool.tokens[0].rewardsSymbol != '$' ? pool.tokens[0].rewardsSymbol : '' }</td>
                  </tr>
                </tbody>
            </table>
        
          </Col>
          
        </Row>
      
        { stakevalue ==='main' && this.stakeMain() }
        { stakevalue ==='poolended' && this.poolEnded() }
        { stakevalue ==='comingsoon' && this.comingSoon() }
      
     </>
    )
  }

  navigateStakeInternal = (val) => {
    this.setState({ stakevalue: val })
  }
  stakeMain= ()=>{
    const { pool, stakevalue } = this.state;

    return (
      <Row>

      <Col lg="4" md="12" xs="12" className="p-1">

          <Card>
            <Card.Body>
                <Card.Title>STAKE</Card.Title>
                { this.renderAssetInput( pool.tokens[0], 'stake') }
                { pool.depositsEnabled && <div className="myButton"  onClick={ () => { this.onStake() } } >
                  STAKE
                </div> }              
                { !pool.depositsEnabled && <div className="myButton-disable" >
                  STAKE
                </div> }
  
            </Card.Body>
          </Card>

      </Col>


      <Col lg="4" md="12" xs="12" className="p-1">

          <Card>
            <Card.Body>
                <Card.Title>UN-STAKE</Card.Title>
                { this.renderAssetInput( pool.tokens[0], 'unstake') }
                { (pool.id == "seedzindex" || pool.id == "seedzuni") ? <div className="myButton-disable">UNSTAKE</div> : <div className="myButton"  onClick={ () => { this.onUnstake() } } >
                  UNSTAKE
                </div> }

            </Card.Body>
          </Card>

      </Col>

      <Col lg="4" md="12" xs="12" className="p-3">
        
          
          
      {   !['yearn'].includes(pool.id) && <div className="myButton mb-2"    onClick={ () => { this.navigateInternal('buyboost') }  } >
          BEAST MODE
          </div>
      }
      

          <div className="myButton"  onClick={ () => { this.onClaim() } } >
            CLAIM REWARDS
          </div>
          { pool.id !='seedzuni' && pool.id != 'seedzindex' && <div className="myButton mt-2"  onClick={ () => { this.onExit() } }>
            Exit: Claim & Unstake
          </div>
          }
         { (pool.id =='seedzuni' || pool.id == 'seedzindex') && <div className="myButton-disable mt-2"  >
            Exit: Claim & Unstake
          </div>
          }

         { pool.id=='balancer-stake' && <div className="text-white text-center p-2">
           <a  className="text-white" href="https://medium.com/opes-dot-finance/defi-rising-a-crypto-index-fund-ffa41bff510c" target="_blank">What is Defi Index Pool?</a>
          </div> }
      </Col>

      <Col lg="8" md="12" xs="12">

      <div className="text-center mt-3 mb-2">

      
              { pool.depositsEnabled &&  <a className="smallBTN small m-2" href={pool.link} target="_blank">{ pool.linkName }</a> }
              { !pool.depositsEnabled &&  <a className="smallBTN-disable small m-2"  target="_blank">BUY { pool.tokens[0].symbol }</a> }
              { pool.id== 'seedzuni' && pool.depositsEnabled &&  <a className="smallBTN small m-2" href='https://app.uniswap.org/#/add/ETH/0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b'  target="_blank">Buy UNI-v2</a> }
       
            { pool.id=='balancer-stake' && pool.id!='boost'  && pool.liquidityLink !='' && <a className="smallBTN small m-2"  href={pool.liquidityLink} target="_blank">Add Liquidity (ETH/DAI) Pair</a> }
            { pool.id !='seedzuni' && pool.id!='balancer-stake' && pool.id!='boost'  &&  pool.liquidityLink !='' && <a className="smallBTN small m-2"  href={pool.liquidityLink} target="_blank">Add Liquidity to Balancer Pool</a> }
        
            {  pool.id!='balancer-stake' && (pool.id =='seedzuni' || pool.id=='boost')   &&  pool.liquidityLink !='' && <a className="smallBTN small m-2"  href={pool.liquidityLink} target="_blank">Add Liquidity to Uniswap</a> }
        
            <div className="smallBTN small m-2 my-auto" 

            onClick = {async (event) => {
              let provider  = new Web3(store.getStore('web3context').library.provider);
              provider = provider.currentProvider;
              provider.sendAsync({
              method: 'metamask_watchAsset',
              params: {
                "type":"ERC20",
                "options":{
                  "address":  pool.tokenAddress,
                  "symbol":  pool.tokenSymbol,
                  "decimals": 18,
                  "image": '',
                }
              },
              id: Math.round(Math.random() * 100000),
              }, (err, added) => {
                console.log('provider returned', err, added)
                if (err || 'error' in added) {
                return  emitter.emit(ERROR, 'There was a problem adding the token.');
                }
              })
            }}

            >Add {pool.tokenSymbol} to <img
            alt=""
            src={ require('../../assets/metamask.png') }
            width="15"
            height="15"
            className="d-inline-block align-top"
          /></div>


            { pool.id=='seedzindex' && <div className="smallBTN small m-2 my-auto" 

            onClick = {async (event) => {
            let provider  = new Web3(store.getStore('web3context').library.provider);
            provider = provider.currentProvider;
            provider.sendAsync({
            method: 'metamask_watchAsset',
            params: {
              "type":"ERC20",
              "options":{
                "address":  '0x5B2dC8c02728e8FB6aeA03a622c3849875A48801',
                "symbol":  'BPT',
                "decimals": 18,
                "image": '',
              }
            },
            id: Math.round(Math.random() * 100000),
            }, (err, added) => {
              console.log('provider returned', err, added)
              if (err || 'error' in added) {
              return  emitter.emit(ERROR, 'There was a problem adding the token.');
              }
            })
            }}

            >Add BPT/Defi Index to <img
            alt=""
            src={ require('../../assets/metamask.png') }
            width="15"
            height="15"
            className="d-inline-block align-top"
          /></div>
            }

            { pool.id=='seedzuni' && <div className="smallBTN small m-2 my-auto" 

            onClick = {async (event) => {
            let provider  = new Web3(store.getStore('web3context').library.provider);
            provider = provider.currentProvider;
            provider.sendAsync({
            method: 'metamask_watchAsset',
            params: {
            "type":"ERC20",
            "options":{
              "address":  '0x75f89ffbe5c25161cbc7e97c988c9f391eaefaf9',
              "symbol":  'UNI-v2',
              "decimals": 18,
              "image": '',
            }
            },
            id: Math.round(Math.random() * 100000),
            }, (err, added) => {
            console.log('provider returned', err, added)
            if (err || 'error' in added) {
            return  emitter.emit(ERROR, 'There was a problem adding the token.');
            }
            })
            }}

            >Add UNI-v2 to <img
            alt=""
            src={ require('../../assets/metamask.png') }
            width="15"
            height="15"
            className="d-inline-block align-top"
          /></div>
            }


  

     

          
        </div>


      </Col>

      </Row>
    )
  }


  renderOptions = () => {
    const { classes } = this.props;
    const {
      loading,
      pool,
      voteLockValid,
      balanceValid,
      voteLock,
      gov_voteLockValid,
      gov_voteLock,
    } = this.state

    return (
      <Row>
        <Col lg='2' md="12" xs="12" ></Col>
        <Col lg='8' className="text-center">
        <Row>
            <Col lg="6" md="12" xs="12" className="p-1">

            

              <Button
                className="btn btn-info btn-block"
                variant="outlined"
                disabled={ !pool.depositsEnabled || (['FeeRewards'].includes(pool.id) ?  (loading || !voteLockValid || !balanceValid) : loading) }
                onClick={ () => { this.navigateInternal('stake') } }
                >
                <Typography variant={ 'h4'}>Stake Token</Typography>
              </Button>

            </Col>
            { ['boost'].includes(pool.id) &&
            <Col lg="6" md="12" xs="12" className="p-1">
              <Button
                 className="btn btn-outline-info btn-block"
                 variant="outlined"
                disabled={ !pool.depositsEnabled || (['FeeRewards'].includes(pool.id) ?  (loading || !voteLockValid || !balanceValid) : loading) }
                onClick={ () => { this.navigateInternal('buyboost') } }
                >
                <Typography variant={ 'h4'}>BEAST MODE</Typography>
              </Button>
              </Col>}
          
            <Col lg="6" md="12" xs="12" className="p-1">

          

              <Button
             
             className="btn btn-outline-info btn-block"
             variant="outlined"
              disabled={ loading || (['GovernanceV2'].includes(pool.id) && !gov_voteLockValid) }
              onClick={ () => { this.onClaim() } }
              >
              <Typography variant={ 'h4'}>Claim Rewards</Typography>
            </Button>

            </Col>
            <Col lg="6" md="12" xs="12" className="p-1">

              <Button
              className="btn btn-outline-info btn-block"
              variant="outlined"
              disabled={ loading  || (['GovernanceV2'].includes(pool.id) && gov_voteLockValid) || (pool.id === 'Governance' && (voteLockValid )) }
              onClick={ () => { this.navigateInternal('unstake') } }
              >
              <Typography variant={ 'h4'}>Unstake Tokens</Typography>
            </Button>

            </Col>
            <Col lg="6" md="12" xs="12" className="p-1">

            { !['GovernanceV2'].includes(pool.id) &&
            <Button
              className="btn btn-outline-info btn-block"
              variant="outlined"
              disabled={ (pool.id === 'Governance' ? (loading || voteLockValid ) : loading  ) }
              onClick={ () => { this.onExit() } }
              >
              <Typography variant={ 'h4'}>Exit: Claim and Unstake</Typography>
            </Button>
          }


            </Col>
        </Row>
        </Col>
        <Col lg='2' md="12" xs="12"></Col>
        { (['Governance', 'GovernanceV2'].includes(pool.id) && voteLockValid) && <Typography variant={'h4'} className={ classes.voteLockMessage }>Unstaking tokens only allowed once all your pending votes have closed at Block: {voteLock}</Typography> }
        { (['GovernanceV2'].includes(pool.id) && !gov_voteLockValid) && <Typography variant={'h4'} className={ classes.voteLockMessage }>You need to have voted recently in order to claim rewards</Typography> }
        { (['GovernanceV2'].includes(pool.id) && gov_voteLockValid) && <Typography variant={'h4'} className={ classes.voteLockMessage }>You have recently voted, you can unstake at block {gov_voteLock}</Typography> }
      </Row>

    )
  }

  navigateInternal = (val) => {
    this.setState({ value: val })
  }


  renderBuyBoost = () => {
    const { classes } = this.props;
    const { loading, pool, voteLockValid } = this.state

    const asset = pool.tokens[0]


    return (

      <Row>
        <Col lg="6" md="12" xs="12" className="p-1">
        <div className="mt-2 text-center rounded p-2">
            <h4 className="p-2 rounded text-white" >{ pool.name }</h4>
              <p>Total deposited: { pool.tokens[0].stakedBalance ? pool.tokens[0].stakedBalance.toFixed(pool.displayDecimal) : "0" }
              <br></br>
              Pool Rate: { pool.ratePerWeek ? pool.ratePerWeek.toFixed(4) : "0.0"} { pool.tokens[0].poolRateSymbol }
              </p>
          </div>


          <table className="table">
                <thead >
                    <tr>
                      <th>Your Balance</th>
                      <th>Currently Staked</th>
                      <th>Beast Mode X</th>
                      <th>Rewards Available</th>
                    </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{ pool.tokens[0].boostBalance ? pool.tokens[0].boostBalance.toFixed(pool.displayDecimal) : "0" } ETH </td>
                    <td>{ pool.tokens[0].stakedBalance ? pool.tokens[0].stakedBalance.toFixed(pool.displayDecimal) : "0" }</td>
                    <td>{ pool.tokens[0].currentActiveBooster ? pool.tokens[0].currentActiveBooster.toFixed(2) : "0" }</td>
                    <td>{ pool.tokens[0].rewardsSymbol == '$' ? pool.tokens[0].rewardsSymbol : '' } { pool.tokens[0].rewardsAvailable ? pool.tokens[0].rewardsAvailable.toFixed(pool.displayDecimal) : "0" } { pool.tokens[0].rewardsSymbol != '$' ? pool.tokens[0].rewardsSymbol : '' }</td>
                  </tr>
                </tbody>
            </table>

        </Col>
        <Col lg="6" md="12" xs="12" className="p-4">
         
          <table className="table">
             <tbody>
               {
                 pool.id == "seedzindex" || pool.id == "seedzuni" &&
                 <tr>
                 <td className="text-left">Ethereum Price (USD)</td>
                 <td className="text-right">$ { pool.tokens[0].ethPrice ? pool.tokens[0].ethPrice.toFixed(2) : "0.00" }</td>
               </tr>
               }
               <tr>
                 <td className="text-left">Token Balance</td>
                 <td className="text-right">{ pool.tokens[0].boostBalance ? pool.tokens[0].boostBalance.toFixed(7) : "0" } ETH</td>
               </tr>
               <tr>
                 <td className="text-left">Cost of Beast Mode</td>
                 <td className="text-right">{ pool.tokens[0].costBooster ? pool.tokens[0].costBooster.toFixed(7) : "0" } ETH</td>
               </tr>
               <tr>
                 <td className="text-left">Cost of Beast Mode (USD)</td>
                 <td className="text-right">$ { pool.tokens[0].costBoosterUSD ? pool.tokens[0].costBoosterUSD.toFixed(2) : "0.00" }</td>
               </tr>
               <tr>
                 <td className="text-left">Time to next BEAST powerup</td>
                 <td className="text-right">{ (pool.tokens[0].timeToNextBoost -(new Date().getTime())/1000) > 0 ? ((pool.tokens[0].timeToNextBoost - (new Date().getTime())/1000)/60).toFixed(0) : "0" } Minutes</td>
               </tr>
               <tr>
                 <td className="text-left">Beast Modes currently active</td>
                 <td className="text-right">{ pool.tokens[0].currentActiveBooster ? pool.tokens[0].currentActiveBooster.toFixed(2) : "0" }</td>
               </tr>
               <tr>
                 <td className="text-left">Current Beast Mode stake value</td>
                 <td className="text-right">{ pool.tokens[0].currentBoosterStakeValue ? pool.tokens[0].currentBoosterStakeValue.toFixed(7) : "0" }  { pool.tokens[0].symbol }</td>
               </tr>
               <tr>
                 <td className="text-left">Staked value after next Beast Mode</td>
              <td className="text-right">{ pool.tokens[0].stakeValueNextBooster ? pool.tokens[0].stakeValueNextBooster.toFixed(7) : "0" } { pool.tokens[0].symbol }</td>
               </tr>
            </tbody>
          </table>
          { pool.boost && <div className="myButton"   onClick={ () => { this.validateBoost() } } >
           BEAST MODE
              </div> }

              { !pool.boost && <div className="myButton-disable"  >
           BEAST MODE
              </div> }
        </Col>
        
      </Row>

    )
  }
  validateBoost = () => {
    const { loading, pool, voteLockValid } = this.state
    if(pool.tokens[0].costBooster > pool.tokens[0].boostBalance){
        window.gtag('event', 'click_Buy_Boost_Insufficient_Funds', {
          event_category: pool.id,
          event_label : pool.name
        })
        //alert("insufficient funds to activate Beast Mode")
        emitter.emit(ERROR, 'insufficient funds to activate Beast Mode');
    } else if((pool.tokens[0].timeToNextBoost -(new Date().getTime())/1000) > 0){
      window.gtag('event', 'click_Buy_Boost_Too_Soon_To_Activate', {
        event_category: pool.id,
        event_label : pool.name
      })
        //alert("Too soon to activate BEAST Mode again")
        emitter.emit(ERROR, 'Too soon to activate BEAST Mode again');
    } else {
        this.onBuyBoost()
    }
  }

  renderStake = () => {
    const { classes } = this.props;
    const { loading, pool } = this.state

    const asset = pool.tokens[0]

    return (
      <Row>
      <Col lg='2' md="12" xs="12" ></Col>
      <Col lg='8' md="12" xs="12">
      <Row>
        <Col lg="12" md="12" sm="12">
          <h3>Stake your tokens</h3>
        </Col>
        <Col lg="12" md="12" sm="12">
        { this.renderAssetInput(asset, 'stake') }
        </Col>
        <Col lg="6" md="12" sm="12">
        <Button
            className="btn btn-outline-info  btn-block"
            variant="outlined"
            color="secondary"
            disabled={ loading }
            onClick={ () => {  this.navigateInternal('options') } }
          >
            <Typography variant={ 'h4'}>Back</Typography>
          </Button>
        </Col>
        <Col lg="6" md="12" sm="12">
        <Button
            className="btn btn-info btn-block"
            variant="outlined"
            disabled={ loading }
            onClick={ () => { this.onStake() } }
          >
            <Typography variant={ 'h4'}>Stake</Typography>
          </Button>
        </Col>
      </Row>
      </Col>
       <Col lg='2' md="12" xs="12" ></Col>
      </Row>
     
    )
  }

  renderUnstake = () => {
    const { classes } = this.props;
    const { loading, pool, voteLockValid } = this.state

    const asset = pool.tokens[0]

    return (
      <Row className="mt-0 pt-0">
      <Col lg='2' md="12" xs="12" ></Col>
      <Col lg='8' md="12" xs="12">
      <Row>
        <Col lg="12" md="12" sm="12">
          <h3>Unstake your tokens</h3>
        </Col>
        <Col lg="12" md="12" sm="12">
        { this.renderAssetInput(asset, 'unstake') }
        </Col>
        <Col lg="6" md="12" sm="12">
        <Button
            className="btn btn-outline-primary  btn-block"
            variant="outlined"
            color="secondary"
            disabled={ loading }
            onClick={ () => {  this.navigateInternal('options') } }
          >
            <Typography variant={ 'h4'}>Back</Typography>
          </Button>
        </Col>
        <Col lg="6" md="12" sm="12">
        <Button
            className="btn btn-info btn-block"
            variant="outlined"
            disabled={ loading }
            onClick={ () => { this.onUnstake() } }
          >
          
            <Typography variant={ 'h4'}>Unstake</Typography>
          </Button>
        </Col>
      </Row>
      </Col>
       <Col lg='2' md="12" xs="12" ></Col>
      </Row>
     
    )
  }

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  onBuyBoost=()=>{
    this.setState({ amountError: false })
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]
    const amount = this.state[selectedToken.id + '_stake']
    const value = (selectedToken.costBooster+0.0001).toFixed(10).toString();

    window.gtag('event', 'click_Buy_Boost', {
      event_category: pool.id,
      event_label : pool.name
    })

    this.setState({ loading: true })
    dispatcher.dispatch({ type: BOOST_STAKE, content: { asset: selectedToken, amount: amount, value: value } })
  }

  onStake = () => {



    this.setState({ amountError: false })
    this.setState({ amountStakeError: false })
    const { pool } = this.state

    window.gtag('event', 'click_Stake', {
      event_category: pool.id,
      event_label : pool.name
    })

    if(pool.id=='yearn'){
      this.navigateStakeInternal('poolended');

    /* }else if(pool.id=='balancer-stake' || pool.id=='balancer-pool' || pool.id=='group1' || pool.id=='group2'
    || pool.id=='group3' || pool.id=='group4' || pool.id=='group5' || pool.id=='group6' || pool.id=='group7'){
      this.navigateStakeInternal('comingsoon');*/
    }else{ 

    const tokens = pool.tokens
    const selectedToken = tokens[0]
    this.setState({ fieldid : ''})
    const amount = this.state[selectedToken.id + '_stake']

      if(amount > 0){
        this.setState({ loading: true })
        dispatcher.dispatch({ type: STAKE, content: { asset: selectedToken, amount: amount } })
      }else{
        this.setState({ fieldid : selectedToken.id + '_stake'})
        this.setState({ amountStakeError: true })
          emitter.emit(ERROR, 'Please enter the amount on the Stake field');
       
      }
    }
  }

  poolEnded=()=>{
    return (
      <>
        <Row>
          <Col lg="12" md="12" xs="12" className="my-auto" style={{'height':'200px'}}>
              <h2 className="poolended">POOL ENDED</h2>
          </Col>
        </Row>
      </>
    )
  }

  comingSoon=()=>{
    return (
      <>
        <Row>
          <Col lg="12" md="12" xs="12" className="my-auto" style={{'height':'200px'}}>
              <h2 className="poolended">Coming Soon</h2>
          </Col>
        </Row>
      </>
    )
  }


  onClaim = () => {
    const { pool } = this.state

      window.gtag('event', 'click_claim_rewards', {
        event_category: pool.id,
        event_label : pool.name
      })

      const tokens = pool.tokens
      const selectedToken = tokens[0]

      this.setState({ loading: true })
      dispatcher.dispatch({ type: GET_REWARDS, content: { asset: selectedToken } })
  
  }

  onUnstake = () => {
    this.setState({ amountError: false })
    this.setState({ amountStakeError: false })
   
    const { pool } = this.state

      window.gtag('event', 'click_Unstake', {
        event_category: pool.id,
        event_label : pool.name
      })

      const tokens = pool.tokens
      const selectedToken = tokens[0]
      this.setState({ fieldid : ''})
      const amount = this.state[selectedToken.id + '_unstake']
      if(amount > 0){
        this.setState({ loading: true })
        dispatcher.dispatch({ type: WITHDRAW, content: { asset: selectedToken, amount: amount } })
      }else{
        this.setState({ fieldid : selectedToken.id + '_unstake'})
        this.setState({ amountStakeError: true })
        emitter.emit(ERROR, 'Please enter the amount on the Un-Stake field');
      }
   
  }

  onExit = () => {
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]

    window.gtag('event', 'click_Exit_Claim', {
      event_category: pool.id,
      event_label : pool.name
    })

    this.setState({ loading: true })
    dispatcher.dispatch({ type: EXIT, content: { asset: selectedToken } })
    
  }

  renderAssetInput = (asset, type) => {
    const {
      classes
    } = this.props

    const {
      loading,
      amountStakeError,
      fieldid
    } = this.state

    const amount = this.state[asset.id + '_' + type]
    let amountError = this.state[asset.id + '_' + type + '_error']
  

    return (
      <div className={ classes.valContainer } key={asset.id + '_' + type}>
        <div className={ classes.balances }>
          { type === 'stake' && <Typography variant='h4' onClick={ () => { this.setAmount(asset.id, type, (asset ? (Math.floor(asset.balance*1000000000)/1000000000).toFixed(9) : 0)) } }   color="error" className={ classes.value } noWrap>{ 'Max Balance: '+ ( asset && asset.balance ? (Math.floor(asset.balance*1000000000)/1000000000).toFixed(9) : '0.000000000') } { asset ? asset.symbol : '' }</Typography> }
          { type === 'unstake' && <Typography variant='h4' onClick={ () => { this.setAmount(asset.id, type, (asset ? (Math.floor(asset.stakedBalance*1000000000)/1000000000).toFixed(9) : 0)) } }   color="error" className={ classes.value } noWrap>{ 'Max Balance: '+ ( asset && asset.stakedBalance ? (Math.floor(asset.stakedBalance*1000000000)/1000000000).toFixed(9) : '0.000000000') } { asset ? asset.symbol : '' }</Typography> }
        </div>
        <div>
          <TextField
            fullWidth
            disabled={ loading }
            className={ (amountStakeError && fieldid ==  asset.id + '_' + type ? 'border-btn-error' : 'border-btn') }
            inputRef={ input =>input && fieldid ==  asset.id + '_' + type && amountStakeError && input.focus()}
            id={ '' + asset.id + '_' + type }
            value={ amount }
            error={ amountError }
            onChange={ this.onChange }
            placeholder="0.0000000"
           
            InputProps={{
              endAdornment: <InputAdornment position="end" className={ classes.inputAdornment }><Typography variant='h3' className={ '' }>{ asset.symbol }</Typography></InputAdornment>,
              startAdornment: <InputAdornment position="end" className={ classes.inputAdornment }>
                <div className={ classes.assetIcon }>
                  <img
                    alt=""
                    src={ require('../../assets/'+asset.symbol+'-logo.png') }
                    height="30px"
                  />
                </div>
              </InputAdornment>,
            }}
          />
        </div>
      </div>
    )
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState({amountStakeError : false})
    this.setState(val)
  }

  setAmount = (id, type, balance) => {
    const bal = (Math.floor((balance === '' ? '0' : balance)*1000000000)/1000000000).toFixed(9)
    let val = []
    val[id + '_' + type] = bal
    this.setState(val)
  }

}

export default withRouter(withStyles(styles)(Stake));
