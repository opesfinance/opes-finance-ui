import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {
  Switch,
  Route
} from "react-router-dom";
import IpfsRouter from 'ipfs-react-router'

import './i18n';
import interestTheme from './theme';

import Account from './components/account';
import Footer from './components/footer';
import Home from './components/home';
import Stake from './components/stake';
import RewardsPools from './components/rewardPools';
import Header from './components/header';
import Propose from './components/propose';
import Claim from './components/claim';
import Vote from './components/vote';
import VersionToggle from './components/versionToggle';
import Lock from './components/lock';

import Particles from 'react-particles-js';
import './assets/css/style.css';
import {
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  CONFIGURE,
  CONFIGURE_RETURNED,
  GET_BALANCES_PERPETUAL,
  GET_BALANCES_PERPETUAL_RETURNED
} from './constants'

import { injected } from "./stores/connectors";

import Store from "./stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class App extends Component {
  state = {
    account: null,
    headerValue: null
  };

  setHeaderValue = (newValue) => {
    this.setState({ headerValue: newValue })
  };

  componentWillMount() {
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
    emitter.on(GET_BALANCES_PERPETUAL_RETURNED, this.getBalancesReturned);

    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        injected.activate()
        .then((a) => {
          store.setStore({ account: { address: a.account }, web3context: { library: { provider: a.provider } } })
          emitter.emit(CONNECTION_CONNECTED)
          console.log(a)
        })
        .catch((e) => {
          console.log(e)
        })
      } else {

      }
    });
  }

  componentWillUnmount() {
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
    emitter.removeListener(GET_BALANCES_PERPETUAL_RETURNED, this.getBalancesReturned);
  };

  getBalancesReturned = () => {
    window.setTimeout(() => {
      dispatcher.dispatch({ type: GET_BALANCES_PERPETUAL, content: {} })
    }, 300000)
  }

  configureReturned = () => {
    dispatcher.dispatch({ type: GET_BALANCES_PERPETUAL, content: {} })
  }

  connectionConnected = () => {
    this.setState({ account: store.getStore('account') })
    dispatcher.dispatch({ type: CONFIGURE, content: {} })
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  }

  render() {

    const { headerValue, account } = this.state

    return (
      <MuiThemeProvider theme={ createMuiTheme(interestTheme) }>
        {<Particles 
       params={{
        "particles": {
          "number": {
            "value": 70,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": "#888fff"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
            "polygon": {
              "nb_sides": 5
            },
            "image": {
              "src": "./assets/opes-logo.png",
              "width": 100,
              "height": 100
            }
          },
          "opacity": {
            "value": 0.2,
            "random": false,
            "anim": {
              "enable": false,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 10,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 300,
            "color": "#ffffff",
            "opacity": 0.2,
            "width": 0.5
          },
          "move": {
            "enable": true,
            "speed": 10,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": true,
            "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": false,
              "mode": "repulse"
            },
            "onclick": {
              "enable": false,
              "mode": "push"
            },
            "resize": false
          },
          "modes": {
            "grab": {
              "distance": 800,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 800,
              "size": 80,
              "duration": 2,
              "opacity": 0.8,
              "speed": 3
            },
            "repulse": {
              "distance": 400,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
      }}
      />}
        <CssBaseline />
        <IpfsRouter>
          { !account &&
            <div className="bglower" style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              minWidth: '100vw',
              justifyContent: 'center',
              alignItems: 'center'
             
            }}>
              <Account />
            </div>
          }
          { account  &&
            <div className="bglower" style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '0',
              justifyContent: 'center',
              alignItems: 'center'
            
            }}>
              
              <Switch>
                <Route path="/stake">
                  <Header />
                  <Stake />
                </Route>
                <Route path="/staking">
                <Header />
                  <RewardsPools />
                </Route>
                <Route path="/vote">
                  <Header />
                  <Vote />
                </Route>
                <Route path="/propose">
                <Header />
                  <Propose />
                </Route>
                <Route path="/lock">
                  <Header />
                  <Lock />
                </Route>
                <Route path="/">
                 {/*  <Home /> */}
                 <RewardsPools />
                </Route>
              </Switch>
            </div>
          }
        </IpfsRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
