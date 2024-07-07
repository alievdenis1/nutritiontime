import "@stdlib/deploy";
import "@stdlib/ownable";

const GAME_MASTER_ADDRESS: Address = address("EQB02DJ0cdUD4iQDRbBv4aYG3htePHBRK1tGeRtCnatescK0"); // Замените на реальный адрес GameMaster
const POVEL_DUREV_ADDRESS: Address = address("EQB02DJ0cdUD4iQDRbBv4aYG3htePHBRK1tGeRtCnatescK0");

// Jetton operation codes
const TRANSFER: Int = 0xf8a7ea5;
const INTERNAL_TRANSFER: Int = 0x178d4519;

message Deposit {
    amount: Int as coins;
}

message Withdraw {
    amount: Int as coins;
}

message PerformAction {
    actionType: Int as uint8;
    cost: Int as coins;
}

message TransferNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forwardPayload: Slice as remaining;
}

contract PlayerWallet with Deployable {
    owner: Address;
    balance: Int as coins;

    init(owner: Address) {
        self.owner = owner;
        self.balance = 0;
    }

    receive("Deposit") {
        // This function is called when POVEL DUREV tokens are received
        // The actual deposit logic is handled in the TransferNotification message
    }

    receive(msg: TransferNotification) {
        require(sender() == POVEL_DUREV_ADDRESS, "Only accept transfers from POVEL DUREV");
        self.balance = self.balance + msg.amount;
    }

    receive(msg: Withdraw) {
        require(sender() == self.owner, "Only owner can withdraw");
        require(self.balance >= msg.amount, "Insufficient balance");

        self.balance = self.balance - msg.amount;

        send(SendParameters{
        to: POVEL_DUREV_ADDRESS,
        value: 0,
        mode: SendRemainingValue,
        body: beginCell()
        .storeUint(TRANSFER, 32)
        .storeUint(0, 64) // queryId
        .storeCoins(msg.amount)
        .storeAddress(self.owner)
        .storeAddress(myAddress()) // response destination
        .storeUint(0, 1) // no custom payload
        .storeCoins(0) // forward amount
        .storeUint(0, 1) // no forward payload
        .endCell()
        });
    }

    receive(msg: PerformAction) {
        require(sender() == self.owner, "Only owner can perform actions");
        require(self.balance >= msg.cost, "Insufficient balance for action");

        self.balance = self.balance - msg.cost;

        send(SendParameters{
        to: GAME_MASTER_ADDRESS,
        value: 0,
        mode: SendRemainingValue,
        body: beginCell()
        .storeUint(msg.actionType, 32)
        .storeAddress(self.owner)
        .storeCoins(msg.cost)
        .endCell()
        });
    }

    get fun balance(): Int {
        return self.balance;
    }

    get fun owner(): Address {
        return self.owner;
    }
}