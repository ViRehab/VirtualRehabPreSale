#!/bin/bash
# Flattens the Vibeo token contract.
/usr/local/share/dotnet/dotnet "../SolidityFlattener/bin/Debug/netcoreapp2.1/SolidityFlattener.dll" "contracts/PreSale.sol" "flattened/PreSale.sol" ".,../node_modules"
echo "Success!"