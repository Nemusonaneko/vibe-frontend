import { Flex, Button, HStack, Text, Spacer } from "@chakra-ui/react";
import { useConnect, useAccount} from "wagmi";

export default function Navbar() {

    const isReceiver = true;
    const paused = true;

    const [{ data: connectData }, connect] = useConnect()
    const [{ data: accountData }, disconnect] = useAccount()

    return (

        <Flex w="100%" h="50px" bg="pink.600">
            <HStack padding="5px" w="100%">
                <Flex w="200px">
                    <Text fontSize="28px" fontWeight="bold">
                        Let's Vibe UwU
                    </Text>
                </Flex>
                <Spacer />
                <Button fontSize="18px">
                    Deposit
                </Button>
                {isReceiver ? <Button fontSize="18px">
                    Withdraw
                </Button> : ""}
                {isReceiver ? <Button fontSize="18px">
                    {paused ? "Start" : "Stop"}
                </Button> : ""}
                {isReceiver ? "" : <Button fontSize="18px">
                    Become Receiver
                </Button>}
                <Button fontSize="18px" bg={accountData ? "red.600" : "green.600"} onClick={accountData ? disconnect : () => connect(connectData.connectors[0])}>
                    {accountData ? accountData.address.substring(0, 5) + "..." + accountData.address.substring(accountData.address.length - 5, accountData.address.length) : "Connect"}
                </Button>
            </HStack>
        </Flex>
    )
}

