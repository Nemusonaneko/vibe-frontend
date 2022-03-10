import {
  ChakraProvider,
} from "@chakra-ui/react"
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

  return (
    <Provider autoConnect={true} connectors={connectors}>
      <ChakraProvider>
        <Navbar />
        <ReceiverGrid />
      </ChakraProvider>
    </Provider>
  )
}
