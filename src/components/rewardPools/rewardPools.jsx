import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Grid
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

import UnlockModal from '../unlock/unlockModal.jsx'
import Store from "../../stores";
import { colors } from '../../theme'

import '../../assets/css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Row, Button, Navbar, Nav, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import Countdown from 'react-countdown-now';
import Web3 from 'web3';


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
    return <span>Rewards: ENDED</span>;
  } else {
    // Render a countdown
  return <span>Rewards Ends in {days} Day(s) {hours}:{minutes}:{seconds}</span>;
  }
};

const styles = theme => ({


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
  }
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
      value: 'main',
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
      <>
        <Container >
      
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
       
          <Col lg="3" md="12" xs="12" className="pt-2">
            {
              value ==='group-pools' &&  (
                <Button
                className="smallBTN mb-2"
                variant="outlined"
                color="secondary"
                onClick={ () => {  this.renderMain() } }
                >
                <Typography variant={ 'h4'}>Back</Typography>
                </Button>
              )

            }
          </Col>
        </Row>
        { value ==='main' && this.renderMainMenuContent() }
        { value ==='group-pools' && this.renderRewardsPools() }



        { modalOpen && this.renderModal() }
       

        </Container>
        <div className="text-center text-white w-100 bottom p-5">
          © Copyright <strong>OPES.Finance.</strong> All Rights Reserved 
          </div>
       
     </>
      
    )
  }

  renderMainMenuContent=()=>{
    return (
      <>
     
        <Row>
         
          <Col lg="12" md="12" xs="12" className="text-center">
          
            <div className="mb-2 textheader mt-5 display-4" ><br/>Enough is Enough</div>
            <div className="mb-5 text-white mb-1 " style={{'fontSize':'28px'}} ><br/>OPES is bringing equality to the World! </div>
          </Col>
          <Col lg="3" md="12" xs="12" className="p-1">
            
            { this.renderRewardPoolCard('yearn') }

          </Col>

          <Col lg="3" md="12" xs="12" className="p-1">

          { this.renderRewardPoolCard('boost') }

          </Col>

          <Col lg="3" md="12" xs="12" className="p-1">

          { this.renderRewardPoolCard('balancer-stake') }

          </Col>

          <Col lg="3" md="12" xs="12" className="p-1">

          { this.renderRewardPoolCard('balancer-pool') }

          </Col>
          <Col className="mt-1 text-center" lg="12" md="12" xs="12">
            <br/> <br/>
            <h4>Yield Farm the most powerful asset in the world. And use Beast Mode as an equalizer against the whales.</h4>
        <p>Add liquidity to earn fees and receive 8 Tokens rewards from 8 amazing REAL LONG TERM projects all from the same capital.</p>
       
            <Row>
              <Col lg="4" md="12" xs="12"></Col>
              <Col lg="4" md="12" xs="12">

              <table className="table">
                <tbody>
                  <tr><td>
                    <a className="myButtonSmall m-1"  href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b" target="_blank">BUY WPE TOKEN</a>
                  </td></tr>
                  <tr><td>
                    <a className="myButtonSmall m-1" 
                    
                    onClick = {async (event) => {
                      let provider  = new Web3(store.getStore('web3context').library.provider);
                      provider = provider.currentProvider;
                      provider.sendAsync({
                      method: 'metamask_watchAsset',
                      params: {
                        "type":"ERC20",
                        "options":{
                          "address": '0xd075e95423C5c4BA1E122CaE0f4CdFA19b82881b',
                          "symbol": 'WPE',
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
                    
                    >ADD WPE TOKEN to Metamask</a>
                  </td></tr>
                  <tr><td>
                    <br/>
                    <a className="myButtonSmall m-1"  href="https://app.uniswap.org/#/add/ETH/0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b" target="_blank">BUY UNI-V2 TOKEN</a>
                  </td></tr>
                  <tr><td>
                    <a className="myButtonSmall m-1"  href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x1f9840a85d5af5bf1d1762f925bdaddc4201f984" target="_blank">BUY UNI TOKEN</a>
                  </td></tr>
                </tbody>
              </table>

              </Col>
              <Col lg="4" md="12" xs="12"></Col>
            </Row>

        
        <br/> <br/>
        <br/> <br/>
          </Col>

        </Row>
      </>
    )
  };


  renderRewardPoolCard=(rewardName)=>{
    const { rewardPools } = this.state
    return rewardPools.filter((rewardPool) => {
      if([ rewardName] .includes(rewardPool.id) ) {
        return true
      }
    }).map((rewardPool) => {
      return (
        <>
             <Card className="showcursor" style={{ width: '100%' }} onClick={ () => { if(rewardPool.tokens.length > 0 && rewardPool.id !='balancer-pool') { this.navigateStake(rewardPool) }else{ this.renderGroupPools() } } }>
                <Card.Body>
                  <Card.Title> { rewardPool.name }</Card.Title>
                 {/*  <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle> */}
                 
                 { (rewardPool.id =='yearn' || rewardPool.id =='boost' ||rewardPool.id =='balancer-stake' ) && <ListGroup className="list-group-flush">
      <ListGroupItem>DEX : { rewardPool.website }</ListGroupItem>
                    <ListGroupItem>Weekly Rewards : 
      {' '}{ rewardPool.tokens[0].poolRatePerWeek }

                    </ListGroupItem>
                    <ListGroupItem>APR : </ListGroupItem>
                    <ListGroupItem>Liquidity : </ListGroupItem>
      </ListGroup> }

      { (rewardPool.id !='yearn' && rewardPool.id !='boost' && rewardPool.id !='balancer-stake' ) && <ListGroup className="list-group-flush">
                 
                  <ListGroupItem>DEX : { rewardPool.website }</ListGroupItem>
                                <ListGroupItem>&nbsp;</ListGroupItem>
                                <ListGroupItem>&nbsp;</ListGroupItem>
                                <ListGroupItem>&nbsp;</ListGroupItem>
                  </ListGroup> }
  
                  <div className="mt-1 myButton">
                    SELECT
                  </div>
                </Card.Body>
              </Card>
        </>
      );
    });
   
  };



  renderMainMenus=()=>{
    return (
      <Row>
          <Col  lg="4" md="12" xs="12" className="p-1">
            <div className="img-bg imgbg1 showcursor" onClick={ () => {  this.clickPool('yearn') } }  >
                { this.renderRewardsSelected('yearn') }
              </div> 
          </Col>
          <Col lg="8"  md="12" xs="12" className="p-1">
            <div className="img-bg imgbg2 showcursor" onClick={ () => {  this.clickPool('boost') } }>
            { this.renderRewardsSelected('boost') }
            </div> 
          </Col>
          <Col  lg="5" md="12" xs="12" className="p-1">
            <div className="img-bg imgbg3 showcursor" >
                { this.renderRewardsSelected('balancer-stake') }
              </div> 
          </Col>
          <Col lg="7"  md="12" xs="12" className="p-1">
            <div className="img-bg imgbg4 showcursor" onClick={ () => {  this.renderGroupPools() } }  >
            { this.renderRewardsSelected('balancer-pool') }
            </div> 
          </Col>
        </Row>
    )
  }

  renderMain=()=>{
    this.setState({ value: 'main' })
  }
  renderGroupPools=()=>{
    this.setState({ value: 'group-pools' })
  }

  renderRewardsPools = ()=>{
    return (
      <Row>
        <Col lg="12" md="12" xs="12">
        <br/><br/> <br/><br/><br/><br/>

        <Row >
          <Col lg="1" md="12" xs="12"></Col>
          <Col lg="3" md="12" xs="12"></Col>
          <Col lg="2" md="12" xs="12" className=" text-white p-2"><strong>Total Deposited</strong></Col>
          <Col lg="1" md="12" xs="12" className=" text-white p-2"><strong>PoolCoin/Week</strong></Col>
          <Col lg="1" md="12" xs="12"></Col>
          <Col lg="1" md="12" xs="12"></Col>
          <Col lg="1" md="12" xs="12"></Col>
          <Col lg="2" md="12" xs="12"></Col>
        </Row>
        <Row className="tableRowStyle">{ this.renderRewardsGroupSelected('group1') }</Row>
        <Row className="tableRowStyle">{ this.renderRewardsGroupSelected('group2') }</Row>
        <Row className="tableRowStyle">{ this.renderRewardsGroupSelected('group3') }</Row>
        <Row className="tableRowStyle ">{ this.renderRewardsGroupSelected('group4') }</Row>
        <Row className="tableRowStyle">{ this.renderRewardsGroupSelected('group5') }</Row>
        <Row className="tableRowStyle">{ this.renderRewardsGroupSelected('group6') }</Row>
        <Row className="tableRowStyle">{ this.renderRewardsGroupSelected('group7') }</Row>

       <br/><br/><br/>
        </Col>
      </Row>
    )
  }


 

  clickPool(poolname){
    const { rewardPools } = this.state
    rewardPools.filter((rewardPool) => {
      if([poolname].includes(rewardPool.id) ) {
        this.navigateStake(rewardPool);
      }
    })
  }

  renderGroupBalance = ()=>{
    const { rewardPools, governanceContractVersion } = this.state
    let totalBalance = 0
    rewardPools.filter((rewardPool) => {
      if(['group1','group2','group3','group4','group5','group6','group7'] .includes(rewardPool.id) ) {
        totalBalance +=  Number(parseFloat(rewardPool.tokens[0].stakedBalance).toFixed(2));
      }
    })
    totalBalance = totalBalance.toFixed(2)
    return (
      <div>
        <p>Total deposited: { totalBalance }
            <br></br>
            Pool Rate: {  rewardPools[0].tokens[0].poolRatePerWeek ?  rewardPools[0].tokens[0].poolRatePerWeek.toLocaleString(navigator.language, { maximumFractionDigits : 2 }) : "0.00" } WPE/week
            <br></br>
              <Countdown
                 date={new Date(rewardPools[0].tokens[0].rewardsEndDate['year'],rewardPools[0].tokens[0].rewardsEndDate['month'],
                 rewardPools[0].tokens[0].rewardsEndDate['day'],rewardPools[0].tokens[0].rewardsEndDate['hour'],rewardPools[0].tokens[0].rewardsEndDate['minute'])}
                renderer={countdownrenderer}
                daysInHours={true}
              />
            </p>
          
      </div>
    )
  }

  renderRewardsGroupSelected = (rewards_name)=>{
    const { rewardPools, governanceContractVersion } = this.state
    return rewardPools.filter((rewardPool) => {
      if([ rewards_name] .includes(rewardPool.id) ) {
        return true
      }
    }).map((rewardPool) => {
      return this.renderRewardPoolGroupSelected(rewardPool)
    })
  }
  renderRewardPoolGroupSelected = (rewardPool)=>{
    const { classes } = this.props

    var address = null;
    let addy = ''
    if (rewardPool.tokens && rewardPool.tokens[0]) {
      addy = rewardPool.tokens[0].rewardsAddress
      address = addy.substring(0,6)+'...'+addy.substring(addy.length-4,addy.length)
    }

    return (
      <>
        <Col lg="1" md="12" xs="12" className="text-center my-auto">
        { 
            <img
            alt=""
            src={ require('../../assets/'+rewardPool.id+'.png') }
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          }
        </Col>
          <Col lg="3" md="12" xs="12" className="rowTitle text-white p-2 my-auto">
          <h6><strong>{ rewardPool.name }</strong></h6>
          </Col>
          <Col lg="2" md="12" xs="12" className=" text-white p-2 my-auto">
          <span class="mob float-left">Staked Balance : </span>{ rewardPool.tokens[0].stakedBalance ? rewardPool.tokens[0].stakedBalance.toFixed(rewardPool.displayDecimal) : "0.0000" }
         
          </Col>
          <Col lg="1" md="12" xs="12" className=" text-white text-right p-2 my-auto">
          <span class="mob float-left">Pool Rate WPE/Week : </span>{ rewardPool.tokens[0].poolRatePerWeek ?  rewardPool.tokens[0].poolRatePerWeek.toLocaleString(navigator.language, { maximumFractionDigits : 2 }) : "0.00" }
          </Col>
          <Col lg="1" md="12" xs="12" className=" text-white p-2 my-auto text-center">
         {/*  <Countdown
                 date={new Date(rewardPool.tokens[0].rewardsEndDate['year'],rewardPool.tokens[0].rewardsEndDate['month'],
                 rewardPool.tokens[0].rewardsEndDate['day'],rewardPool.tokens[0].rewardsEndDate['hour'],rewardPool.tokens[0].rewardsEndDate['minute'])}
                renderer={countdownrenderer}
                daysInHours={true}
              /> */}
              
          </Col>
          <Col lg="1" md="12" xs="12" className=" text-white p-2 my-auto">
          <a href={rewardPool.link} target="_blank" className="smallBTN small">BUY</a>
          </Col>
          <Col lg="1" md="12" xs="12" className=" text-white p-2 my-auto">
          <div className="smallBTN small"  onClick={ () => { if(rewardPool.tokens.length > 0) { this.navigateStake(rewardPool) } } } >STAKE</div>
          </Col>
          <Col lg="2" md="12" xs="12" className=" text-white p-2 my-auto">
          <div className="smallBTN text-center small"
          
          onClick = {async (event) => {
            let provider  = new Web3(store.getStore('web3context').library.provider);
            provider = provider.currentProvider;
            provider.sendAsync({
            method: 'metamask_watchAsset',
            params: {
              "type":"ERC20",
              "options":{
                "address": rewardPool.tokenAddress,
                "symbol": rewardPool.tokenSymbol,
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
          
          >Add Token to Metamask</div>
          </Col>
      </>
     
    
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
      <div key={ rewardPool.id } >
        <div className="probootstrap-photo-upper" >
            <p>Total deposited: { rewardPool.tokens[0].stakedBalance ? rewardPool.tokens[0].stakedBalance.toFixed(4) : "0.0000" }</p>
            <p>Pool Rate: {  rewardPool.tokens[0].poolRatePerWeek ?  rewardPool.tokens[0].poolRatePerWeek.toLocaleString(navigator.language, { maximumFractionDigits : 2 }) : "0.00" } { rewardPool.tokens[0].poolRateSymbol }</p>
            <p>
              <Countdown
                date={new Date(rewardPool.tokens[0].rewardsEndDate['year'],rewardPool.tokens[0].rewardsEndDate['month'],
                rewardPool.tokens[0].rewardsEndDate['day'],rewardPool.tokens[0].rewardsEndDate['hour'],rewardPool.tokens[0].rewardsEndDate['minute'])}
                renderer={countdownrenderer}
                daysInHours={true}
              />
            </p>
        </div>
        { !['balancer-pool'].includes(rewardPool.id) && <div className="probootstrap-photo-details">
            <h2 className="showcursor"  onClick={ () => { if(rewardPool.tokens.length > 0) { this.navigateStake(rewardPool) } } }>{ rewardPool.name }</h2>
            <p><a href={ rewardPool.link } target="_blank">{ rewardPool.website }</a></p>
            <p>Contract Address: <a href={ 'https://etherscan.io/address/'+addy } target="_blank">{ address }</a>.</p>
          </div>
        }
        { ['balancer-pool'].includes(rewardPool.id) && <div className="probootstrap-photo-details">
            <h2 className="showcursor"  onClick={ () => { if(rewardPool.tokens.length > 0) { this.renderGroupPools() } } }>{ rewardPool.name }</h2>
            <p><a href={ rewardPool.link } target="_blank">{ rewardPool.website }</a></p>
            <p>Contract Address: <a href={ 'https://etherscan.io/address/'+addy } target="_blank">{ address }</a>.</p>
          </div>
        }
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
