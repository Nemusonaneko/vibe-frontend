import { useContract, useSigner } from "wagmi";
import abi from "./abis/daiAbi.json";

export default function useDepositTokenContract() {

    const [{data:signerData}] = useSigner();

    const contract = useContract({
        addressOrName: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        contractInterface: abi,
        signerOrProvider: signerData
    })

    return (
        contract
    )

}