// var ConvertLib = artifacts.require("./ConvertLib.sol");
var SimpleStorage = artifacts.require('../contracts/SimpleStorage.sol');

module.exports = function(deployer) {
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, Migrations);
  deployer.deploy(SimpleStorage);
};
