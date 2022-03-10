import { Flex, Button, HStack, Text, Spacer, Box, useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, NumberInput, NumberInputField } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useConnect, useAccount } from "wagmi";
import BigNumber from "bignumber.js";
import useGetVibeContract from "./GetVibeContract";
import useDepositTokenContract from "./DepositTokenContract";

export default function Navbar() {

    const [{ data: connectData }, connect] = useConnect()
    const [{ data: accountData }, disconnect] = useAccount()
    const { isOpen: depIsOpen, onOpen: depOnOpen, onClose: depOnClose } = useDisclosure();
    const { isOpen: withIsOpen, onOpen: withOnOpen, onClose: withOnClose } = useDisclosure();

    const contract = useGetVibeContract();
    const dai = useDepositTokenContract();
    const [isReceiver, setIsReceiver] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [depBal, setDepBal] = useState<number>(0);
    const [withdrawBal, setWithdrawBal] = useState<number>(0);
    const [depInput, setDepInput] = useState<number>(0);
    const [withInput, setWithInput] = useState<number>(0);

    useEffect(() => {
        async function update() {
            const address: string = await contract.signer._address;
            const depositInfo = await contract.depositors(address);
            const receiver = await contract.receivers(address);
            setIsReceiver(receiver[1]);
            setDepBal(depositInfo / 1e18);
            if (isReceiver) {
                setIsPaused(receiver[2]);
                setWithdrawBal(receiver[0] / 1e18);
            }
        }
        update()
        const interval = setInterval(() => {
            update()
        }, 1000);
        return () => clearInterval(interval);
    })

    const beReceiver = useCallback(() => {
        contract.becomeReceiver()
    }, [contract])

    const toggleDep = useCallback(() => {
        contract.toggleAcceptDeposits()
    }, [contract])

    const depositDai = useCallback(() => {
        const value = new BigNumber(depInput).times(1e18).toFixed(0);
        dai.approve("0x5daF92FB6587866bA91F14cE397EDc0a5Ee34507", value);
        contract.deposit(value)
    }, [contract, depInput, dai])

    const withdrawDai = useCallback(() => {
        const value = new BigNumber(withInput).times(1e18).toFixed(0);
        contract.withdraw(value)
    }, [contract, withInput])

    return (
        <Flex w="100%" h="50px" bg="pink.600">
            <HStack padding="5px" w="100%">
                <Flex w="200px" fontWeight="bold" fontSize="28px">
                    Let's Vibe UwU
                </Flex>
                <Spacer />
                <Button fontSize="18px" onClick={depOnOpen}>
                    Deposit
                </Button>
                <Modal isOpen={depIsOpen} onClose={depOnClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader fontWeight="bold" fontSize="30px">
                            Deposit DAI
                        </ModalHeader>
                        <ModalBody marginBottom="20px">
                            <HStack>
                            <NumberInput width="100%" onChange={(i) => setDepInput(parseInt(i))}>
                                <NumberInputField/>
                            </NumberInput>
                            <Spacer/>
                            <Button onClick={depositDai}>
                                Deposit
                            </Button>
                            <Button onClick={depOnClose}>
                                Close
                            </Button>
                            </HStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>
                <Box width="100px" textAlign="center" fontSize="18px" fontWeight="bold">
                    {depBal.toString()} DAI
                </Box>
                {isReceiver ? <Button fontSize="18px" onClick={withOnOpen}>
                    Withdraw
                </Button> : ""}
                <Modal isOpen={withIsOpen} onClose={withOnClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader fontWeight="bold" fontSize="30px">
                            Withdraw DAI
                        </ModalHeader>
                        <ModalBody marginBottom="20px">
                            <HStack>
                            <NumberInput width="100%" onChange={(i) => setWithInput(parseInt(i))}>
                                <NumberInputField/>
                            </NumberInput>
                            <Spacer/>
                            <Button onClick={withdrawDai}>
                                Withdraw
                            </Button>
                            <Button onClick={withOnClose}>
                                Close
                            </Button>
                            </HStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>
                {isReceiver ? <Box width="100px" textAlign="center" fontSize="18px" fontWeight="bold">
                    {withdrawBal.toString()} DAI
                </Box> : ""}
                {isReceiver ? <Button onClick={toggleDep} fontSize="18px">
                    {isPaused ? "Start" : "Stop"}
                </Button> : ""}
                {isReceiver ? "" : <Button onClick={beReceiver} fontSize="18px">
                    Become Receiver
                </Button>}
                <Button fontSize="18px" bg={accountData ? "red.600" : "green.600"} onClick={accountData ? disconnect : () => connect(connectData.connectors[0])}>
                    {accountData ? accountData.address.substring(0, 5) + "..." + accountData.address.substring(accountData.address.length - 5, accountData.address.length) : "Connect"}
                </Button>
            </HStack>
        </Flex>
    )
}

