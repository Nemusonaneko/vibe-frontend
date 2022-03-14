import { Button } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useCallback, useEffect, useRef, useState } from "react"
import { useProvider } from "wagmi";
import abi from "./abis/vibeAbi.json";
declare const window: any;
export default function ButtplugConnectButton() {

    const Buttplug = window.Buttplug;
    const [device, setDevice] = useState<any>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const provider = useProvider();
    const client = useRef<any>();
    const contract = new ethers.Contract("0xF19b4ef092c7164C5CBD6104bE3cbfF09C85Bc1F", abi, provider);

    const connectPlug = useCallback(() => {
        async function initialize() {
            await Buttplug.buttplugInit();
            let connector = new Buttplug.ButtplugEmbeddedConnectorOptions();
            client.current = new Buttplug.ButtplugClient("Client");
            client.current.addListener("deviceadded", (device: any) => {
                console.log("device connected", device);
                setDevice(device);
                setIsConnected(device);
            })
            client.current.addListener("deviceremoved", (device: any) => {
                setIsConnected(false);
                setDevice(null);
            })
            await client.current.connect(connector);
            await client.current.startScanning();
        }
        initialize();
    }, [Buttplug, client])

    const disconnectPlug = useCallback(() => {
        async function discon() {
            await client.current.disconnect();
        }
        discon();
    }, [client])

    const testVibe = useCallback(() => {
        async function test() {
            await device.vibrate(.1);
        }
        test()
    }, [device])

    const stopVibe = useCallback(() => {
        async function test() {
            await device.stop();
        }
        test()
    }, [device])


    return (
        <>
            {isConnected ? <Button onClick={disconnectPlug}>Disconnect Plug</Button> : <Button onClick={connectPlug}>
                Connect Plug
            </Button>}
            <Button onClick={testVibe}>Start Vibe</Button>
            <Button onClick={stopVibe}>Stop Vibe</Button>
        </>
    )
}