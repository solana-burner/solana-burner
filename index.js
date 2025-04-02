import { useState } from 'react';
import { useWallet, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SOLANA_RPC = "https://api.mainnet-beta.solana.com"; // Solana mainnet RPC endpoint
const BURN_ADDRESS = new PublicKey("11111111111111111111111111111111"); // Solana Burn Address
const OWNER_WALLET = new PublicKey("4tsqYXoU63pbS7oTXd51jHfFwRFgHmSwGBDFyvn74GeU"); // Your 5% fee wallet

export default function BurnPage() {
    const wallet = useWallet();
    const [tokenAddress, setTokenAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBurn = async () => {
        if (!wallet.connected) return alert('Please connect your wallet.');
        if (!tokenAddress || !amount) return alert('Enter token address and amount.');
        
        setLoading(true);
        try {
            const connection = new Connection(SOLANA_RPC);
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: BURN_ADDRESS,
                    lamports: (parseFloat(amount) * 0.95) * 1e9 // Send 95% to burn
                }),
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: OWNER_WALLET,
                    lamports: (parseFloat(amount) * 0.05) * 1e9 // Send 5% to owner
                })
            );
            const signature = await wallet.sendTransaction(transaction, connection);
            alert(`Burn transaction submitted! Signature: ${signature}`);
        } catch (error) {
            alert('Error burning tokens.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md p-6 shadow-xl">
                <CardContent className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Solana Token Burner</h2>
                    <WalletMultiButton />
                    <Input placeholder="Token Address" value={tokenAddress} onChange={e => setTokenAddress(e.target.value)} />
                    <Input placeholder="Amount (SOL)" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
                    <Button onClick={handleBurn} disabled={loading} className="bg-red-500 hover:bg-red-600">
                        {loading ? 'Burning...' : 'Burn Tokens'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
