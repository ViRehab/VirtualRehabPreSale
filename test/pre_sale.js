const PreSale = artifacts.require('./preSale.sol');
const BigNumber = require('bignumber.js');
const EVMRevert = require('./helpers/EVMRevert').EVMRevert;
const ether = require('./helpers/ether').ether;
const latestTime  = require('./helpers/latestTime').latestTime;
const increaseTime = require('./helpers/increaseTime');
const increaseTimeTo = increaseTime.increaseTimeTo;
const duration = increaseTime.duration;
const Token = artifacts.require('./ERC20Mock');
const getBalance = require('./helpers/web3').ethGetBalance

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('Pre sale', function(accounts) {
  describe('Pre sale Creation', () => {
    it('should deploy with correct parameters', async () => {
      // const minContributionInUSDCents  = 15000;
      const startTime = await latestTime() + duration.days(1);
      const endTime = startTime + duration.years(1);
      const binanceCoin = accounts[1];
      const creditsToken = accounts[2];
      const ERC20 = accounts[2];
      const preSale = await PreSale.new(startTime, endTime, binanceCoin, creditsToken, ERC20);
      assert((await preSale.totalSaleAllocation()).toNumber() == 0);
      assert((await preSale.openingTime()).toNumber() == startTime);
      assert((await preSale.closingTime()).toNumber() == endTime);
      assert((await preSale.token()) == ERC20);
      assert((await preSale.binanceCoin()) == binanceCoin);
      assert((await preSale.owner()) == accounts[0]);
    });
  });

  describe('Admin Functions', () => {
    let preSale;
    let erc20;
    beforeEach(async () => {
      const openingTime = await latestTime() + 10;
      const endingTime = openingTime + duration.days(10);
      const binanceCoin = accounts[1];
      const creditsToken = accounts[2];
      const minContributionInUSDCents  = 100;
      erc20 = await Token.new(accounts[0], ether(7000000));
      preSale = await PreSale.new(openingTime, endingTime, binanceCoin, creditsToken, erc20.address);
    })

    it('only admin can change the token price', async () => {
      await preSale.setTokenPrice(200);
      assert((await preSale.tokenPriceInCents()).toNumber() == 200);
      await preSale.setTokenPrice(300, { from: accounts[2] }).should.be.rejectedWith(EVMRevert);
    });

    it('token price cannot be set to 0', async () => {
      await preSale.setTokenPrice(0).should.be.rejectedWith(EVMRevert);
    })


    it('only admin can set ICO End date', async () => {
      const releaseDate = (await latestTime()) + 1000;
      await preSale.setReleaseDate(releaseDate);
      assert((await preSale.releaseDate()).toNumber() == releaseDate);
      await preSale.setReleaseDate(releaseDate).should.be.rejectedWith(EVMRevert);
    });

    it('only admin can set ETH USD price', async () => {
      const etherPriceInCents = 25000;
      await preSale.setEtherPrice(etherPriceInCents);
      assert((await preSale.etherPriceInCents()).toNumber() == etherPriceInCents)
      await preSale.setEtherPrice(etherPriceInCents, { from: accounts[1] }).should.be.rejectedWith(EVMRevert);
    });

    it('ETH USD price cannot be set to 0', async () => {
      const etherPriceInCents = 0;
      await preSale.setEtherPrice(etherPriceInCents).should.be.rejectedWith(EVMRevert);
    })

    it('only admin can set BNB USD price', async () => {
      const binanceCoinPriceInCents = 2500;
      await preSale.setBinanceCoinPrice(binanceCoinPriceInCents);
      assert((await preSale.binanceCoinPriceInCents()).toNumber() == binanceCoinPriceInCents);
      await preSale.setBinanceCoinPrice(binanceCoinPriceInCents, { from : accounts[1] }).should.be.rejectedWith(EVMRevert);
    })

    it('BNB USD price cannot be set to 0', async () => {
      const binanceCoinPriceInCents = 0;
      await preSale.setBinanceCoinPrice(binanceCoinPriceInCents).should.be.rejectedWith(EVMRevert);
    })

    it('only admin can set credits USD price', async () => {
      const creditsTokenPrice = 2500;
      await preSale.setCreditsTokenPrice(creditsTokenPrice);
      assert((await preSale.creditsTokenPriceInCents()).toNumber() == creditsTokenPrice);
      await preSale.setCreditsTokenPrice(creditsTokenPrice, { from : accounts[1] }).should.be.rejectedWith(EVMRevert);
    })

    it('credits USD Price cannot be set to 0', async () => {
      const creditsTokenPrice = 0;
      await preSale.setCreditsTokenPrice(creditsTokenPrice).should.be.rejectedWith(EVMRevert);
    })

    it('only admin can change the min contribution', async () => {
      const minContributionInUSDCents  = 1000000;
      await preSale.setMinimumContribution(minContributionInUSDCents);
      assert((await preSale.minContributionInUSDCents()).toNumber() == minContributionInUSDCents );
      //await preSale.setMinimumContribution(minContributionInUSDCents , { from: accounts[3] }).should.be.rejectedWith(EVMRevert);
    });

    it('only admin can add address to KYC', async () => {
      const investor =  accounts[4];
      await preSale.addWhitelist(investor);
      assert(await preSale.whitelist(investor));
      await preSale.addWhitelist(accounts[4], { from: accounts[4] }).should.be.rejectedWith(EVMRevert);

      const investors = [accounts[1], accounts[2]];
      await preSale.addManyWhitelist(investors);

      for(let i=0;i< investors.length;i++) {
        assert(await preSale.whitelist(investors[i]));
      }
      await preSale.addManyWhitelist(investors, { from: accounts[1] }).should.be.rejectedWith(EVMRevert);
    });

    it('only admin can remove address from KYC', async () => {
      const investor =  accounts[4];
      const investor2 = accounts[5];
      await preSale.addWhitelist(investor);
      await preSale.addWhitelist(investor2);

      await preSale.removeWhitelist(investor, { from: accounts[4] }).should.be.rejectedWith(EVMRevert);
      await preSale.removeWhitelist(investor);
      assert(await preSale.whitelist(investor) == false);
      await preSale.removeManyWhitelist([investor2], { from: accounts[1] }).should.be.rejectedWith(EVMRevert);
      await preSale.removeManyWhitelist([investor2]);
      assert(await preSale.whitelist(investor2) == false);
    });



    it('only admin can change the max tokens for sale', async () => {
      await erc20.approve(preSale.address, ether(20));
      const totalSaleAllocation = await preSale.totalSaleAllocation();
      await preSale.increaseTokenSaleAllocation();
      const expectedMaxTokens = totalSaleAllocation.add(ether(20));
      (await preSale.totalSaleAllocation()).should.be.bignumber.equal(expectedMaxTokens)
    });

    it('only admin can call initialize', async () => {
      let etherPriceInCents = 100;
      let creditsTokenPriceInCents = 101;
      let tokenPriceInCents = 102;
      let binanceCoinPriceInCents = 103;
      let timestamps = [1,2,3];
      let bonus = [2,3,4];
      let minContributionInUSDCents = 10000;
      await erc20.approve(preSale.address, ether(700000))

      await preSale.initializeSale(etherPriceInCents, tokenPriceInCents, binanceCoinPriceInCents, creditsTokenPriceInCents, minContributionInUSDCents, timestamps, bonus, {from: accounts[1]}).should.be.rejectedWith(EVMRevert);
      await preSale.initializeSale(etherPriceInCents, tokenPriceInCents, binanceCoinPriceInCents, creditsTokenPriceInCents, minContributionInUSDCents, timestamps, bonus);
      assert(await preSale.initialized());
      assert((await preSale.creditsTokenPriceInCents()).toNumber() === creditsTokenPriceInCents);
      assert((await preSale.binanceCoinPriceInCents()).toNumber() === binanceCoinPriceInCents);
      assert((await preSale.etherPriceInCents()).toNumber() === etherPriceInCents);
      assert((await preSale.tokenPriceInCents()).toNumber() === tokenPriceInCents);
      assert((await preSale.minContributionInUSDCents()).toNumber() === minContributionInUSDCents);
      for(let i=0;i<bonus.length;i++) {
        assert((await preSale.bonusPercentages(i)).toNumber() == bonus[i]);
        assert((await preSale.bonusTimestamps(i)).toNumber() == timestamps[i]);
      }
      const totalSaleAllocation = await preSale.totalSaleAllocation();
      totalSaleAllocation.should.be.bignumber.equal(ether(700000));
      await preSale.initializeSale(etherPriceInCents, tokenPriceInCents, binanceCoinPriceInCents, creditsTokenPriceInCents, minContributionInUSDCents, timestamps, bonus)
      .should.be.rejectedWith(EVMRevert);
    });

    it('only admin can withdraw ERC20 token', async () => {
      await erc20.transfer(preSale.address, ether(1));
      await preSale.addAdmin(accounts[1]);
      preSale.withdrawToken(erc20.address, { from: accounts[1] });
      (await erc20.balanceOf(accounts[1])).should.be.bignumber.equal(ether(1));
    })

    it('only admin can change the closing time', async () => {
      let endTime = await latestTime() + duration.days(1);
      await preSale.changeClosingTime(endTime);
      assert((await preSale.closingTime()).toNumber() === endTime);
      await preSale.changeClosingTime(endTime, {from: accounts[2]})
      .should.be.rejectedWith(EVMRevert);
    });

    it('only admins can set bonuses', async () => {
      let timestamps = [34000, 32000, 20000];
      let bonusPercentages = [3,4,5];
      await preSale.setBonuses(timestamps, bonusPercentages);

      for(let i=0;i<bonusPercentages.length;i++) {
        assert((await preSale.bonusTimestamps(i)).toNumber(), timestamps[i]);
        assert((await preSale.bonusPercentages(i)).toNumber(), bonusPercentages[i]);
      }

      await preSale.setBonuses(timestamps, bonusPercentages, {from: accounts[1]}).should.be.rejectedWith(EVMRevert);
    });
  })

  describe('constant conversion function', () => {
    let preSale;
    let erc20;
    let bonusPercentages;
    let bonusTimestamps;

    beforeEach(async () => {
      const openingTime = await latestTime() + 10;
      const endingTime = openingTime + duration.days(10);
      const binanceCoin = accounts[1];
      const creditsToken = accounts[1];
      const tokenPriceInCents = 10;
      const etherPriceInCents = 30000;
      const binanceCoinPriceInCents = 1100;
      const creditsTokenPriceInCents = 1000;
      const minContributionInUSDCents  = 1500000;
      bonusPercentages = [20, 40, 50];
      bonusTimestamps = [openingTime + duration.days(1), openingTime + duration.days(2), endingTime];
      erc20 = await Token.new(accounts[0], ether(7000000));
      preSale = await PreSale.new(openingTime, endingTime, binanceCoin, creditsToken, erc20.address);
      await preSale.initializeSale(etherPriceInCents, tokenPriceInCents, binanceCoinPriceInCents, creditsTokenPriceInCents, minContributionInUSDCents, bonusTimestamps, bonusPercentages);
    })
    it('should convert to USD', async () => {
      const tokenCost = [30000, 20000, 1100, 29340];
      const amount = [ether(1), ether(2), ether(3), ether(0.5432)];
      const expectedUSD = [30000, 40000, 3300, Math.round(29340*0.5432)];
      for(let i=0;i<tokenCost.length;i++) {
        let USD = await preSale.convertToCents(amount[i], tokenCost[i], 18);
        assert(USD.toNumber() == expectedUSD[i]);
      }
    });

    it('calculateBonus for token amount', async () => {
      const bonusPercentage = [35,45,50]
      const tokenAmount = [100, 200, 350];
      for(let i=0;i<tokenAmount.length; i++) {
        let bonus = await preSale.calculateBonus(tokenAmount[i], bonusPercentage[i]);
        assert(bonus.toNumber() == tokenAmount[i] * bonusPercentage[i] / 100);
      }

    });

    it('calculate token amount', async () => {
      await preSale.setEtherPrice(50000);
      let tokenPriceInCents = 10;
      await preSale.setTokenPrice(tokenPriceInCents);
      const ethPrices = [29850, 32000, 50000, 28904];
      const ethContribution = [1, 0.5, 2, 0.25];
      for(var i=0;i<ethPrices.length;i++) {
        await preSale.setEtherPrice(ethPrices[i]);
        expectedTokenAmount = ether(ethContribution[i] * ethPrices[i]/tokenPriceInCents);
        (await preSale.getTokenAmountForWei(ether(ethContribution[i])))
        .should.be.bignumber.equal(expectedTokenAmount);
      }
    })

    it('return bonus bonusPercentages', async () => {

      for(let i=0;i<bonusTimestamps.length;i++) {
        assert((await preSale.getBonusPercentage(bonusTimestamps[i] - 1)).toNumber() == bonusPercentages[i]);
        assert((await preSale.getBonusPercentage(bonusTimestamps[i])).toNumber() == bonusPercentages[i]);
      }
      assert((await preSale.getBonusPercentage(bonusTimestamps[2] + 10)).toNumber() == 0);

    })
  });

  describe('ETH Contribution', () => {
    let preSale;
    let erc20;
    let endingTime;
    beforeEach(async () => {
      const openingTime = await latestTime() + 10;
      endingTime = openingTime + duration.days(10);
      const tokenPriceInCents = 10;
      const etherPriceInCents = 30000;
      const binanceCoinPriceInCents = 1100;
      const creditsTokenPriceInCents = 1000;
      const binanceCoin = accounts[1];
      const creditsToken = accounts[2];
      const minContributionInUSDCents  = 1500000;
      const bonusPercentages = [20, 40, 50];
      const bonusTimestamps = [openingTime + duration.days(1), openingTime + duration.days(2), endingTime];

      erc20 = await Token.new(accounts[0], ether(2*526500));
      preSale = await PreSale.new(openingTime, endingTime, binanceCoin, creditsToken, erc20.address);
      await erc20.approve(preSale.address, ether(2*526500));
      await preSale.initializeSale(etherPriceInCents, tokenPriceInCents, binanceCoinPriceInCents, creditsTokenPriceInCents, minContributionInUSDCents, bonusTimestamps, bonusPercentages);
      await increaseTimeTo(openingTime + 10);
    });

    it('contribute more than min contribution', async () => {
      await preSale.addWhitelist(accounts[1]);
      await preSale.sendTransaction({ value: ether(60) , from: accounts[1] });
      let expectedBalance = ether(60*3000);
      let contributionBalance = await erc20.balanceOf(accounts[1]);
      contributionBalance.should.be.bignumber.equal(expectedBalance);
      let expectedBonus = ether(20*60*3000/100);
      let bonus = await preSale.bonusHolders(accounts[1]);
      bonus.should.be.bignumber.equal(expectedBonus);
      (await preSale.totalTokensSold()).should.be.bignumber.equal(expectedBonus.add(expectedBalance));
      (await preSale.bonusProvided()).should.be.bignumber.equal(expectedBonus);
    });

    it('should reject contributions from non-kyc address', async () => {
      assert(await preSale.whitelist(accounts[4]) == false);
      await preSale.sendTransaction({ value: ether(60) , from: accounts[4] }).should.be.rejectedWith(EVMRevert);
    });

    it('validate bonus and total tokens sold for multiple contributors', async () => {
      // await preSale.addWhitelist(accounts[2]);
      // await preSale.addWhitelist(accounts[3]);
      // await preSale.sendTransaction({ value: ether(60) , from: accounts[2] });
      // await preSale.sendTransaction({ value: ether(70) , from: accounts[3] });
      // let expectedBalance = ether((60 + 70) *3000); // 390 000
      // let expectedBonus = ether(35*(60+ 70)*3000/100); // 136 500
      // (await preSale.totalTokensSold()).should.be.bignumber.equal(expectedBonus.add(expectedBalance));
      // (await preSale.bonusProvided()).should.be.bignumber.equal(expectedBonus);
    });

    it('cannot contribute after the end date', async() => {
      await increaseTimeTo(endingTime + 100);
      await preSale.addWhitelist(accounts[4]);
      await preSale.sendTransaction({ value: ether(60) , from: accounts[4] }).should.rejectedWith(EVMRevert);
    });

    it('withdraw funds can be called only by admin', async () => {
      await preSale.addManyWhitelist([accounts[7]]);
      await preSale.sendTransaction({ value: ether(60) , from: accounts[7] });
      const balance = await getBalance(preSale.address);
      balance.should.be.bignumber.equal(ether(60));
      const withdrawAmount = ether(1);
      await preSale.withdrawFunds(withdrawAmount);
      const newBalance = await getBalance(preSale.address);
      newBalance.should.be.bignumber.equal(balance.sub(withdrawAmount));
      await preSale.withdrawFunds(withdrawAmount, { from: accounts[1] })
      .should.be.rejectedWith(EVMRevert);
    });
  });

  describe('Withdraw bonus', async () => {
    let preSale;
    let erc20;
    let endingTime;
    let bonus;
    beforeEach(async () => {
      const openingTime = await latestTime() + 10;
      endingTime = openingTime + duration.days(10);
      const tokenPriceInCents = 10;
      const etherPriceInCents = 3000000;
      const binanceCoinPriceInCents = 1100;
      const creditsTokenPriceInCents = 1200;
      const binanceCoin = accounts[1];
      const creditsToken = accounts[2];
      const minContributionInUSDCents  = 15000;
      const bonusPercentages = [20, 40, 50];
      const bonusTimestamps = [openingTime + duration.days(1), openingTime + duration.days(2), endingTime];
      erc20 = await Token.new(accounts[0], ether(2*526500));
      preSale = await PreSale.new(openingTime, endingTime, binanceCoin, creditsToken, erc20.address);
      await erc20.approve(preSale.address, ether(2*526500));
      await preSale.initializeSale(etherPriceInCents, tokenPriceInCents, binanceCoinPriceInCents, creditsTokenPriceInCents, minContributionInUSDCents, bonusTimestamps, bonusPercentages);
      await increaseTimeTo(openingTime + 10);
      await preSale.addWhitelist(accounts[1]);
      await preSale.addWhitelist(accounts[5]);

      await preSale.sendTransaction({ value: ether(0.5) , from: accounts[1] });
      await preSale.sendTransaction({ value: ether(0.5), from: accounts[5] });
      bonus = ether(bonusPercentages[0]*150000/100);
    });

    it('bonus cannot be claimed before icoDate is set', async () => {
      ((await preSale.releaseDate()).toNumber() == 0);
      await preSale.withdrawBonus({from:accounts[1]}).should.be.rejectedWith(EVMRevert);
    });

    it('bonus can be claimed only release date is set', async () => {

      let ICOEndDate = endingTime + 10;

      await preSale.setReleaseDate(ICOEndDate);
      await increaseTimeTo(ICOEndDate + 10);
      await preSale.finalizeCrowdsale();
      let b  = await erc20.balanceOf(accounts[1]);

      let bonus = await preSale.bonusHolders(accounts[1]);
      await preSale.withdrawBonus({ from: accounts[1] });
      (await erc20.balanceOf(accounts[1])).should.be.bignumber.equal(b.add(bonus));
      (await preSale.bonusWithdrawn()).should.be.bignumber.equal(bonus);
      assert((await preSale.bonusHolders(accounts[1])).toNumber() == 0);
      await erc20.transfer(preSale.address, 1, { from:accounts[1] });
      await preSale.addAdmin(accounts[4]);
      await preSale.withdrawToken(erc20.address, { from: accounts[4] });
      assert((await erc20.balanceOf(accounts[4])).toNumber() == 1);
    })

    it('bonus can be claimed only by assigned holders', async () => {
      let currentTime = await latestTime();
      let ICOEndDate = currentTime + 10;
      await preSale.setReleaseDate(ICOEndDate);
      await increaseTimeTo(ICOEndDate + duration.weeks(4*4));
      await preSale.withdrawBonus({from: accounts[2]}).should.be.rejectedWith(EVMRevert);

    });
  });

  describe('BNB and Credits token contribution', () => {
    let preSale;
    let erc20;
    let endingTime;
    let bonus;
    let binanceCoin;
    let creditsToken;
    let bonusPercentages;
    let bonusTimestamps;
    beforeEach(async () => {
      const openingTime = await latestTime() + 10;
      endingTime = openingTime + duration.days(10);
      const tokenPriceInCents = 10;
      const etherPriceInCents = 3000000;
      const binanceCoinPriceInCents = 1100;
      const minContributionInUSDCents  = 1100;
      const creditsTokenPriceInCents = 1200;
      bonusPercentages = [20, 40, 50];
      bonusTimestamps = [openingTime + duration.days(1), openingTime + duration.days(2), endingTime - 30];
      binanceCoin = await Token.new(accounts[1], ether(15000/11 + 9090.9090909091 + 250000/11))
      creditsToken = await Token.new(accounts[1], '0x' + BigNumber(10).pow(18).multipliedBy(1400 + 10000 + 22728).toString(16));
      erc20 = await Token.new(accounts[0], ether(17000000));
      preSale = await PreSale.new(openingTime, endingTime, binanceCoin.address, creditsToken.address, erc20.address);
      await erc20.approve(preSale.address, ether(7000000));
      await preSale.initializeSale(etherPriceInCents, tokenPriceInCents, binanceCoinPriceInCents, creditsTokenPriceInCents, 1, bonusTimestamps, bonusPercentages);
      await increaseTimeTo(openingTime + 10);
      await preSale.addWhitelist(accounts[1]);
    });

    it('should accept BNB Token', async () => {
      await binanceCoin.approve(preSale.address, ether(15000/11), { from: accounts[1] });
      await preSale.contributeInBNB({ from: accounts[1] });
      let balance = await erc20.balanceOf(accounts[1]);
      balance.should.be.bignumber.equal(ether(150000));
      let totalTokensSold = await preSale.totalTokensSold();
      let bonus = ether(150000 * 0.20);
      let bonusAssigned = await preSale.bonusHolders(accounts[1]);
      totalTokensSold.should.be.bignumber.equal(bonus.add(balance));
      let BNB_balance = await binanceCoin.balanceOf(preSale.address);
      BNB_balance.should.be.bignumber.equal(ether(15000/11));
    });

    it('should accept Credits Token', async () => {
      await creditsToken.approve(preSale.address, '0x' + BigNumber(10).pow(6).multipliedBy(15000).toString(16), { from: accounts[1] });
      await preSale.contributeInCreditsToken({ from: accounts[1] });
      let balance = await erc20.balanceOf(accounts[1]);
      balance.should.be.bignumber.equal(ether(15000*12/0.10));
      let totalTokensSold = await preSale.totalTokensSold();
      let bonus = ether(0.20 * 15000*12/0.10);
      let bonusAssigned = await preSale.bonusHolders(accounts[1]);
      totalTokensSold.should.be.bignumber.equal(bonus.add(balance));
      let creditsTokenBalance = await creditsToken.balanceOf(preSale.address);
      assert(creditsTokenBalance.toString(16) == BigNumber(10).pow(6).multipliedBy(15000).toString(16));
    });

    it('different bonus', async () => {
      let timestamps = [bonusTimestamps[0] - 10, bonusTimestamps[0], bonusTimestamps[1] - 10, bonusTimestamps[1] - 9, bonusTimestamps[2] - 10, bonusTimestamps[2]-9, bonusTimestamps[2] + 10];
      let percentages = [bonusPercentages[0], bonusPercentages[0], bonusPercentages[1], bonusPercentages[1], bonusPercentages[2], bonusPercentages[2], 0];

      for(let i=0;i<timestamps.length;i++) {
        await increaseTimeTo(timestamps[i] - 1);
        await preSale.addWhitelist(accounts[i+2]);
        await binanceCoin.transfer(accounts[i + 2], ether(1), { from: accounts[1] });
        await binanceCoin.approve(preSale.address, ether(1), {from: accounts[i + 2]});
        await preSale.contributeInBNB({ from: accounts[i + 2] });
        let bonus = await preSale.bonusHolders(accounts[i + 2]);
        let b = await erc20.balanceOf(accounts[i + 2]);
        b.should.be.bignumber.equal(ether(110));
        bonus.should.be.bignumber.equal(ether(110*percentages[i]/100));
      }
    })

    it('should not accept from non whitelisted', async () => {
      assert(await preSale.whitelist(accounts[2]) == false);
      await binanceCoin.transfer(accounts[2], ether(3000), { from: accounts[1] });
      await binanceCoin.approve(preSale.address, ether(3000));
      await preSale.contributeInBNB({ from: accounts[1] }).should.be.rejectedWith(EVMRevert);
    })

    it('should not accept from non whitelisted', async () => {
      assert(await preSale.whitelist(accounts[2]) == false);
      await binanceCoin.transfer(accounts[2], ether(3000), { from: accounts[1] });
      await binanceCoin.approve(preSale.address, ether(3000));
      await preSale.contributeInBNB({ from: accounts[1] }).should.be.rejectedWith(EVMRevert);
    });
  });

  describe('Finalization', () => {
    let preSale;
    let erc20;
    let endingTime;
    let bonus;
    const tokenPriceInCents = 10;
    const etherPriceInCents = 1000;
    const binanceCoinPriceInCents = 1100;
    const creditsTokenPriceInCents = 100;
    const minContributionInUSDCents  = 15000;
    let bonusPercentages;
    let bonusTimestamps;
    beforeEach(async () => {
      const openingTime = await latestTime() + 10;
      endingTime = openingTime + duration.days(10);
      const binanceCoin = accounts[1];
      const creditsToken = accounts[2];
      bonusPercentages = [20, 40, 50];
      bonusTimestamps = [openingTime + duration.days(1), openingTime + duration.days(2), endingTime];
      erc20 = await Token.new(accounts[0], ether(2*526500));
      preSale = await PreSale.new(openingTime, endingTime, binanceCoin, creditsToken, erc20.address);
      await increaseTimeTo(openingTime + 10);
      await preSale.addWhitelist(accounts[1]);
    });

    it('rejects contributions before initialize crowdsale', async () => {
      await preSale.sendTransaction({ value: ether(0.5) , from: accounts[1] }).
      should.be.rejectedWith(EVMRevert);
    });

    it('hasClosed should return true when max Tokens have been sold', async () => {
      await erc20.approve(preSale.address, ether(100*1.20));
      await preSale.initializeSale(etherPriceInCents, tokenPriceInCents, binanceCoinPriceInCents, creditsTokenPriceInCents, 10, bonusTimestamps, bonusPercentages);
      await preSale.sendTransaction({ value: ether(1) , from: accounts[1] });
      let balance = await erc20.balanceOf(accounts[1]);
      balance.should.be.bignumber.equal(ether(100));
      assert(await preSale.hasClosed() == true);
    });

    it('hasClosed returns true when time has crossed the closing time', async () => {
      await increaseTimeTo(endingTime);
      assert(await preSale.hasClosed() == true);
    });

    it('finalize crowdsale can be called only after the hasClosed has returned true', async () => {
      await erc20.approve(preSale.address, ether(1000* 1.20));
      await preSale.initializeSale(etherPriceInCents, tokenPriceInCents, binanceCoinPriceInCents, creditsTokenPriceInCents, minContributionInUSDCents, bonusTimestamps, bonusPercentages);
      await increaseTimeTo(endingTime + 10);
      assert(await preSale.hasClosed());
      await preSale.addAdmin(accounts[3]);
      let bonusProvided = await preSale.bonusProvided();
      let balanceOfPreSale = await erc20.balanceOf(preSale.address);
      await preSale.finalizeCrowdsale({ from: accounts[3] });
      let balanceOfAdmin = await erc20.balanceOf(accounts[3]);
      balanceOfAdmin.should.be.bignumber.equal(balanceOfPreSale.sub(bonusProvided));
    });

    it('finalize crowdsale cannot be called by non-admin', async () => {
      await erc20.approve(preSale.address, ether(150000* 1.35));
      await preSale.initializeSale(etherPriceInCents, tokenPriceInCents, binanceCoinPriceInCents, creditsTokenPriceInCents, minContributionInUSDCents, bonusTimestamps, bonusPercentages);
      await increaseTimeTo(endingTime + 10);
      await preSale.finalizeCrowdsale( { from: accounts[3] }).should.be.rejectedWith(EVMRevert);
    });

    it('finalize crowdsale cannot be called twice', async () => {
      await erc20.approve(preSale.address, ether(150000* 1.35));
      await preSale.initializeSale(etherPriceInCents, tokenPriceInCents, binanceCoinPriceInCents, creditsTokenPriceInCents, minContributionInUSDCents, bonusTimestamps, bonusPercentages);
      await increaseTimeTo(endingTime + 10);
      await preSale.finalizeCrowdsale();
      await preSale.finalizeCrowdsale().should.be.rejectedWith(EVMRevert);
    });
  });
});
