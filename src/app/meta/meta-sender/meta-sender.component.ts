import {Component, OnInit} from '@angular/core';
import {Web3Service} from '../../util/web3.service';
import { MatSnackBar } from '@angular/material';
import ipfs from '../../ipfs';
import { Buffer } from 'buffer';
import { encode } from 'punycode';
declare let require: any;
const Web3 = require('web3');
declare let window: any;


const metacoin_artifacts = require('../../../../build/contracts/SimpleStorage.json');
const simplestorage_artifacts = require('../../../../build/contracts/SimpleStorage.json');

@Component({
  selector: 'app-meta-sender',
  templateUrl: './meta-sender.component.html',
  styleUrls: ['./meta-sender.component.css']
})
export class MetaSenderComponent implements OnInit {
  
  accounts: string[];
  MetaCoin: any;
  Storeg: any;
  web3:any;
  simpleStorageInstance: any;

  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: ''
  };

  status = '';

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) {
    // console.log('Constructor: ' + web3Service);
    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
  }
  
  public bootstrapWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log('No web3? You should consider trying MetaMask!');

      // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
      Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    }

    this.update("ssssfff");
 }

  ngOnInit(): void {
    // console.log('OnInit: ' + this.web3Service);
    // console.log(this);
    // this.watchAccount();
    // this.web3Service.artifactsToContract(metacoin_artifacts)
    //   .then((MetaCoinAbstraction) => {
    //     this.MetaCoin = MetaCoinAbstraction;
    //     this.MetaCoin.deployed().then(deployed => {
    //       console.log(deployed);
    //       this.Storeg = deployed;
    //     // deployed.Transfer({}, (err, ev) => {
    //       //   console.log('Transfer event came in, refreshing balance');
    //       //   // this.refreshBalance();
    //       // });
    //     });
    //   });

     // this.web3Service.artifactsToContract(metacoin_artifacts)
    //   .then((MetaCoinAbstraction) => {
    //     this.MetaCoin = MetaCoinAbstraction;
    //     this.MetaCoin.deployed().then(deployed => {
    //       console.log(deployed);
    //       this.Storeg = deployed;
    //     // deployed.Transfer({}, (err, ev) => {
    //       //   console.log('Transfer event came in, refreshing balance');
    //       //   // this.refreshBalance();
    //       // });
    //     });
    //   });


  }
  async update(str){
    const contract = require('truffle-contract');
    const ss = contract(simplestorage_artifacts);
    ss.setProvider(this.web3.currentProvider);

    this.web3.eth.getAccounts((error, accounts) => {
      ss.deployed().then((instance) => {
        this.simpleStorageInstance = instance
        // this.setState({ account: accounts[0] })
        // Get the value from the contract to prove it worked.
        // return this.simpleStorageInstance.get.call(accounts[0])
        console.log(accounts)
        this.simpleStorageInstance.set('aaaaaaaaa', { from: accounts[0] }).then((r) => {
          // return this.setState({ ipfsHash: result[0].hash })
          console.log('ifpsHash', r)
        })
        // console.log(instance);

        return this.simpleStorageInstance.get.call().then((ipfsHash) => {
        // Update state with the result.
        console.log(ipfsHash)
      })
        
      });
    })
    // const deployedMetaCoin = await this.MetaCoin.deployed();
    // const transaction = await deployedMetaCoin.sendCoin.sendTransaction(receiver, amount, {from: this.model.account});
  }


  onSubmit(event){
    console.log(event);
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new FileReader();
    reader.readAsArrayBuffer(file)
    reader.onloadend = (e) => {
     console.log(e);
      // this.setState({ buffer: Buffer(reader.result) })
      // console.log('buffer', this.state.buffer)
      
      // ipfs.files.add(e., (error, result) => {
      //   if(error) {
      //     console.error(error)
      //     return
      //   }
      //   this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((r) => {
      //     return this.setState({ ipfsHash: result[0].hash })
      //     console.log('ifpsHash', this.state.ipfsHash)
      //   })
      // })
      this.Storeg.methods.set('sssss').then((r) => {
        console.log('ifpsHash', r );
          // return this.setState({ ipfsHash: result[0].hash })
          // console.log('ifpsHash', this.state.ipfsHash)
        });
      
      // ipfs.files.add(new Buffer(e.target['result']),(err,result)=> {
      //   if(err) {
      //     console.log(err)
      //     return
      //   }
      //   console.log(result);
      //   this.Storeg.methods.set(result[0].hash).then((r) => {
      //       console.log('ifpsHash', r );
      //         // return this.setState({ ipfsHash: result[0].hash })
      //         // console.log('ifpsHash', this.state.ipfsHash)
      //       });
      // }).bind(this);
      
      console.log('data:image/png;base64,'+ encode(e.target['result']));
    }
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
      // this.refreshBalance();
    });
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }

  // async sendCoin() {
  //   if (!this.MetaCoin) {
  //     this.setStatus('Metacoin is not loaded, unable to send transaction');
  //     return;
  //   }

  //   const amount = this.model.amount;
  //   const receiver = this.model.receiver;

  //   console.log('Sending coins' + amount + ' to ' + receiver);

  //   this.setStatus('Initiating transaction... (please wait)');
  //   try {
  //     const deployedMetaCoin = await this.MetaCoin.deployed();
  //     const transaction = await deployedMetaCoin.sendCoin.sendTransaction(receiver, amount, {from: this.model.account});

  //     if (!transaction) {
  //       this.setStatus('Transaction failed!');
  //     } else {
  //       this.setStatus('Transaction complete!');
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     this.setStatus('Error sending coin; see log.');
  //   }
  // }

  // async refreshBalance() {
  //   console.log('Refreshing balance');

  //   try {
  //     const deployedMetaCoin = await this.MetaCoin.deployed();
  //     console.log(deployedMetaCoin);
  //     console.log('Account', this.model.account);
  //     const metaCoinBalance = await deployedMetaCoin.getBalance.call(this.model.account);
  //     console.log('Found balance: ' + metaCoinBalance);
  //     this.model.balance = metaCoinBalance;
  //   } catch (e) {
  //     console.log(e);
  //     this.setStatus('Error getting balance; see log.');
  //   }
  // }

  // setAmount(e) {
  //   console.log('Setting amount: ' + e.target.value);
  //   this.model.amount = e.target.value;
  // }

  // setReceiver(e) {
  //   console.log('Setting receiver: ' + e.target.value);
  //   this.model.receiver = e.target.value;
  // }

}
