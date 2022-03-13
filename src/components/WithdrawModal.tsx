import { Button, HStack, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, NumberInput, NumberInputField, Spacer, useDisclosure } from "@chakra-ui/react";
import BigNumber from "bignumber.js";
import { useCallback, useState } from "react";
import useGetVibeContract from "./GetVibeContract";

export default function WithdrawModal() {

    const contract = useGetVibeContract();
    const [withInput, setWithInput] = useState<number>(0);
    const { isOpen: withIsOpen, onOpen: withOnOpen, onClose: withOnClose } = useDisclosure();

    const withdrawDai = useCallback(() => {
        const value = new BigNumber(withInput).times(1e18).toFixed(0);
        contract.withdraw(value)
    }, [contract, withInput])

    return (
        <>
            <Button fontSize="18px" onClick={withOnOpen}>
                Withdraw
            </Button>
            <Modal isOpen={withIsOpen} onClose={withOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="bold" fontSize="30px">
                        Withdraw DAI
                    </ModalHeader>
                    <ModalBody marginBottom="20px">
                        <HStack>
                            <NumberInput width="100%" onChange={(i) => setWithInput(parseInt(i))}>
                                <NumberInputField />
                            </NumberInput>
                            <Spacer />
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
        </>
    )
}
