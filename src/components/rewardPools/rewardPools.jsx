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
import '../../assets/css/hover-css/hover-min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Row, Button, Navbar, Nav, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
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
                className="btn btn-outline-info btn-block mb-2"
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
        <div className="text-center text-white w-100 fixed-bottom">
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
          
            <div className="mb-2 textheader mt-5 dheader" ><br/>Enough is Enough</div>
            <div className="mb-5 text-white mb-1 dsubheader" ><br/>OPES is bringing equality to the World! </div>
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
          <Col className="mt-1" lg="12" md="12" sx="12">
            <br/> <br/>
            <h4>Honest worker? Explore Farming Opportunities</h4>
        <p>Add liquidity to earn fees and Wrapped PE incentives</p>
       
        <table>
          <tbody>
            <tr>
              <td style={{color:'#FFFFFF'}}>WPE TOKEN</td>
              <td>
              <a className="smallBTN m-1"  href="#" target="_blank">BUY</a>
              </td>
            </tr>
            <tr>
              <td  style={{color:'#FFFFFF'}}>UNI-V2 TOKEN</td>
              <td>
              <a className="smallBTN m-1"  href="#" target="_blank">BUY</a>
              </td>
            </tr>
            <tr>
              <td  style={{color:'#FFFFFF'}}>UNI TOKEN</td>
              <td>
              <a className="smallBTN m-1"  href="#" target="_blank">BUY</a>
              </td>
            </tr>
          </tbody>
        </table>
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
                 
                  <ListGroup className="list-group-flush">
      <ListGroupItem>DEX : { rewardPool.website }</ListGroupItem>
                    <ListGroupItem>Weekly Rewards : 

                    {/* <Countdown
                      date={new Date(rewardPool.tokens[0].rewardsEndDate['year'],rewardPool.tokens[0].rewardsEndDate['month'],
                      rewardPool.tokens[0].rewardsEndDate['day'],rewardPool.tokens[0].rewardsEndDate['hour'],rewardPool.tokens[0].rewardsEndDate['minute'])}
                      renderer={countdownrenderer}
                      daysInHours={true}
                    /> */}

                    </ListGroupItem>
                    <ListGroupItem>APR : </ListGroupItem>
                    <ListGroupItem>Liquidity : </ListGroupItem>
                  </ListGroup>
  
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
        <table className="table newtable">
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th>Total Deposited</th>
                <th>Pool Rate WPE/Week</th>
                <th></th>
                <th></th>
                <th></th>
                
              </tr>
            </thead>
            <tbody>
            { this.renderRewardsGroupSelected('group1') }
            { this.renderRewardsGroupSelected('group2') }
            { this.renderRewardsGroupSelected('group3') }
            { this.renderRewardsGroupSelected('group4') }
            { this.renderRewardsGroupSelected('group5') }
            { this.renderRewardsGroupSelected('group6') }
            { this.renderRewardsGroupSelected('group7') }
            </tbody>
        </table>
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
      <tr>
        <td style={{width:'30px'}}>
          { (rewardPool.id =='group4' || rewardPool.id =='group1'  || rewardPool.id =='group7') &&
            <img
            alt=""
            src={ require('../../assets/'+rewardPool.id+'.png') }
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          }
        </td>
        <td className="text-left"><h6><strong>{ rewardPool.name }</strong></h6></td>     
        <td>{ rewardPool.tokens[0].stakedBalance ? rewardPool.tokens[0].stakedBalance.toFixed(2) : "0" }</td>
        <td>{ rewardPool.tokens[0].poolRatePerWeek ?  rewardPool.tokens[0].poolRatePerWeek.toLocaleString(navigator.language, { maximumFractionDigits : 2 }) : "0.00" }</td>
        <td>
        <Countdown
                 date={new Date(rewardPool.tokens[0].rewardsEndDate['year'],rewardPool.tokens[0].rewardsEndDate['month'],
                 rewardPool.tokens[0].rewardsEndDate['day'],rewardPool.tokens[0].rewardsEndDate['hour'],rewardPool.tokens[0].rewardsEndDate['minute'])}
                renderer={countdownrenderer}
                daysInHours={true}
              />
        </td>
        <td><a href={rewardPool.link} target="_blank" className="smallBTN">BUY</a></td>
        <td><div className="smallBTN"  onClick={ () => { if(rewardPool.tokens.length > 0) { this.navigateStake(rewardPool) } } } >STAKE</div></td>
      </tr>
    
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
            <p>Total deposited: { rewardPool.tokens[0].stakedBalance ? rewardPool.tokens[0].stakedBalance.toFixed(2) : "0" }</p>
            <p>Pool Rate: {  rewardPool.tokens[0].poolRatePerWeek ?  rewardPool.tokens[0].poolRatePerWeek.toLocaleString(navigator.language, { maximumFractionDigits : 2 }) : "0.00" } WPE/week</p>
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
