import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Card,
  Grid
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

import UnlockModal from '../unlock/unlockModal.jsx'
import Store from "../../stores";
import { colors } from '../../theme'

import '../../assets/css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Row } from 'react-bootstrap';
import Countdown from 'react-countdown-now';



import {
  ERROR,
  CONFIGURE_RETURNED,
  GET_BALANCES,
  GET_BALANCES_RETURNED,
  GOVERNANCE_CONTRACT_CHANGED,
  GET_BOOSTEDBALANCES_RETURNED,
  GET_BOOSTEDBALANCES
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
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
   
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '40px'
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '400px'
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
  actionButton: {
    '&:hover': {
      backgroundColor: "#2F80ED",
    },
    padding: '12px',
    backgroundColor: "#2F80ED",
    borderRadius: '1rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
  },
  buttonText: {
    fontWeight: '700',
    color: 'white',
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
  rewardPools: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
  
    flexWrap: 'wrap'
  },
  rewardPoolContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    margin: '20px',
    background: colors.white,
    minHeight: '300px',
    minWidth: '200px',
  },
  title: {
    width: '100%',
    color: colors.darkGray,
    minWidth: '100%',
    marginLeft: '20px'
  },
  poolName: {
    paddingBottom: '20px',
    color: colors.text
  },
  tokensList: {
    color: colors.darkGray,
    paddingBottom: '20px',
  },
  poolWebsite: {
    color: colors.darkGray,
    paddingBottom: '20px',
    textDecoration: 'none'
  },




  rewardPoolContainerBox: {
    paddingLeft : '10%',
    flexDirection: 'column',  
    flex: 1,
    background: colors.white,
    minHeight: '60px',
    minWidth: '40%',
  },
  rewardPoolContainerBoxRight: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'left',
    flex: 1,
    background: colors.white,
    minHeight: '60px',
    minWidth: '60%',
    paddingRight : '10%',
  },
  rewardPoolContainerBox1Row2: {
    paddingLeft : '130px',
    flexDirection: 'column',  
    flex: 1,
    background: colors.white,
    minHeight: '60px',
    minWidth: '400px',
  },
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class RewardPools extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    const governanceContractVersion = store.getStore('governanceContractVersion')
    const rewardPools = store.getStore('rewardPools')

    this.state = {
      rewardPools: rewardPools,
      loading: !(account && rewardPools),
      account: account,
      governanceContractVersion: governanceContractVersion
    }

    dispatcher.dispatch({ type: GET_BALANCES, content: {} })
    dispatcher.dispatch({ type: GET_BOOSTEDBALANCES, content: {} })

  }

  componentWillMount() {
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
    emitter.on(GOVERNANCE_CONTRACT_CHANGED, this.setGovernanceContract);
    emitter.on(GET_BOOSTEDBALANCES_RETURNED, this.balancesReturned);

  }

  componentWillUnmount() {
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
    emitter.removeListener(GOVERNANCE_CONTRACT_CHANGED, this.setGovernanceContract);
    emitter.removeListener(GET_BOOSTEDBALANCES_RETURNED, this.balancesReturned);
  };

  setGovernanceContract = () => {
    this.setState({ governanceContractVersion: store.getStore('governanceContractVersion') })
  }

  balancesReturned = () => {
    const rewardPools = store.getStore('rewardPools')
    this.setState({ rewardPools: rewardPools })
  }
  boostInfoReturned = () => {
    const rewardPools = store.getStore('rewardPools')
    this.setState({ rewardPools: rewardPools })
  }
  configureReturned = () => {
    this.setState({ loading: false })
  }

  render() {
    const { classes } = this.props;
    const {
      value,
      account,
      loading,
      modalOpen
    } = this.state

    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    return (

      <Container>
        <Row>
          <Col lg="6" md="12" xs="12">
          <h2>
          <img 
               src={ require('../../assets/img/opeslogo.jpg') }
               width="25px" height="25px"/>
               OPES Finance</h2>
              <p>This project is in beta. Use at your own risk.</p>   
          </Col>
          <Col lg="6" md="12" xs="12">
            <div className="showcursor" onClick={this.overlayClicked }>
                <Typography variant={ 'h3'} className={ classes.walletTitle } noWrap>Wallet</Typography>
                <Typography variant={ 'h4'} className={ classes.walletAddress } noWrap>{ address }</Typography>
                <div style={{ background: '#DC6BE5', opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}></div>
              </div>
          </Col>
        </Row>
        <Row>
          <Col  lg="4" md="12" xs="12">
            <div className="img-bg imgbg1" >
                { this.renderRewardsSelected('yearn') }
              </div> 
          </Col>
          <Col lg="8"  md="12" xs="12">
            <div className="img-bg imgbg2" >
            { this.renderRewardsSelected('boost') }
            </div> 
          </Col>
        </Row>
        { modalOpen && this.renderModal() }
      </Container>
     
      
    )
  }



  renderRewardsSelected = (rewards_name)=>{
    const { rewardPools, governanceContractVersion } = this.state
    return rewardPools.filter((rewardPool) => {
      if([ rewards_name] .includes(rewardPool.id) ) {
        return true
      }
    }).map((rewardPool) => {
      return this.renderRewardPoolSelected(rewardPool)
    })
  }

  renderRewardPoolSelected = (rewardPool)=>{
    const { classes } = this.props

    var address = null;
    let addy = ''
    if (rewardPool.tokens && rewardPool.tokens[0]) {
      addy = rewardPool.tokens[0].rewardsAddress
      address = addy.substring(0,6)+'...'+addy.substring(addy.length-4,addy.length)
    }

    return (
      <div key={ rewardPool.id }>
        <div className="probootstrap-photo-upper">
            <p>Total deposited: { rewardPool.tokens[0].stakedBalance ? rewardPool.tokens[0].stakedBalance.toFixed(2) : "0" }</p>
            <p>Pool Rate: {  rewardPool.tokens[0].poolRatePerWeek ?  rewardPool.tokens[0].poolRatePerWeek.toLocaleString(navigator.language, { maximumFractionDigits : 2 }) : "0.00" } WPE/week</p>
            <p>
              <Countdown
                date={new Date(rewardPool.tokens[0].rewardsEndDate)}
                renderer={countdownrenderer}
                daysInHours={true}
              />
            </p>
        </div>
        <div className="probootstrap-photo-details">
            <h2 className="showcursor"  onClick={ () => { if(rewardPool.tokens.length > 0) { this.navigateStake(rewardPool) } } }>{ rewardPool.name }</h2>
            <p><a href={ rewardPool.link } target="_blank">{ rewardPool.website }</a></p>
            <p>Contract Address: <a href={ 'https://etherscan.io/address/'+addy } target="_blank">{ address }</a>.</p>
        </div>
      </div>
    
    )
  }



  navigateStake = (rewardPool) => {
    store.setStore({ currentPool: rewardPool })

    this.props.history.push('/stake')
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

}

export default withRouter(withStyles(styles)(RewardPools));
