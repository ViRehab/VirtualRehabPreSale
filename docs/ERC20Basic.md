# ERC20Basic (ERC20Basic.sol)

**↘ Derived Contracts: [BasicToken](BasicToken.md), [ERC20](ERC20.md)**.

**ERC20Basic**

Simpler version of ERC20 interface
See https://github.com/ethereum/EIPs/issues/179

**Events**

```js
event Transfer(address indexed from, address indexed to, uint256 value);
```

## Functions

- [totalSupply](#totalsupply)
- [balanceOf](#balanceof)
- [transfer](#transfer)

### totalSupply

⤿ Overridden Implementation(s): [BasicToken.totalSupply](BasicToken.md#totalsupply)

```js
function totalSupply() public view
returns(uint256)
```

### balanceOf

⤿ Overridden Implementation(s): [BasicToken.balanceOf](BasicToken.md#balanceof)

```js
function balanceOf(address _who) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _who | address |  | 

### transfer

⤿ Overridden Implementation(s): [BasicToken.transfer](BasicToken.md#transfer)

```js
function transfer(address _to, uint256 _value) public
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address |  | 
| _value | uint256 |  | 

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
