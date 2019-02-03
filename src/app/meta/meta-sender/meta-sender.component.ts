import {Component, OnInit} from '@angular/core';
import {Web3Service} from '../../util/web3.service';
import { MatSnackBar } from '@angular/material';
import ipfs from '../../ipfs';
import { Buffer } from 'buffer';
import { encode } from 'punycode';
import set = Reflect.set;
declare let require: any;
const Web3 = require('web3');
declare let window: any;


const metacoin_artifacts = require('../../../../build/contracts/MetaCoin.json');
const simplestorage_artifacts = require('../../../../build/contracts/SimpleStorage.json');
const setoken_artifacts = require('../../../../build/contracts/SEToken.json');

@Component({
  selector: 'app-meta-sender',
  templateUrl: './meta-sender.component.html',
  styleUrls: ['./meta-sender.component.css']
})
export class MetaSenderComponent implements OnInit {

  accounts: string[];
  MetaCoin: any;
  Storeg: any;
  web3: any;
  simpleStorageInstance: any;
  setokenInstance: any;

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

    this.update('ssssfff');
    // this.sendInitialToken();
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
  async update(str) {
    const account = this.web3.eth.accounts.create();
    console.log(account);

    const contract = require('truffle-contract');
    const ss = contract(simplestorage_artifacts);
    ss.setProvider(this.web3.currentProvider);

    this.web3.eth.getAccounts((error, accounts) => {
      ss.deployed().then((instance) => {
        this.simpleStorageInstance = instance;
        console.log(accounts);
        this.simpleStorageInstance.addNewUser('#aabbcc', account.address, { from: accounts[0] }).then((r) => {
          // return this.setState({ ipfsHash: result[0].hash })
          console.log('ifpsHash', r);
        });
        // console.log(instance);

      //   return this.simpleStorageInstance.get.call().then((ipfsHash) => {
      //   // Update state with the result.
      //   console.log(ipfsHash);
      // });
          this.simpleStorageInstance.getUserByAddress.call('0xD7cE63A99d2BA1f705D6967C917F2b670c9133C5').then((user) => {
            // Update state with the result.
            console.log(user);
        });
      });
    });
    // const deployedMetaCoin = await this.MetaCoin.deployed();
    // const transaction = await deployedMetaCoin.sendCoin.sendTransaction(receiver, amount, {from: this.model.account});
  }

  async sendInitialToken() {
    const account = this.web3.eth.accounts.create();
    console.log(account);

    const contract = require('truffle-contract');
    const ss = contract(setoken_artifacts);
    ss.setProvider(this.web3.currentProvider);

    this.web3.eth.getAccounts((error, accounts) => {
      this.web3.eth.sendTransaction({to: account.address, from: accounts[0], value: 10});
      // ss.deployed().then((instance) => {
      //   this.setokenInstance = instance;
      //   console.log(accounts);
      //
      //   this.setokenInstance.transfer(account.address, 10, { from: accounts[0] }).then((r) => {
      //     // return this.setState({ ipfsHash: result[0].hash })
      //     console.log('ifpsHash', r);
      //   }).catch((err) => {
      //     console.log(err);
      //   });
      //
      // });
    });
  }


  onSubmit(event) {
    console.log(event);
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
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
      ipfs.files.add(new Buffer(e.target['result']), ( err , result ) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(result);
      });

      console.log('data:image/png;base64,' + encode(e.target['result']));
    };
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
      // this.refreshBalance();
    });
  }

  setStatus(status) {
    // this.matSnackBar.open(status, null, {duration: 3000});
  }
}
