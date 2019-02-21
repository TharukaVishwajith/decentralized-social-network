import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../util/web3.service';
import { MatSnackBar } from '@angular/material';
import ipfs from '../ipfs';
import { Buffer } from 'buffer';
import { encode } from 'punycode';
import set = Reflect.set;
import {any} from 'codelyzer/util/function';
import {Router} from '@angular/router';
declare let require: any;
const Web3 = require('web3');
declare let window: any;

const simplestorage_artifacts = require('../../../build/contracts/SimpleStorage.json');


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  accounts: string[];
  web3: any;
  simpleStorageInstance: any;
  blockNum: any;
  newAccount = {
    privateAddress: any,
    publicAddress: any
  };
  noAccount = true;
  requested = false;
  model = {
    name: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    profileImageHash: 'NA'
  };

  constructor(private router: Router) {
    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
    // this.router.navigate(['/profile']);
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
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    }
    // this.signUp('ss');
    this.navigateToLogedProfile();
  }

  ngOnInit() {
    // this.web3.eth.getAccounts().then(e => {
    //   console.log(e);
    //   if (e.length > 0) {
    //     // this.noAccount = false;
    //   }
    // });
  }
  async navigateToLogedProfile() {
    const contract = require('truffle-contract');
    const ss = contract(simplestorage_artifacts);
    ss.setProvider(this.web3.currentProvider);

    this.web3.eth.getAccounts((error, accounts) => {
      ss.deployed().then((instance) => {
        this.simpleStorageInstance = instance;
        console.log(accounts);
        // this.simpleStorageInstance.addNewUser(ipfsResult.hash, accounts[0], { from: accounts[0] }).then((r) => {
        //   // return this.setState({ ipfsHash: result[0].hash })
        //   console.log('ifpsHash', r);
        // });
        this.simpleStorageInstance.getUserByAddress.call(accounts[0]).then((user) => {
          console.log(user);
          if (user.userIpfsHash !== '' && !user.userIpfsHash !== undefined) {
           this.router.navigate(['/profile']);
          }
        });
      });
    });
  }

  async requestAccount() {
    const account = this.web3.eth.accounts.create();
    console.log(account);
    this.newAccount.privateAddress = account.privateKey;
    this.newAccount.publicAddress = account.address;
    this.noAccount = false;
  }

  next() {
    this.requested = true;
  }

  async signUp() {
    let ipfsResult: any;
    console.log(this.model);
    const myJSON = JSON.stringify(this.model);
    ipfs.files.add(new Buffer(myJSON), ( err , result ) => {
          if (err) {
            console.log(err);
            return;
          }
      ipfsResult = result;
      console.log(result);
      this.storeInBlockChain(ipfsResult[0]);
    });
  }

  storeInBlockChain(ipfsResult) {
    const contract = require('truffle-contract');
    const ss = contract(simplestorage_artifacts);
    ss.setProvider(this.web3.currentProvider);

    this.web3.eth.getAccounts((error, accounts) => {
      ss.deployed().then((instance) => {
        this.simpleStorageInstance = instance;
        console.log(accounts);
        this.simpleStorageInstance.addNewUser(ipfsResult.hash, accounts[0], { from: accounts[0] }).then((r) => {
          // return this.setState({ ipfsHash: result[0].hash })
          console.log('ifpsHash', r);
        });
        // this.simpleStorageInstance.getUserByAddress.call('0xeC872E4dD61e00B9Bd7858eEcB72d8910922Dbd0').then((user) => {
        //   console.log(user);
        // });
      });
    });
  }
}
