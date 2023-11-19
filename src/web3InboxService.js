import fetch from "node-fetch";
import Web3 from "web3"; // or use ethers

class Web3InboxService {
  constructor(projectId, apiSecret, rpcUrl) {
    this.projectId = projectId;
    this.apiSecret = apiSecret;
    this.web3 = new Web3(rpcUrl); // Initialize Web3 with an Ethereum RPC URL
    this.baseURL = `https://notify.walletconnect.com/${this.projectId}/notify`;
  }

  async resolveAddress(addressOrEns) {
    if (addressOrEns.endsWith(".eth")) {
      // Resolve ENS
      return await this.web3.eth.ens.getAddress(addressOrEns);
    }
    // Add similar logic for Lens if needed
    return addressOrEns; // Return the address if it's not an ENS name
  }

  async sendNotification(notificationTypeId, title, body, addressesOrEns) {
    try {
      // Resolve all ENS/Lens names to addresses
      const accountIds = await Promise.all(
        addressesOrEns.map((addr) => this.resolveAddress(addr))
      );

      const response = await fetch(this.baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiSecret}`,
        },
        body: JSON.stringify({
          notification: {
            type: notificationTypeId,
            title: title,
            body: body,
            icon: "https://app.example.com/icon.png", // optional
            url: "https://app.example.com", // optional
          },
          accounts: accountIds,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }
}

export default Web3InboxService;
