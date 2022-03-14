import { Flex, Button, HStack, Spacer, Box } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useConnect, useAccount } from "wagmi";
import useGetVibeContract from "./GetVibeContract";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
import ButtplugConnectButton from "./ButtplugConnectButton";

export default function Navbar() {

    const [{ data: connectData }, connect] = useConnect()
    const [{ data: accountData }, disconnect] = useAccount()

    const contract = useGetVibeContract();
    const [isReceiver, setIsReceiver] = useState<boolean>();
    const [acceptsDeposits, setacceptsDeposits] = useState<boolean>();
    const [depBal, setDepBal] = useState<number>(0);
    const [withdrawBal, setWithdrawBal] = useState<number>(0);

    useEffect(() => {
        async function update() {
            const address: string = await contract.signer._address;
            const depositInfo = await contract.depositors(address);
            const receiver = await contract.receivers(address);
            setIsReceiver(receiver[1]);
            setDepBal(depositInfo / 1e18);
            if (isReceiver) {
                setacceptsDeposits(receiver[2]);
                setWithdrawBal(receiver[0] / 1e18);
            }
        }
        update()
    })

    const beReceiver = useCallback(() => {
        contract.becomeReceiver()
    }, [contract])

    const toggleDep = useCallback(() => {
        contract.toggleAcceptDeposits()
    }, [contract])

    return (
        <Flex w="100%" h="50px" bg="#457b9d">
            <HStack padding="5px" w="100%">
                <Flex w="200px" fontWeight="bold" fontSize="28px">
                    Let's Vibe UwU
                </Flex>
                <Spacer />
                <DepositModal />
                <Box width="100px" textAlign="center" fontSize="18px" fontWeight="bold">
                    {depBal.toFixed(2)} DAI
                </Box>
                {isReceiver ? <WithdrawModal /> : ""}
                {isReceiver ? <Box width="100px" textAlign="center" fontSize="18px" fontWeight="bold">
                    {withdrawBal.toFixed(2)} DAI
                </Box> : ""}
                {isReceiver ? <Button onClick={toggleDep} fontSize="18px">
                    {acceptsDeposits ? "Stop" : "Start"}
                </Button> : ""}
                {isReceiver ? "" : <Button onClick={beReceiver} fontSize="18px">
                    Become Receiver
                </Button>}
                <ButtplugConnectButton/>
                <Button fontSize="18px" bg={accountData ? "red.600" : "green.600"} onClick={accountData ? disconnect : () => connect(connectData.connectors[0])}>
                    {accountData ? accountData.address.substring(0, 5) + "..." + accountData.address.substring(accountData.address.length - 5, accountData.address.length) : "Connect"}
                </Button>
            </HStack>
        </Flex>
    )
}

