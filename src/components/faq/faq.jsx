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
import { Container, Col, Row, Button, Navbar, Nav, Card, ListGroup, ListGroupItem, Accordion } from 'react-bootstrap';
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

class Faq extends Component {

    
    constructor(props) {
        super()
    
        const account = store.getStore('account')
      
        this.state = {
          loading: !(account),
          account: account,
        }
    
        dispatcher.dispatch({ type: GET_BALANCES, content: {} })
      
    
      }

      componentWillMount() {
        emitter.on(CONFIGURE_RETURNED, this.configureReturned);
    
      }
    
      componentWillUnmount() {
        emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
      };

      configureReturned = () => {
        this.setState({ loading: false })
      }
  
    render() {

        window.gtag('event', 'page_view', {
            page_location: '/faq',
          })

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
              (
                <Button
                className="smallBTN mb-2"
                variant="outlined"
                color="secondary"
                onClick={ () => {  
                    this.setState({ value: 'main' })
                    this.props.history.push('/staking')
                 } }
                >
                <Typography variant={ 'h4'}>Back</Typography>
                </Button>
              )

            }
          </Col>
        </Row>

        <Row className="mt-5">

            <Col lg="12" md="12" xs="12">


            <Accordion defaultActiveKey="0">
                <div className="rounded">
                    <div className="card-new-header p-2">
                        <Accordion.Toggle className="btn-new" style={{'cursor':'pointer'}} eventKey="0">
                            What is WPE?
                        </Accordion.Toggle>
                    </div>
                    <Accordion.Collapse eventKey="0">
                    <div className="card-new-body p-3">
                    OPES.Finance protocol was launched by the OPES Community to facilitate the phase one governance layer for the OPESChain. <br/><br/>
                    Using a unique Defi model, we will equitably distribute Wrapped PE (WPE) for voting rights to the people. 
                    These people will then vote on the first protocol to operate on the OPES Permission Blockchain. <br/><br/>
                    OPESChain will transform the Financial Industry as we know it, providing new life-changing opportunities to people worldwide.<br/>

                    </div>
                    </Accordion.Collapse>
                </div>



                <div className="rounded mt-2">
                    <div className="card-new-header p-2">
                        <Accordion.Toggle className="btn-new" style={{'cursor':'pointer'}} eventKey="1">
                            What is Seed Pool?
                        </Accordion.Toggle>
                    </div>
                    <Accordion.Collapse eventKey="1">
                    <div className="card-new-body p-3">
                    test

                    </div>
                    </Accordion.Collapse>
                </div>

                <div className="rounded mt-2">
                    <div className="card-new-header p-2">
                        <Accordion.Toggle className="btn-new" style={{'cursor':'pointer'}} eventKey="2">
                            What is Harvest Pool?
                        </Accordion.Toggle>
                    </div>
                    <Accordion.Collapse eventKey="2">
                    <div className="card-new-body p-3">
                    test

                    </div>
                    </Accordion.Collapse>
                </div>

                <div className="rounded mt-2">
                    <div className="card-new-header p-2">
                        <Accordion.Toggle className="btn-new" style={{'cursor':'pointer'}} eventKey="3">
                            What is Defi Index Pool?
                        </Accordion.Toggle>
                    </div>
                    <Accordion.Collapse eventKey="3">
                    <div className="card-new-body p-3">
                    test

                    </div>
                    </Accordion.Collapse>
                </div>

                <div className="rounded mt-2">
                    <div className="card-new-header p-2">
                        <Accordion.Toggle className="btn-new" style={{'cursor':'pointer'}} eventKey="4">
                            Who's in the Index Pool?
                        </Accordion.Toggle>
                    </div>
                    <Accordion.Collapse eventKey="4">
                    <div className="card-new-body p-3">
                    test

                    </div>
                    </Accordion.Collapse>
                </div>


            </Accordion>


            </Col>

        </Row>

        { modalOpen && this.renderModal() }

        </Container>
        <div className="text-center text-white w-100 bottom p-5">
          © Copyright <strong>OPES.Finance.</strong> All Rights Reserved 
          </div>
       
     </>
      
    )
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
    
export default withRouter(Faq)