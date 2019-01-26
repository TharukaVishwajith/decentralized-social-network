// var ConvertLib = artifacts.require("./ConvertLib.sol");
var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, Migrations);
  deployer.deploy(Migrations);
};
