var Adoption = artifacts.require('Adoption');

module.exports = function (deployer) {
    deployer.deploy(Adoption, { overwrite: true });
};