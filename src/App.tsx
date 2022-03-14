import {
  ChakraProvider,
} from "@chakra-ui/react"
import { providers } from "ethers"
import { InjectedConnector, Provider, defaultChains } from "wagmi"
import Navbar from "./components/Navbar"
import ReceiverGrid from "./components/ReceiverGrid"
export default function App() {

  const chains = defaultChains

  const connectors = () => {
    return [
      new InjectedConnector({
        chains,
        options: { shimDisconnect: true },
      })
    ]
  }

  const provider = () => new providers.AlchemyProvider("kovan", "")

  return (
    <Provider autoConnect={true} connectors={connectors} provider={provider}>
      <ChakraProvider>
        <Navbar />
        <ReceiverGrid />
      </ChakraProvider>
    </Provider>
  )
}
