import Web3InboxService from "../src/web3InboxService";

beforeEach(() => {
  fetch.resetMocks();
});

describe("Web3InboxService", () => {
  it("should send a notification and return success", async () => {
    // Mock API response
    fetch.mockResponseOnce(JSON.stringify({ success: true }));

    // Initialize Web3InboxService with test parameters
    const projectId = "test_project_id";
    const apiSecret = "test_api_secret";
    const rpcUrl = "http://localhost:8545"; // Example RPC URL for testing
    const web3InboxService = new Web3InboxService(projectId, apiSecret, rpcUrl);

    // Define test notification parameters
    const notificationTypeId = "test_notification_type_id";
    const title = "Test Notification";
    const body = "This is a test notification body";
    const accountIds = ["0x123...", "0x456..."]; // Example Ethereum addresses

    // Call the sendNotification function
    const response = await web3InboxService.sendNotification(
      notificationTypeId,
      title,
      body,
      accountIds
    );

    // Assertions to validate behavior
    expect(response).toEqual({ success: true });
    expect(fetch).toHaveBeenCalledTimes(1);

    // Check if fetch was called with the correct endpoint and options
    expect(fetch).toHaveBeenCalledWith(
      `https://notify.walletconnect.com/${projectId}/notify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiSecret}`,
        },
        body: JSON.stringify({
          notification: {
            type: notificationTypeId,
            title: title,
            body: body,
            icon: "https://app.example.com/icon.png", // Replace with actual icon URL if needed
            url: "https://app.example.com", // Replace with actual URL if needed
          },
          accounts: accountIds,
        }),
      }
    );
  });
});
