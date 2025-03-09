// "use client";

// import Link from "next/link";
// import type { NextPage } from "next";
// import React from "react";
// import { useAccount } from "wagmi";
// import { BoltIcon, BookOpenIcon, BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";
// import {
//   formatEther,
//   formatUnits,
//   Contract,
//   BrowserProvider,
//   JsonRpcProvider,
//   parseUnits,
// } from "ethers";

// // --- ABIs ---

// // Minimal read-only ERC-20 ABI (for balanceOf)
// const erc20ReadAbi = [
//   {
//     constant: true,
//     inputs: [{ name: "_owner", type: "address" }],
//     name: "balanceOf",
//     outputs: [{ name: "balance", type: "uint256" }],
//     type: "function",
//   },
// ];

// // Minimal write ERC-20 ABI (for approve)
// const erc20ApproveAbi = [
//   "function approve(address spender, uint256 amount) external returns (bool)",
// ];

// // Minimal ERC4626 vault ABI (for deposit)
// const vaultAbi = [
//   "function deposit(uint256 assets, address receiver) external returns (uint256 shares)",
// ];

// // --- Contract Addresses ---
// const USDC_CONTRACT = "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea"; // 6 decimals
// const THYRA_CONTRACT = "0x8082f7867b21c11f8D8a15010294c12A811530F6"; // Our vault

// const Home: NextPage = () => {
//   const { address: connectedAddress } = useAccount();

//   // Create a provider: use window.ethereum if available; otherwise, use your RPC URL.
//   const provider =
//     typeof window !== "undefined" && window.ethereum
//       ? new BrowserProvider(window.ethereum)
//       : new JsonRpcProvider(process.env.NEXT_PUBLIC_MONAD_RPC_URL);

//   // --- Balances ---
//   const [monBalance, setMonBalance] = React.useState("");
//   const [usdcBalance, setUsdcBalance] = React.useState("");
//   const [thyraBalance, setThyraBalance] = React.useState("");

//   // --- Approve State ---
//   const [approvalAmount, setApprovalAmount] = React.useState("");

//   // --- Deposit State ---
//   const [depositAmount, setDepositAmount] = React.useState("");

//   // --- Fetch Balances ---
//   React.useEffect(() => {
//     if (!connectedAddress || !provider) return;

//     const fetchBalances = async () => {
//       try {
//         // Native MON balance
//         const nativeBal = await provider.getBalance(connectedAddress);
//         setMonBalance(formatEther(nativeBal));

//         // USDC balance (6 decimals)
//         const usdcContract = new Contract(USDC_CONTRACT, erc20ReadAbi, provider);
//         const rawUsdcBal = await usdcContract.balanceOf(connectedAddress);
//         setUsdcBalance(formatUnits(rawUsdcBal, 6));

//         // THYRA (assuming it's also an ERC-20; if it's the vault itself, you might see 0 if no shares minted)
//         const thyraContract = new Contract(THYRA_CONTRACT, erc20ReadAbi, provider);
//         const rawThyraBal = await thyraContract.balanceOf(connectedAddress);
//         setThyraBalance(formatEther(rawThyraBal));
//       } catch (err) {
//         console.error("Error fetching balances:", err);
//       }
//     };

//     fetchBalances();
//   }, [connectedAddress, provider]);

//   // --- Approve USDC ---
//   const handleApprove = async () => {
//     if (!connectedAddress) {
//       console.error("Wallet not connected");
//       return;
//     }

//     try {
//       const signer = await provider.getSigner(); // ethers v6 => getSigner() returns a Promise
//       const usdcContract = new Contract(USDC_CONTRACT, erc20ApproveAbi, signer);
//       const amount = parseUnits(approvalAmount, 6); // parse with 6 decimals
//       const tx = await usdcContract.approve(THYRA_CONTRACT, amount);
//       console.log("Approval transaction sent:", tx);
//       await tx.wait();
//       console.log("Approval transaction confirmed:", tx);
//     } catch (err) {
//       console.error("Error approving USDC:", err);
//     }
//   };

//   // --- Deposit USDC into Vault ---
//   const handleDeposit = async () => {
//     if (!connectedAddress) {
//       console.error("Wallet not connected");
//       return;
//     }

//     try {
//       const signer = await provider.getSigner();
//       const vaultContract = new Contract(THYRA_CONTRACT, vaultAbi, signer);
//       // deposit(uint256 assets, address receiver)
//       const assets = parseUnits(depositAmount, 6); // parse with 6 decimals
//       const tx = await vaultContract.deposit(assets, connectedAddress);
//       console.log("Deposit transaction sent:", tx);
//       await tx.wait();
//       console.log("Deposit transaction confirmed:", tx);
//     } catch (err) {
//       console.error("Error depositing USDC:", err);
//     }
//   };

//   return (
//     <>
//       <div className="flex items-center flex-col flex-grow pt-10">
//         <div className="px-5">
//           <h1 className="text-center">
//             <span className="block text-2xl mb-2">Welcome to</span>
//             <span className="block text-4xl font-bold">Scaffold-ETH-Monad</span>
//           </h1>
//           <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
//             <p className="my-2 font-medium">Connected Address:</p>
//             <Address address={connectedAddress} />
//           </div>
//           <p className="text-center text-lg">
//             Get started by editing{" "}
//             <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
//               packages/nextjs/app/page.tsx
//             </code>
//           </p>
//           <p className="text-center text-lg">
//             Edit your smart contract{" "}
//             <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
//               YourContract.sol
//             </code>{" "}
//             in{" "}
//             <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
//               packages/hardhat/contracts
//             </code>
//           </p>
//         </div>

//         {/* Balances Section */}
//         <div className="mt-8 text-center">
//           <h2 className="text-2xl font-bold">My Balances</h2>
//           {!connectedAddress ? (
//             <p>Please connect your wallet.</p>
//           ) : (
//             <div className="mt-4 space-y-2">
//               <p>MON: {monBalance}</p>
//               <p>USDC: {usdcBalance}</p>
//               <p>THYRA: {thyraBalance}</p>
//             </div>
//           )}
//         </div>

//         {/* Approve USDC for Vault */}
//         <div className="mt-12 text-center">
//           <h2 className="text-2xl font-bold">Approve USDC for vault</h2>
//           <div className="mt-4 flex justify-center items-center space-x-4">
//             <input
//               type="number"
//               step="any"
//               placeholder="Enter USDC amount"
//               className="input input-bordered w-64"
//               value={approvalAmount}
//               onChange={e => setApprovalAmount(e.target.value)}
//             />
//             <button className="btn btn-primary" onClick={handleApprove}>
//               Approve
//             </button>
//           </div>
//           <p className="mt-2 text-sm">
//             Enter the USDC amount (in whole units) to approve for the vault contract.
//           </p>
//         </div>

//         {/* Deposit USDC into Vault */}
//         <div className="mt-12 text-center">
//           <h2 className="text-2xl font-bold">Deposit USDC into vault</h2>
//           <div className="mt-4 flex justify-center items-center space-x-4">
//             <input
//               type="number"
//               step="any"
//               placeholder="Enter USDC amount"
//               className="input input-bordered w-64"
//               value={depositAmount}
//               onChange={e => setDepositAmount(e.target.value)}
//             />
//             <button className="btn btn-primary" onClick={handleDeposit}>
//               Deposit USDC
//             </button>
//           </div>
//           <p className="mt-2 text-sm">
//             Enter the USDC amount (in whole units) to deposit into the vault.
//           </p>
//         </div>

//         {/* Footer Section */}
//         <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
//           <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
//             <div className="flex flex-col bg-base-200 border-base-100 border-2 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
//               <BoltIcon className="h-8 w-8" />
//               <p>
//                 Get testnet funds from the{" "}
//                 <Link href="#" passHref className="link">
//                   Faucet
//                 </Link>
//               </p>
//             </div>
//             <div className="flex flex-col bg-base-200 border-base-100 border-2 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
//               <BugAntIcon className="h-8 w-8" />
//               <p>
//                 Tinker with your smart contract using the{" "}
//                 <Link href="/debug" passHref className="link">
//                   Debug Contracts
//                 </Link>{" "}
//                 tab.
//               </p>
//             </div>
//             <div className="flex flex-col bg-base-200 border-base-100 border-2 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
//               <MagnifyingGlassIcon className="h-8 w-8" />
//               <p>
//                 Explore your local transactions with the{" "}
//                 <Link href="#" passHref className="link">
//                   Block Explorer
//                 </Link>{" "}
//                 tab.
//               </p>
//             </div>
//             <div className="flex flex-col bg-base-200 border-base-100 border-2 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
//               <BookOpenIcon className="h-8 w-8" />
//               <p>
//                 Learn more about{" "}
//                 <Link href="https://docs.monad.xyz" passHref className="link" target="_blank">
//                   Monad
//                 </Link>
//                 .
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Home;
