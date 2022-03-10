import { Flex, SimpleGrid, Box, Text, NumberInput, NumberInputField, Heading, Button, HStack } from "@chakra-ui/react";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import useGetVibeContract from "./GetVibeContract";

export default function ReceiverGrid() {

    const [receivers, setReceivers] = useState<{ address: string, timeLeft: number }[]>([])
    const [transInput, setTransInput] = useState<number>(0);
    const [selectedAdd, setSelectedAdd] = useState<string>("");

    const contract = useGetVibeContract();

    useEffect(() => {
        async function getReceivers() {
            let receiverResult:{address: string, timeLeft: number}[] = [];
            const allAddresses:string[] = await contract.receiverAddresses();
            for (let i = 0; i < allAddresses.length; i++) {
                const address:string = allAddresses[i];
                receiverResult.push({
                    address: address,
                    timeLeft: 0
                });
            }
            setReceivers(receiverResult)
        }

        getReceivers()

        const interval = setInterval(() => {
            getReceivers()
        }, 1000);

        return () => clearInterval(interval);
    })

    const handleTransfer = (address:string) => {
        setSelectedAdd(address)
        transferToken()
    }

    const transferToken = useCallback(() => {
        const value = new BigNumber(transInput).times(1e18).toFixed(0);
        contract.transferToReceiver(selectedAdd, value);
    }, [contract, transInput, selectedAdd])

    return (
        <Flex padding="15px">
            <SimpleGrid columns={5} spacing={20}>
                {receivers ? receivers.map((p) => (
                    <Box height="200px" width="350px" bg="blue.500" borderRadius="10px" padding="10px">
                        <Heading fontSize="20px">
                            Address:
                        </Heading>
                        <Text fontSize="14px" marginLeft="5px" marginBottom="5px">
                            {p.address}
                        </Text>
                        <Heading fontSize="20px">
                            Vibration Time:
                        </Heading>
                        <Text fontSize="18px" marginLeft="5px" marginBottom="5px">
                            Yes
                        </Text>
                        <HStack marginTop="30px">
                            <NumberInput onChange={(i) => setTransInput(parseFloat(i))}>
                                <NumberInputField bg="blue.600"/>
                            </NumberInput>
                            <Button onClick={() => handleTransfer(p.address)}>
                                Transfer
                            </Button>
                        </HStack>
                    </Box>
                )) : ""}
            </SimpleGrid>
        </Flex>

    )
}