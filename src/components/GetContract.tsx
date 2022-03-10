import { useContract, useSigner } from "wagmi";
import abi from "./abis/vibeAbi.json";

export default function useGetContract() {

    const [{data}] = useSigner();

    const contract = useContract({
        addressOrName: "0x5daF92FB6587866bA91F14cE397EDc0a5Ee34507",
        contractInterface: abi,
        signerOrProvider: data
    })

    return (
        contract? contract: undefined
    )

}