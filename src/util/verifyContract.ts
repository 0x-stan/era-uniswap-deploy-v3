import * as hre from 'hardhat'
import { Contract } from 'ethers'

/**
 * @param {string} data.contract The contract's path and name. E.g., "contracts/Greeter.sol:Greeter"
 */
export const verifyContract = async (data: {
  address: string
  contract: string
  constructorArguments: string
  bytecode: string
}) => {
  const verificationRequestId: number = await hre.run('verify:verify', {
    ...data,
    noCompile: true,
  })
  return verificationRequestId
}

async function main({
  address,
  contractNameOrFullyQualifiedName,
  constructorArguments,
}: {
  address: string
  contractNameOrFullyQualifiedName: string;
  constructorArguments: any[]
}) {
  const artifact = (await hre.artifacts.readArtifact(contractNameOrFullyQualifiedName))
  const fullContractSource = `${artifact.sourceName}:${artifact.contractName}`
  const contract = new Contract(address, artifact.abi);
  const constructorArgs = contract.interface.encodeDeploy(constructorArguments)

  console.log(`Requesting contract verification...`)
  await verifyContract({
    address,
    contract: fullContractSource,
    constructorArguments: constructorArgs,
    bytecode: artifact.bytecode,
  })
}

main({
  address: "0x9905182472b721B487C7AB119318FeC16D462cF2",
  contractNameOrFullyQualifiedName: "UniswapV3Factory",
  constructorArguments: []
})