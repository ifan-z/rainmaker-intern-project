import { ethers } from 'ethers';
import { BigNumber } from 'ethers';
import { ETH, USDC } from './tokens';
import { abi as PAIR_ABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { abi as ROUTER_ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import { abi as FACTORY_ABI } from '@uniswap/v2-core/build/IUniswapV2Factory.json'

const FROM_TOKEN = USDC;
const FROM_BALANCE = BigNumber.from('1000000');
const TO_TOKEN = ETH;
const MIN_AMOUNT_OUT = BigNumber.from('0');

(async () => {
  try{
    console.info(`Converting ${FROM_BALANCE.toString()} ${FROM_TOKEN.symbol} to ${TO_TOKEN.symbol}`);

    // Get the contract for a DEX: Uniswap V2 Router.
    const provider = new ethers.providers.InfuraProvider('goerli');
    const uniswapV2RouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
    const uniswapV2RouterContract = new ethers.Contract(uniswapV2RouterAddress, ROUTER_ABI, provider);

    // Get the contract for the Uniswap V2 Factory.
    const uniswapV2FactoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
    const uniswapV2FactoryContract = new ethers.Contract(uniswapV2FactoryAddress, FACTORY_ABI, provider);

    // Get the contract for the Uniswap V2 Pair.
    const uniswapV2PairAddress = await uniswapV2FactoryContract.getPair(FROM_TOKEN.address, TO_TOKEN.address);
    const uniswapV2PairContract = new ethers.Contract(uniswapV2PairAddress, PAIR_ABI, provider);

    // Use ethers and the DEX contract to figure out how much TO_TOKEN you can get
    // for the FROM_TOKEN.

    // TODO:
    const path = [FROM_TOKEN.address, TO_TOKEN.address];
    const amountsOut = await uniswapV2RouterContract.getAmountsOut(FROM_BALANCE, path); // Includes fee and slippage
    const swapBalance = amountsOut[1]; // For the amount of the TO_TOKEN we'd get

    console.info(`Estimated swap balance: ${swapBalance} ${TO_TOKEN.symbol}`);

    // Figure out spot values of tokens.

    // Calculate slippage on the swap.

    // TODO:
    const reserves = await uniswapV2PairContract.getReserves();
    const spot_value = reserves[1].div(reserves[0]); // Calculate the spot value of the TO_TOKEN as a ratio
    const spot_quantity = spot_value.mul(FROM_BALANCE); // Calculate TO_TOKEN quantity based on FROM_TOKEN balance
    const slippagePercent = spot_quantity.sub(swapBalance).div(spot_quantity);

    console.info(`Slippage: ${slippagePercent.mul(100)}%`);
  } catch(error) {
    console.info(error);
  }
  
  
})();
