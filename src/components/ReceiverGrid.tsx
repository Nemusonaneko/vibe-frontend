import { Flex, SimpleGrid, Box, Text, NumberInput, NumberInputField, Heading, Button, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useGetContract from "./GetContract";

export default function ReceiverGrid() {

    const [receivers, setReceivers] = useState<{ address: string, timeLeft: number }[]>([])

    const contract = useGetContract();

    useEffect(() => {
        async function getReceivers() {

            let receiverResult = [];
            const allAddresses = await contract.receiverAddresses();
            const getReceivers = await contract.getAllReceivers();
            for (let i = 0; i < allAddresses.length; i++) {
                const address = allAddresses[i];
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



    return (
        <Flex padding="15px">
            <SimpleGrid columns={5}>
                {receivers ? receivers.map((p) => (
                    <Box height="180px" width="350px" bg="blue.500" borderRadius="10px" padding="10px">
                        <Heading fontSize="20px">
                            Address:
                        </Heading>
                        <Text fontSize="14px" marginLeft="5px">
                            {p.address}
                        </Text>
                        <Heading fontSize="20px">
                            Vibration Time:
                        </Heading>
                        <Text fontSize="18px" marginLeft="5px">
                            Yes
                        </Text>
                        <HStack marginTop="20px">
                            <NumberInput>
                                <NumberInputField bg="blue.600" />
                            </NumberInput>
                            <Button>
                                Transfer
                            </Button>
                        </HStack>
                    </Box>
                )) : ""}
            </SimpleGrid>
        </Flex>

    )
}