import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
} from '@material-ui/core';
import { colors } from '../../theme'

import UnlockModal from '../unlock/unlockModal.jsx'
import RefreshIcon from '@material-ui/icons/Refresh';
import { Container, Col, Row, Button, Navbar, Nav, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import '../../assets/css/style.css';

import {
  ERROR,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  CONFIGURE,
  CONFIGURE_RETURNED
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
   /*  flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: colors.blue,
    minWidth: '100vw',
    padding: '36px 24px' */
  },
  connectHeading: {
    maxWidth: '300px',
    textAlign: 'center',
    color: colors.white,
    zIndex : 2
  },
  connectContainer: {
    padding: '20px',
    zIndex : 2
  },
  actionButton: {
    color: colors.white,
    borderColor: colors.white
  },
  notConnectedRoot: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex : 2
  },
  connectedRoot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    zIndex : 2
  },
  disclaimer: {
    padding: '12px',
    border: '1px solid '+colors.white,
    borderRadius: '0.75rem',
    marginBottom: '24px',
    fontWeight: 1,
    color: colors.white,
    zIndex : 2
  }
});

class Account extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')

    this.state = {
      loading: false,
      account: account,
      assets: store.getStore('assets'),
      modalOpen: false,
    }
  }
  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
  };

  connectionConnected = () => {
    // this.setState({ account: store.getStore('account') })
  };

  configureReturned = () => {
    // this.props.history.push('/')
  }

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account'), loading: false })
  }

  errorReturned = (error) => {
    //TODO: handle errors
  };

  render() {
    const { classes } = this.props;
    const {
      account,
      modalOpen,
    } = this.state

    return (
      <div className={ classes.root }>
        { this.renderNotConnected() }
        { modalOpen && this.renderModal() }
      </div>
    )
  };

  renderNotConnected = () => {
    const { classes } = this.props
    const { loading } = this.state

    return (
      <div className={ classes.notConnectedRoot }>
        <Typography variant={'h5'} className="text-white m-2">This project is in beta. Use at your own risk.</Typography>
        <div className={ classes.connectHeading }>
          <Typography variant='h3'>Connect your wallet to continue</Typography>
        </div>
        <div className={ classes.connectContainer }>
          <Button
            className="myButton"
            variant="outlined"
            color="primary"
            onClick={ this.unlockClicked }
            disabled={ loading }
            >
            <Typography>Connect</Typography>
          </Button>
        </div>
        <div className="text-center text-white w-100 fixed-bottom">
          © Copyright <strong>OPES.Finance.</strong> All Rights Reserved 
          </div>
      </div>
    )
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  unlockClicked = () => {
    this.setState({ modalOpen: true, loading: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false, loading: false })
  }
}

export default withRouter(withStyles(styles)(Account));
