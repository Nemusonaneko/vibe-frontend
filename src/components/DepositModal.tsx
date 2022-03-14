import { Button, HStack, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, NumberInput, NumberInputField, Spacer, useDisclosure } from "@chakra-ui/react";
import { BigNumber } from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import useDepositTokenContract from "./DepositTokenContract";
import useGetVibeContract from "./GetVibeContract";

export default function DepositModal() {

    const contract = useGetVibeContract();
    const dai = useDepositTokenContract();
    const [enoughAllowance, setEnoughAllowance] = useState<boolean>();
    const [allowanceVal, setAllowanceVal] = useState<number>(0);
    const [depInput, setDepInput] = useState<number>(0);
    const { isOpen: depIsOpen, onOpen: depOnOpen, onClose: depOnClose } = useDisclosure();

    useEffect(() => {
        async function update() {
            const address: string = await contract.signer._address;
            const allowance = await dai.allowance(address, contract.address);
            setAllowanceVal(allowance);
            if (Number(depInput) * 1e18 > allowanceVal) {
                setEnoughAllowance(false)
            } else {
                setEnoughAllowance(true)
            }
        }
        update()
    })

    const approveDai = useCallback(() => {
        const value = new BigNumber(depInput).times(1e18).toFixed(0);
        dai.approve("0xF19b4ef092c7164C5CBD6104bE3cbfF09C85Bc1F", value);
    }, [dai, depInput])

    const depositDai = useCallback(() => {
        const value = new BigNumber(depInput).times(1e18).toFixed(0);
        contract.deposit(value)
    }, [contract, depInput])

    return (
        <>
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
                            <NumberInput width="100%" onChange={(i) => {
                                setDepInput(Number(i));
                            }}>
                                <NumberInputField />
                            </NumberInput>
                            <Spacer />
                            {enoughAllowance ? <Button onClick={depositDai}>
                                Deposit
                            </Button> : <Button onClick={approveDai}>
                                Approve
                            </Button>}
                            <Button onClick={depOnClose}>
                                Close
                            </Button>
                        </HStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}