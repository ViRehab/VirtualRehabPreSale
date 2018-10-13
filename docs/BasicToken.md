# Basic token (BasicToken.sol)

**↗ Extends: [ERC20Basic](ERC20Basic.md)**
**↘ Derived Contracts: [StandardToken](StandardToken.md)**.

**BasicToken**

Basic version of StandardToken, with no allowances.

## Contract Members
**Constants & Variables**

```js
mapping(address => uint256) internal balances;
uint256 internal totalSupply_;
```

## Functions

- [totalSupply](#totalsupply)
- [transfer](#transfer)
- [balanceOf](#balanceof)

### totalSupply

⤾ overrides [ERC20Basic.totalSupply](ERC20Basic.md#totalsupply)

Total number of tokens in existence

```js
function totalSupply() public view
returns(uint256)
```

### transfer

⤾ overrides [ERC20Basic.transfer](ERC20Basic.md#transfer)

Transfer token for a specified address

```js
function transfer(address _to, uint256 _value) public
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address | The address to transfer to. | 
| _value | uint256 | The amount to be transferred. | 

### balanceOf

⤾ overrides [ERC20Basic.balanceOf](ERC20Basic.md#balanceof)

Gets the balance of the specified address.

```js
function balanceOf(address _owner) public view
returns(uint256)
```

**Returns**

An uint256 representing the amount owned by the passed address.

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _owner | address | The address to query the the balance of. | 

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
