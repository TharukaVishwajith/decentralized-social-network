// var ConvertLib = artifacts.require("./ConvertLib.sol");
var SEToken = artifacts.require('../contracts/SEToken.sol');

module.exports = function(deployer) {
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, Migrations);
  deployer.deploy(SEToken,100000);
};
