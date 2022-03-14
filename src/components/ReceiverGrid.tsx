import { Flex, SimpleGrid, Box, Text, NumberInput, NumberInputField, Heading, Button, HStack } from "@chakra-ui/react";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import useGetVibeContract from "./GetVibeContract";

export default function ReceiverGrid() {

    const [receivers, setReceivers] = useState<{ address: string, timeEnd: number }[]>([])
    const [transInput, setTransInput] = useState<number>(0);
    const [selectedAdd, setSelectedAdd] = useState<string>("");
    const [currentTime, setCurrentTime] = useState<number>(0);

    const contract = useGetVibeContract();

    useEffect(() => {
        async function getReceivers() {
            let receiverResult: { address: string, timeEnd: number }[] = [];
            const allAddresses: string[] = await contract.receiverAddresses();
            const allReceivers = await contract.getAllReceivers();
            const time = Date.now() / 100;
            setCurrentTime(time);
            for (let i = 0; i < allAddresses.length; i++) {
                const address: string = allAddresses[i];
                const receiver = allReceivers[i];
                if (!receiver[2]) continue;
                receiverResult.push({
                    address: address,
                    timeEnd: receiver[3]
                });
            }
            setReceivers(receiverResult)
        }

        getReceivers()
    })

    const handleTransfer = (address: string) => {
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
                            Time:
                        </Heading>
                        <Text fontSize="18px" marginLeft="5px" marginBottom="5px">
                            {currentTime - p.timeEnd > 0? currentTime - p.timeEnd: "0"}s
                        </Text>
                        <HStack marginTop="30px">
                            <NumberInput onChange={(i) => setTransInput(parseFloat(i))}>
                                <NumberInputField bg="blue.600" />
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
