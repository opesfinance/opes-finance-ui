import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Card,
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
import { Container, Col, Row, Button } from 'react-bootstrap';
import Countdown from 'react-countdown-now';



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
    return <span>Rewards Ended</span>;
  } else {
    // Render a countdown
  return <span>Rewards Ends in {days} Day(s) {hours}:{minutes}:{seconds}</span>;
  }
};

const styles = theme => ({
  root: {
   
    maxWidth: '900px',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '0px'
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  introCenter: {
    minWidth: '100%',
    textAlign: 'center',
    padding: '48px 0px'
  },
  investedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    minWidth: '100%',
    [theme.breakpoints.up('md')]: {
      minWidth: '800px',
    }
  },
  connectContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '450',
    }
  },
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    marginBottom: '24px',
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flex: 1,
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    alignItems: 'center',
    maxWidth: '500px',
    [theme.breakpoints.up('md')]: {
      width: '100%'
    }
  },
  walletAddress: {
    padding: '0px 12px'
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray
  },
  overview: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    alignItems: 'center',
    marginTop: '40px',
    width: '100%',
    background: colors.white
  },
  overviewField: {
    display: 'flex',
    flexDirection: 'column'
  },
  overviewTitle: {
    color: colors.darkGray
  },
  overviewValue: {

  },
  actions: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '900px',
    flexWrap: 'wrap',
   /*  background: colors.white, */
   /*  border: '1px solid '+colors.borderBlue, */
    padding: '28px 30px',
    borderRadius: '10px',
   /*  marginTop: '40px' */
  },
  actionsBoost: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '900px',
    flexWrap: 'wrap',
    background: colors.white,
    border: '1px solid '+colors.borderBlue,
    padding: '15px 15px',
    borderRadius: '10px',
    marginTop: '5px'
  },
  actionContainer: {
    minWidth: 'calc(50% - 40px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px'
  },
  primaryButton: {
    '&:hover': {
      backgroundColor: "#2F80ED",
    },
    padding: '20px 32px',
    backgroundColor: "#2F80ED",
    borderRadius: '50px',
    fontWeight: 500,
  },
  actionButton: {
    padding: '20px 32px',
    borderRadius: '10px',
  },
  buttonText: {
    fontWeight: '700',
  },
  stakeButtonText: {
    fontWeight: '700',
    color: 'white',
  },
  valContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
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
  stakeTitle: {
    width: '100%',
    color: colors.darkGray,
    marginBottom: '20px'
  },
  stakeButtons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    align: 'center',
    marginTop: '20px'
  },
  stakeButton: {
    minWidth: '300px'
  },
  requirement: {
    display: 'flex',
    alignItems: 'center'
  },
  check: {
    paddingTop: '6px'
  },
  voteLockMessage: {
    margin: '20px'
  },
  title: {
    width: '100%',
    color: colors.darkGray,
    minWidth: '100%',
    marginLeft: '20px'
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
      <Container>
        <Row>
          <Col lg="4" md="12" xs="12" >
            <h2>
            <img 
               src={ require('../../assets/img/opeslogo.jpg') }
               width="25px" height="25px"/>
               OPES Finance</h2>
              <p>This project is in beta. Use at your own risk.</p>   

          </Col>
          <Col lg="4" md="12" xs="12" >
              <div className="showcursor" onClick={this.overlayClicked }>
                <Typography variant={ 'h3'} className={ classes.walletTitle } noWrap>Wallet</Typography>
                <Typography variant={ 'h4'} className={ classes.walletAddress } noWrap>{ address }</Typography>
                <div style={{ background: '#DC6BE5', opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}></div>
              </div>

          </Col>
          <Col lg="4" md="12" xs="12" className="text-center">
          <Button
            className="btn btn-outline-info pl-5 pr-5"
            variant="outlined"
            color="secondary"
            disabled={ loading }
            onClick={ () => {  this.props.history.push('/staking') } }
          >
            <Typography variant={ 'h4'}>Back</Typography>
          </Button>

          </Col>
        </Row>

      

        <Row>
          <Col lg="4" md="12" xs="12"></Col>
          <Col lg="4" md="12" xs="12">

          <div className="text-center p-3">
            <h4 className="bg-info p-2 rounded text-white" >{ pool.name }</h4>
              <p>Total deposited: { pool.tokens[0].stakedBalance ? pool.tokens[0].stakedBalance.toFixed(2) : "0" }
              <br></br>
              Pool Rate: {  pool.tokens[0].poolRatePerWeek ?  pool.tokens[0].poolRatePerWeek.toLocaleString(navigator.language, { maximumFractionDigits : 2 }) : "0.00" } WPE/week
              <br></br>
                <Countdown
                  date={new Date(pool.tokens[0].rewardsEndDate)}
                  renderer={countdownrenderer}
                  daysInHours={true}
                />
              </p>
          </div>

          </Col>
          <Col lg="4" md="12" xs="12"></Col>
        </Row>




       <Row>
         <Col lg='2' md="12" xs="12"></Col>
         <Col lg='8' md="12" xs="12">
          
           <Row>
            <Col lg="3" md="12" xs="12">
                <h4>Your Balance</h4>
                <p>{ pool.tokens[0].balance ? pool.tokens[0].balance.toFixed(2) : "0" }  { pool.tokens[0].symbol }</p>
            </Col>
            <Col lg="3" md="12" xs="12">
                <h4>Currently Staked</h4>
                <p>{ pool.tokens[0].stakedBalance ? pool.tokens[0].stakedBalance.toFixed(2) : "0" }</p>
            </Col>
            <Col lg="3" md="12" xs="12">
                  <h4>Beast Mode X</h4>
                  <p>{ pool.tokens[0].currentActiveBooster ? pool.tokens[0].currentActiveBooster.toFixed(2) : "0" }</p>
            </Col>
            <Col lg="3" md="12" xs="12">
                <h4>Rewards Available</h4>
                <p>{ pool.tokens[0].rewardsSymbol == '$' ? pool.tokens[0].rewardsSymbol : '' } { pool.tokens[0].rewardsAvailable ? pool.tokens[0].rewardsAvailable.toFixed(2) : "0" } { pool.tokens[0].rewardsSymbol != '$' ? pool.tokens[0].rewardsSymbol : '' }</p>
            </Col>
          </Row>
           
         </Col>
         <Col lg='2' md="12" xs="12"></Col>
       </Row>

        { value === 'options' && this.renderOptions() }
        { value === 'stake' && this.renderStake() }
        { value === 'buyboost' && this.renderBuyBoost() }
        { value === 'claim' && this.renderClaim() }
        { value === 'unstake' && this.renderUnstake() }
        { value === 'exit' && this.renderExit() }

        { snackbarMessage && this.renderSnackbar() }
        { loading && <Loader /> }
      </Container>
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
          <Col lg='2' md="12" xs="12"></Col>
          <Col lg='8' md="12" xs="12">
      <div className={ classes.actions } >
        <Typography className={ classes.stakeTitle } variant={ 'h3'}>Beast Mode</Typography>
      {/*   { this.renderAssetInput(asset, 'unstake') } */}

      <div className={ classes.actionsBoost }>
          <Typography  variant={ 'h5'}>{ pool.tokens[0].boostTokenSymbol} Token Balance : </Typography>
          <Typography variant={ 'h5' } className={ classes.overviewValue }> { pool.tokens[0].boostBalance ? pool.tokens[0].boostBalance.toFixed(2) : "0" } UNI</Typography>
      </div>

      <div className={ classes.actionsBoost }>
          <Typography  variant={ 'h5'}>Cost of Beast Mode : </Typography>
          <Typography variant={ 'h5' } className={ classes.overviewValue }>{ pool.tokens[0].costBooster ? pool.tokens[0].costBooster.toFixed(2) : "0" } UNI</Typography>
      </div>

      <div className={ classes.actionsBoost }>
          <Typography  variant={ 'h5'}>Cost of Beast Mode (USD) : </Typography>
          <Typography variant={ 'h5' } className={ classes.overviewValue }>$ { pool.tokens[0].costBoosterUSD ? pool.tokens[0].costBoosterUSD.toFixed(2) : "0.00" } </Typography>
      </div>
      <div className={ classes.actionsBoost }>
	          <Typography  variant={ 'h5'}>Time to next BEAST powerup : </Typography>
	          <Typography variant={ 'h5' } className={ classes.overviewValue }>{ (pool.tokens[0].timeToNextBoost -(new Date().getTime())/1000) > 0 ? ((pool.tokens[0].timeToNextBoost - (new Date().getTime())/1000)/60).toFixed(0) : "0" } Minutes</Typography>
	      </div>

      <div className={ classes.actionsBoost }>
          <Typography  variant={ 'h5'}>Beast Modes currently active : </Typography>
          <Typography variant={ 'h5' } className={ classes.overviewValue }>{ pool.tokens[0].currentActiveBooster ? pool.tokens[0].currentActiveBooster.toFixed(2) : "0" }</Typography>
      </div>

      <div className={ classes.actionsBoost }>
          <Typography  variant={ 'h5'}>Current Beast Mode stake value : </Typography>
          <Typography variant={ 'h5' } className={ classes.overviewValue }>{ pool.tokens[0].currentBoosterStakeValue ? pool.tokens[0].currentBoosterStakeValue.toFixed(2) : "0" } UNI-v2</Typography>
      </div>

      <div className={ classes.actionsBoost }>
          <Typography  variant={ 'h5'}>Staked value after next Beast Mode : </Typography>
          <Typography variant={ 'h5' } className={ classes.overviewValue }> { pool.tokens[0].stakeValueNextBooster ? pool.tokens[0].stakeValueNextBooster.toFixed(2) : "0" } UNI-v2</Typography>
      </div>

       
         
       

      </div>
      <Row className="mb-5">
         <Col lg='6' md="12" sm="12">
         <Button
            className="btn btn-outline-info btn-block"
            variant="outlined"
            color="secondary"
            disabled={ loading }
            onClick={ () => {  this.navigateInternal('options') } }
          >
             <Typography variant={ 'h4'}>Back</Typography>
          </Button>
         </Col>
         <Col lg='6' md="12" sm="12">
         <Button
             className="btn btn-info  btn-block"
            variant="outlined"
            color="secondary"
            disabled={ (pool.id === 'Governance' ? (loading || voteLockValid ) : loading  ) || pool.tokens[0].disableBoost}
            onClick={ () => { this.validateBoost() } }
          >
            <Typography variant={ 'h4'}>Beast Mode</Typography>
          </Button>
         </Col>
       </Row>
        
      </Col>
      <Col lg='2' md="12" xs="12"></Col>
      </Row>      

    )
  }
  validateBoost = () => {
    const { loading, pool, voteLockValid } = this.state
    if(pool.tokens[0].costBooster > pool.tokens[0].boostBalance){
        alert("insufficient funds to activate Beast Mode")
    } else if((pool.tokens[0].timeToNextBoost -(new Date().getTime())/1000) > 0){
        alert("Too soon to activate BEAST Mode again")
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

    this.setState({ loading: true })
    dispatcher.dispatch({ type: BOOST_STAKE, content: { asset: selectedToken, amount: amount } })
  }

  onStake = () => {
    this.setState({ amountError: false })
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]
    const amount = this.state[selectedToken.id + '_stake']

    // if(amount > selectedToken.balance) {
    //   return false
    // }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: STAKE, content: { asset: selectedToken, amount: amount } })
  }

  onClaim = () => {
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]

    this.setState({ loading: true })
    dispatcher.dispatch({ type: GET_REWARDS, content: { asset: selectedToken } })
  }

  onUnstake = () => {
    this.setState({ amountError: false })
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]
    const amount = this.state[selectedToken.id + '_unstake']
    //
    // if(amount > selectedToken.balance) {
    //   return false
    // }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: WITHDRAW, content: { asset: selectedToken, amount: amount } })
  }

  onExit = () => {
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]

    this.setState({ loading: true })
    dispatcher.dispatch({ type: EXIT, content: { asset: selectedToken } })
  }

  renderAssetInput = (asset, type) => {
    const {
      classes
    } = this.props

    const {
      loading
    } = this.state

    const amount = this.state[asset.id + '_' + type]
    const amountError = this.state[asset.id + '_' + type + '_error']

    return (
      <div className={ classes.valContainer } key={asset.id + '_' + type}>
        <div className={ classes.balances }>
          { type === 'stake' && <Typography variant='h4' onClick={ () => { this.setAmount(asset.id, type, (asset ? asset.balance : 0)) } }   color="error" className={ classes.value } noWrap>{ 'Balance: '+ ( asset && asset.balance ? (Math.floor(asset.balance*10000)/10000).toFixed(4) : '0.0000') } { asset ? asset.symbol : '' }</Typography> }
          { type === 'unstake' && <Typography variant='h4' onClick={ () => { this.setAmount(asset.id, type, (asset ? asset.stakedBalance : 0)) } }   color="error" className={ classes.value } noWrap>{ 'Balance: '+ ( asset && asset.stakedBalance ? (Math.floor(asset.stakedBalance*10000)/10000).toFixed(4) : '0.0000') } { asset ? asset.symbol : '' }</Typography> }
        </div>
        <div>
          <TextField
            fullWidth
            disabled={ loading }
            className="border-btn"
            id={ '' + asset.id + '_' + type }
            value={ amount }
            error={ amountError }
            onChange={ this.onChange }
            placeholder="0.00"
           
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
    this.setState(val)
  }

  setAmount = (id, type, balance) => {
    const bal = (Math.floor((balance === '' ? '0' : balance)*10000)/10000).toFixed(4)
    let val = []
    val[id + '_' + type] = bal
    this.setState(val)
  }

}

export default withRouter(withStyles(styles)(Stake));
