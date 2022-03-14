import { useContract, useSigner } from "wagmi";
import abi from "./abis/vibeAbi.json";

export default function useGetVibeContract() {

    const [{data:signerData}] = useSigner();

    const contract = useContract({
        addressOrName: "0xF19b4ef092c7164C5CBD6104bE3cbfF09C85Bc1F",
        contractInterface: abi,
        signerOrProvider: signerData
    })

    return (
        contract
    )

}