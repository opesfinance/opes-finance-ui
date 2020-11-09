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
                        Your Secret “Get into Crypto” Guide: The OPES.Finance Version
                        </Accordion.Toggle>
                    </div>
                    <Accordion.Collapse eventKey="1">
                    <div className="card-new-body p-3">
                      <p>
                        The Crypto world exists wholly in a digital format. That means that your cash doesn’t spend here - at all.
                        You need a “wallet” that will hold your digital assets - a wallet to which only you will have access. We
                        cannot stress this last part enough - ONLY YOU WILL HAVE ACCESS.
                      </p>
                      <p>
                        If you lose access to your digital wallet - there is no customer service - you are customer service. Make
                        sure you have your passcodes and password locked down and safe. If you need to share it with
                        someone, do so, but just don’t leave it exposed. Because here’s the other thing, with a password and
                        passcodes, your entire wallet can be drained. It's the same as a bank account. So be smart.

                      </p>
                      <p>
                      In short, there is no whining in crypto - you’re responsible for you. You’ve been warned.
                      </p>
                      <p>
                      In this guide, we’re going over MetaMask
                      </p>
                      <p>
                        <strong>Desktop:</strong><br/>
                        On the desktop, we’ll cover its’ use in the Chrome web browser (it's also available on Firefox).
                        Metamask can be accessed as a web app but we will be using it primarily as what it is - a
                        Chrome extension. Follow this link to install MetaMask in your Chrome Browser: <br/>
                        <a className="text-black-50" className="text-black-50" href="# https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=e
                        n-US" target="_blank">https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=e
                        n-US</a>
                      </p>
                      <p>
                      Video: For a full walkthrough on what to expect when setting up MetaMask on your desktop, try
                      this video (don’t mind the charming British accent) and watch until 3:27
                      <a className="text-black-50" className="text-black-50" href="https://youtu.be/yWfZnjkhhhg?t=106" target="_blank">https://youtu.be/yWfZnjkhhhg?t=106</a>
                      </p>
                      <p>
                      <strong>Mobile:</strong>
                      You can also install the MetaMask wallet on your mobile phone - for that you will need to
                      navigate to Apple’s App Store or the Google Play store. It's pretty easy to set this up on mobile,
                      just create the wallet and go from there. If you already have a desktop wallet, use the “sync”
                      option versus the “create” option to make sure your desktop and mobile apps are in sync.

                      </p>

                    </div>
                    </Accordion.Collapse>
                </div>

               

                <div className="rounded mt-2">
                    <div className="card-new-header p-2">
                        <Accordion.Toggle className="btn-new" style={{'cursor':'pointer'}} eventKey="3">
                          Funding your wallet.
                        </Accordion.Toggle>
                    </div>
                    <Accordion.Collapse eventKey="3">
                    <div className="card-new-body p-3">
                      <p>
                      In our case since this is an initial foray into the Crypto world, we’re going to need to “fund” your wallet
                      so you have the “digital wallet spending money” you need to pick up the coins you’ll need.
                      </p>
                      <p>
                      Before we go, a little tutorial on the digital world we’re bringing you into for these transactions. We are
                      working - in this specific case - on the Ethereum Blockchain. Yes, “Blockchain” you can look it up for
                      more information but this is what you need to know for now.
                      </p>
                      <p>
                      What’s cool about blockchains is this - every transaction is recorded everywhere on the network. In the
                      case of Ethereum on about 8,400 connected servers that run the network. That way when you run a
                      transaction to “buy” a coin, the network can look you up in a ledger to validate that you have that money
                      in your wallet and then allow the transaction to take place.
                      </p>
                      <p>
                      You can’t “bluff” on the blockchain. There is no need to “trust me” on the Blockchain. You can simply use
                      a tool called Etherscan to read how much money people have in a wallet if they are going to do business
                      with you. Really
                      </p>
                      <p>
                      But to make that happen - to have all that data written everywhere and to power those transactions
                      taking place we need to “write” each transaction to the blockchain - on all 8,400 servers, every time a
                      transaction is made. To do that, the people running these nodes - “miners” - require you to pay a small
                      “toll” or transaction fee. The nickname for that is called “Gas” or a “Gas Fee” and it's denominated in
                      Ethereum.
                      </p>
                      <p>
                      Since the network is finite - there are only so many nodes and so many miners - the miners will bid up
the price to “mine” the next block (in other words execute your transaction). For that reason “Gas Fees”
can go up and down during the day (second by second). To keep up with gas fees, we recommend
getting used to them by going to <a className="text-black-50" href="https://ethgasstation.info/" target="_blank">https://ethgasstation.info/</a>
                      </p>
                      <p>
                      In this example, one can see the average fee for which a miner is accepting bids for a super-fast
                      (“trader”), “fast”, and “standard” transaction.
                      </p>
                      <p>
                      <img
                        alt=""
                        src={ require('../../assets/faq/image1.png') }
                        height="200"
                        className="d-inline-block align-top"
                      />
                      </p>
                      <p>
                        <strong>So What!</strong>
                      </p>
                      <p>
                      We went through all this to give you background on the fact that you will need to first transform your“real world” dollars into Ethereum to trade on the Ethereum blockchain in this case.  You will also need tobudget enough Ethereum to pay for the “gas fees” or transaction fees you’ll need to complete thetransaction.
                      </p>
                      <p>
                      Also, you will need to know that if the gas fees seem crazy high (above $5 or $10.00) you can wait untilthe price goes down UNLESS you’re worried about the price of the coin you want to buy changing(going up or down - depending on if you’re buying or selling).
                      </p>

                    </div>
                    </Accordion.Collapse>
                </div>

                <div className="rounded mt-2">
                    <div className="card-new-header p-2">
                        <Accordion.Toggle className="btn-new" style={{'cursor':'pointer'}} eventKey="4">
                        Funding Your Digital Adventure
                        </Accordion.Toggle>
                    </div>
                    <Accordion.Collapse eventKey="4">
                    <div className="card-new-body p-3">
                    <p>
                    As noted in the image below depending upon the size, speed, and costs you want to incur whentransferring funds from the real (“fiat”) world into the digital “crypto” world - you have options.
                    </p>
                    <p>
                    If you are on iOS mobile you can transfer funds via ApplePay but you are limited to $450 a week and$250 per transaction. We’re not sure about android. The ApplePay option is 2.9% of the amount plus$0.30 (USD) per transaction.  Other mobile options include debit or credit cards that can end up being a7-9% of the transaction fee.
                    </p>
                    <p>
                    If you want to send larger transactions or prefer more traditional “Bank to Bank” options, you can moveto the desktop and use a “Bridging” service such as Coinbase Pro or Gemini (my favorite).
                    </p>
                    <p>
                    For these larger transfers, look into direct ACH transfers or wires. Funds wired in are available within 2hours. Funds transferred in are available within 7 days via ACH.  ACH transfers are free and Wires cancost between 10 and 40.
                    </p>
                    <p>
                      <img
                        alt=""
                        src={ require('../../assets/faq/image2.png') }
                        height="400"
                        className="d-inline-block align-top"
                      />
                      </p>
                    <p>
                      <strong>So What To Use?</strong>
                    </p>
                    <p>
                    We don’t have a “gotta do it” way, but a rule of thumb for me is to weigh the speed at which you wantto make a move and the impact on capital.  It's common sense but sometimes the complexity of thetransactions can cloud logic. Sometimes however the speed at which you can make the trade (and theexpected result) can outweigh it all.
                    </p>
                    <p>
                    Here’s an example of someone who does not care about the speed and wants to transfer in $1,000Via wire @ $40 that’s a 4% charge, via ACH it's free.  It's too large to run via ApplePay or the mobileoption.  That same example for $250. Via wire ($40) would be 16%, via Apple Pay would cost you 7.55(at 2.9% + $0.30), at 9% (the debit card fee) that would cost you $22.50.
                    </p>
                    <p>
                    If you transfer in via Mobile you will directly purchase Ethereum.  If you transfer in via Gemini orCoinBase Pro, you will have actual US dollars and you will need to make the trade to convert it intoEthereum.
                    </p>
                    <p>
                    Simply transfer your USD into Ethereum - enough to purchase the coin plus about 15% more fortransaction fees. This is why.  You will need transaction fee funding to get “in” and transaction feefunding to “get out.”  It's not fun to be trapped with the inability to trade out of a position.
                    </p>



                    </div>
                    </Accordion.Collapse>
                </div>


                <div className="rounded mt-2">
                    <div className="card-new-header p-2">
                        <Accordion.Toggle className="btn-new" style={{'cursor':'pointer'}} eventKey="5">
                        Moving the Ethereum on Desktop to your Metamask Wallet
                        </Accordion.Toggle>
                    </div>
                    <Accordion.Collapse eventKey="5">
                    <div className="card-new-body p-3">
                      <p>
                      First, let’s answer the question I had at this point,
                      </p>
                      <p>
                      “Why do I need to transfer stuff to Metamask? Why can’t I just purchase wrapped PE(wPE) here?”
                      </p>
                      <p>
                      The answer is simple - most DeFi coins unless they are widely traded are not available on Geminior Coinbase Pro (or Coinbase).  To make these trades we need to go to where these are traded -specifically to the automated market-making (AMM) platforms. In essence you’re getting wPEbefore it goes on the popular public exchanges. The platform we’ll eventually get to is Uniswap.
                      </p>
                      <p>
                      Now back to business.  If you’re on desktop and you’ve just transferred your fiat into crypto (you’re thisfar in - we can use the lingo), the next thing you’ll need to do is to transfer this to your metamask wallet.
                      </p>
                      <p>
                      The thing to understand about this is that on the Ethereum blockchain, everything is an address - it’ssitting somewhere on the chain. Your wallet is on the chain, and so is coinbase or Gemini.
                      </p>
                      <p>
                      So now we need to “send” the Ethereum you just purchased to your metamask wallet. To do this openmetamask and click on your account ID and wait for something like this to appear:
                      </p>
                      <p>
                      <img
                        alt=""
                        src={ require('../../assets/faq/image3.png') }
                        height="400"
                        className="d-inline-block align-top"
                      />
                      </p>
                      <p>
                      That is the address of your wallet.  So with that address, you will copy that and go to your coinbase orGemini account and “send” your Ethereum to that address (simply paste it in).
                      </p>
                      <p>
                      This is what you’re doing
                      </p>
                      <p>
                      1.You’ve established your wallet as the designation address
                      </p>
                      <p>
                      2.You’ve purchased Ethereum in a wallet on Coinbase Pro or Gemini
                      </p>
                      <p>
                      3.You’ve set up a transaction to “send” this Ethereum from Coinbase Pro or Gemini to somewhere
                      </p>
                      <p>
                      4.You’ve pasted in the wallet address as the “to” destination
                      </p>
                      <p>
                      5.You will have enough Ethereum to make your coin trade
                      </p>
                      <p>
                      6.You will have enough Ethereum to exit your coin trade (eventually)
                      </p>
                      <p>
                      7.You will have enough Ethereum to actually acquire the coin
                      </p>
                      <p>
                      When you confirm the transaction in Coinbase Pro or Gemini, it may take about 1 minute or so, but it willeventually appear in your wallet.
                      </p>


                    </div>
                    </Accordion.Collapse>
                </div>


                <div className="rounded mt-2">
                    <div className="card-new-header p-2">
                        <Accordion.Toggle className="btn-new" style={{'cursor':'pointer'}} eventKey="6">
                        WPE Current Price
                        </Accordion.Toggle>
                    </div>
                    <Accordion.Collapse eventKey="6">
                    <div className="card-new-body p-3">
                      <p>
                      This is the link where you can find the current price of wPE:
                      </p>
                      <p>
                        <a className="text-black-50" href="https://info.uniswap.org/token/0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b" target="_blank">https://info.uniswap.org/token/0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b</a>
                      </p>
                    </div>
                    </Accordion.Collapse>
                </div>


                <div className="rounded mt-2">
                    <div className="card-new-header p-2">
                        <Accordion.Toggle className="btn-new" style={{'cursor':'pointer'}} eventKey="7">
                        The Trade: Desktop Version
                        </Accordion.Toggle>
                    </div>
                    <Accordion.Collapse eventKey="7">
                    <div className="card-new-body p-3 text-white">
                      <p>
                      Now you’ve either got Ethereum in your metamask wallet via a direct transfer of funds (mobile) ordesktop via coinbase, coinbase pro, or Gemini.  The next step is to go purchase the coin wrapped PE.  Topurchase Wrapped PE we will eventually need to go to Uniswap and trade our Ethereum for wrappedPE (“wPE”).
                      </p>
                      <p>
                      First, however, we need to add the wPE address and label it into your wallet.  We need to do this so thatwhen you purchase the wPE your wallet can read it and display the coin. If you don’t - while it will bethere - you won’t be able to see it. It's silly but that’s how it works.
                      </p>
                      <p>
                      To do this open your Metamask wallet and tap “Add Token” (at the bottom) and then paste in this longcode in the “custom token” tab. 
                      </p>
                      <p>
                        <strong>NOTE Your token will read “wPE” NOT “UNI-V2”0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b</strong>
                      </p>
                      <p>
                      <img
                        alt=""
                        src={ require('../../assets/faq/image4.png') }
                        height="400"
                        className="d-inline-block align-top"
                      />
                      </p>
                      <p>
                      Once you add the wPE token to your wallet your next task will be to click this url
                      <br/>
                      <a className="text-black-50" href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b" taget="_blank">https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b</a>
                      </p>
                      <p>
                      You will see this (valid) pop-up. This is just Uniswap saying that you need to verify the source of the linkand the coin. And tap “I understand”  This is not an arbitrary token, this is the token for WPE.
                      </p>
                      <p>
                      <img
                        alt=""
                        src={ require('../../assets/faq/image5.png') }
                        height="400"
                        className="d-inline-block align-top"
                      />
                      </p>
                      <p>
                      This is our sample wallet (that does not have enough Ethereum in it to purchase 1 wPE but when you doget here type in 1.0  in the “wPE” area.
                      </p>  
                      <p>
                      And when you do it (using “1.0” you should see the  “Swap” button and you press “Swap”. We inserteda “0.001” sample so you can see what the “Swap” button is.  You MUST purchase at least 1.0 wPE coins(max 3).
                      </p>  
                      <p>
                      <img
                        alt=""
                        src={ require('../../assets/faq/image6.png') }
                        height="400"
                        className="d-inline-block align-top"
                      />
                      </p>    
                      <p>
                      You'll then be asked to confirm the swap (again this is with our “0.001” sample
                      </p>
                      <p>
                      <img
                        alt=""
                        src={ require('../../assets/faq/image7.png') }
                        height="400"
                        className="d-inline-block align-top"
                      />
                      </p> 
                      <p>
                      Once you confirm, you’ll get a prompt from your Metamask wallet to confirm the trade. BEFORE YOUTAP CONFIRM, tap the “Edit” button (in our example it's on the “Gas Fee” line).
                      </p>
                      <p>
                      <img
                        alt=""
                        src={ require('../../assets/faq/image8.png') }
                        height="400"
                        className="d-inline-block align-top"
                      />
                      </p> 
                      <p>
                      This is what you’re looking for. As you can see below the “New Total” is your current fee. It's to the rightabove the “Slow” fee.  We recommend using the “Fast” fee to run the transfer. To do this, you’d tap the“Fast” box and “save” the new total and then confirm the trade.
                      </p>
                      <p>
                      It's been our experience that if your gas fees are at or around the “slow” level, they may not go through -or you may panic at waiting 13 minutes.  If the fast fee is too much, you can also choose to wait untillater when the fees may go down - but you do risk a change in the price of wPE.
                      </p>
                      <p>
                      <img
                        alt=""
                        src={ require('../../assets/faq/image9.png') }
                        height="300"
                        className="d-inline-block align-top"
                      />
                      </p> 
                      <p>
                      When you are complete you will be able to consult your Metamask wallet and see your new unit of wPE.
                      </p>
    

                    </div>
                    </Accordion.Collapse>
                </div>



                <div className="rounded mt-2">
                    <div className="card-new-header p-2">
                        <Accordion.Toggle className="btn-new" style={{'cursor':'pointer'}} eventKey="8">
                        The Trade: Mobile Version (iOS)
                        </Accordion.Toggle>
                    </div>
                    <Accordion.Collapse eventKey="8">
                    <div className="card-new-body p-3">
                        
                        <p>
                        To make this trade-in your mobile Metamask wallet (since you’ve already got your Ethereum) what you’dneed to do is to get the address of wPE into your mobile wallet
                        </p>
                        <p>
                        Text “opes” or “Opes” to (781) 559-0949. This will send the address of wPE as anSMS to your phone. Copy that address to your clipboard
                        </p>
                        <p>
                        Once you have that you will need to navigate to your Metamask wallet and select“add token” and paste that address in under “Custom Token” and press “AddToken” to confirm everything.
                        </p>
                        <p>
                      <img
                        alt=""
                        src={ require('../../assets/faq/image10.png') }
                        height="250"
                        className="d-inline-block align-top"
                      />
                      </p> 
                      <p>
                      <img
                        alt=""
                        src={ require('../../assets/faq/image11.png') }
                        height="250"
                        className="d-inline-block align-top"
                      />
                      </p> 
                      <p>
                      Once you do this open your sms again and text “trade” to (781) 559-0949 and you will receive thisaddress:
                      </p>
                      <p>
                        <a className="text-black-50" href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b" target="_blank">https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b</a>
                      </p>
                      <p>
                      You will then copy this and then navigate BACK to Metamask and select the three horizontal lines “thehamburger” select “Browser” and then in the next screen click in “Search or Type UR” and in the nextscreen, paste in the address you copied:
                      </p>
                      <p>
                      <img
                        alt=""
                        src={ require('../../assets/faq/image12.png') }
                        height="250"
                        className="d-inline-block align-top"
                      />
                      </p> 
                      <p>
                      That will display this screen where you click “I understand” then you’d type in at least 1.0 ETH to makeyour trade.  The remaining examples will use a sample trade we made using 0.001 wPE.
                      </p>
                      <p>
                      <img
                        alt=""
                        src={ require('../../assets/faq/image13.png') }
                        height="250"
                        className="d-inline-block align-top"
                      />
                      </p> 
                      <p>
                      Select “Swap” then “Confirm Swap” but BEFORE you select the blue “Confirm” button select “Edit” t theright of “network fee.”  To ensure that the trade will go through fast, mov the option up to “Fast”, press“Save” and press “Confirm” again (the third screen will reappear)
                      </p>
                      <p>
                      <img
                        alt=""
                        src={ require('../../assets/faq/image14.png') }
                        height="250"
                        className="d-inline-block align-top"
                      />
                      </p> 
                      <p>
                      The next screen you will see the first two screens. Eventually when you get back to your wallet - whereit displays your coins - you will be able to read  the amount of WPE you’ve purchased.
                      </p>
                      <p>
                      <img
                        alt=""
                        src={ require('../../assets/faq/image15.png') }
                        height="250"
                        className="d-inline-block align-top"
                      />
                      </p> 



                    </div>
                    </Accordion.Collapse>
                </div>


                <div className="rounded mt-2">
                    <div className="card-new-header p-2">
                        <Accordion.Toggle className="btn-new" style={{'cursor':'pointer'}} eventKey="9">
                        POST Trade - OPES ID wallet
                        </Accordion.Toggle>
                    </div>
                    <Accordion.Collapse eventKey="9">
                    <div className="card-new-body p-3">
                        <p>
                        Once you make the trade you MUST - this is super critical - you MUST get this app on your phone. If youdon’t have a phone - find someone you trust and install it on their phone. Seriously and follow this link toadd it to your Apple or Android device.
                        </p>
                        <p>
                      <img
                        alt=""
                        src={ require('../../assets/faq/image15.png') }
                        height="350"
                        className="d-inline-block align-top"
                      />
                      </p> 
                      <p>
                        <a className="text-black-50" href="https://mobile.opes.pe/opesapp/add-contact?uid=2003389942" target="_blank">https://mobile.opes.pe/opesapp/add-contact?uid=2003389942</a>
                      </p>
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