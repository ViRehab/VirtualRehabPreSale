# This contract keeps track of Credits Token price. (CreditsTokenPrice.sol)

**↗ Extends: [CustomPausable](CustomPausable.md)**
**↘ Derived Contracts: [PreSale](PreSale.md)**.

**CreditsTokenPrice**

## Contract Members
**Constants & Variables**

```js
uint256 public creditsTokenPriceInCents;
```

**Events**

```js
event CreditsTokenPriceChanged(uint256 _newPrice, uint256 _oldPrice);
```

## Functions

- [setCreditsTokenPrice](#setcreditstokenprice)

### setCreditsTokenPrice

```js
function setCreditsTokenPrice(uint256 _cents) public whenNotPaused onlyAdmin
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _cents | uint256 |  | 

## Contracts

- [CustomWhitelist](CustomWhitelist.md)
- [FinalizableCrowdsale](FinalizableCrowdsale.md)
- [EtherPrice](EtherPrice.md)
- [TokenPrice](TokenPrice.md)
- [ERC20Basic](ERC20Basic.md)
- [SafeMath](SafeMath.md)
- [BinanceCoinPrice](BinanceCoinPrice.md)
- [ERC20Mock](ERC20Mock.md)
- [BasicToken](BasicToken.md)
- [SafeERC20](SafeERC20.md)
- [PreSale](PreSale.md)
- [TimedCrowdsale](TimedCrowdsale.md)
- [StandardToken](StandardToken.md)
- [CustomPausable](CustomPausable.md)
- [Crowdsale](Crowdsale.md)
- [CreditsTokenPrice](CreditsTokenPrice.md)
- [CustomAdmin](CustomAdmin.md)
- [BonusHolder](BonusHolder.md)
- [Migrations](Migrations.md)
- [Ownable](Ownable.md)
- [ERC20](ERC20.md)
