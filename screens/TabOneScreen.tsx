import * as React from 'react';
import { StyleSheet } from 'react-native';

import { requestAccountAddress, waitForAccountAuth } from '@celo/dappkit';
import * as Linking from 'expo-linking';
import { newKitFromWeb3 } from '@celo/contractkit';
import Web3 from 'web3';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

// instatiate the kit
const web3 = new Web3('https://alfajores-forno.celo-testnet.org');
// mainnet -- comment above and uncomment below
// const web3 = new Web3('https://forno.celo.org');

const kit: any = newKitFromWeb3(web3);

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [address, setAddress] = React.useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = React.useState<string | null>(null);
  const [pepper, setPepper] = React.useState<any | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = React.useState(false);
  const [cUSDBalance, setCUSDBalance] = React.useState(0);

  const login = async () => {
    const requestId = "login"
    const dappName = "My DappName"
    const callback = Linking.makeUrl('/my/path')

    requestAccountAddress({ requestId, dappName, callback });

    const dappKitResponse = await waitForAccountAuth(requestId);

    setAddress(dappKitResponse.address);
    setPhoneNumber(dappKitResponse.phoneNumber);
    setPepper(dappKitResponse.pepper);

    setIsLoadingBalance(true);
    // set the default account to the account returned from the wallet
    kit.defaultAccount = address;
    // get the stableToken contract
    const stableToken = await kit.contracts.getStableToken();
    // get the user account balance (cUSD)
    const cUSDBalanceBig = await stableToken.balanceOf(kit.defaultAccount);

    // Convert from a big number to a string
    const cUSDBalance = cUSDBalanceBig.toString();
    setCUSDBalance(cUSDBalance);
    setIsLoadingBalance(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
