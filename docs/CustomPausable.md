﻿# This contract enables you to create pausable mechanism to stop in case of emergency. (CustomPausable.sol)

**↗ Extends: [CustomAdmin](CustomAdmin.md)**
**↘ Derived Contracts: [CustomWhitelist](CustomWhitelist.md), [EtherPrice](EtherPrice.md), [TokenPrice](TokenPrice.md), [BinanceCoinPrice](BinanceCoinPrice.md), [CreditsTokenPrice](CreditsTokenPrice.md), [BonusHolder](BonusHolder.md)**.

**CustomPausable**

## Contract Members
**Constants & Variables**

```js
bool public paused;
```

**Events**

```js
event Paused();
event Unpaused();
```

## Modifiers

- [whenNotPaused](#whennotpaused)
- [whenPaused](#whenpaused)

### whenNotPaused

Verifies whether the contract is not paused.

```js
modifier whenNotPaused() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### whenPaused

Verifies whether the contract is paused.

```js
modifier whenPaused() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Functions

- [pause](#pause)
- [unpause](#unpause)

### pause

Pauses the contract.

```js
function pause() external onlyAdmin whenNotPaused
```

### unpause

Unpauses the contract and returns to normal state.

```js
function unpause() external onlyAdmin whenPaused
```

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
