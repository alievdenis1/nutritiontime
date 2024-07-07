import "@stdlib/deploy";
import "@stdlib/ownable";

const POVEL_DUREV_ADDRESS: Address = address("EQB02DJ0cdUD4iQDRbBv4aYG3htePHBRK1tGeRtCnatescK0");

// Jetton operation codes
const TRANSFER: Int = 0xf8a7ea5;

struct Item {
    id: Int as uint32;
    owner: Address;
    price: Int as coins;
    description: String;
}

message ListItem {
    id: Int as uint32;
    price: Int as coins;
    description: String;
}

message BuyItem {
    id: Int as uint32;
}

message CancelListing {
    id: Int as uint32;
}

message UpdateFee {
    newFee: Int as uint16;
}

contract Marketplace with Deployable, OwnableTransferable {
    owner: Address;
    items: map<Int, Item>;
    nextItemId: Int as uint32;
    feePercentage: Int as uint16;

    init() {
        self.owner = sender();
        self.nextItemId = 0;
        self.feePercentage = 500; // 5% fee (500 basis points)
    }

    receive(msg: ListItem) {
        let itemId: Int = self.nextItemId;
        self.nextItemId = self.nextItemId + 1;

        self.items.set(itemId, Item{
        id: itemId,
        owner: sender(),
        price: msg.price,
        description: msg.description
        });

        // Emit event or send notification about new listing
    }

    receive(msg: BuyItem) {
        let itemOpt: Item? = self.items.get(msg.id);
        require(itemOpt != null, "Item not found");
        let item: Item = itemOpt!!;

        require(sender() != item.owner, "Cannot buy your own item");

        let fee: Int = (item.price * self.feePercentage) / 10000;
        let sellerAmount: Int = item.price - fee;

        // Transfer tokens from buyer to seller and marketplace
        send(SendParameters{
        to: POVEL_DUREV_ADDRESS,
        value: 0,
        mode: SendRemainingValue,
        body: beginCell()
        .storeUint(TRANSFER, 32)
        .storeUint(0, 64) // queryId
        .storeCoins(sellerAmount)
        .storeAddress(item.owner)
        .storeAddress(myAddress()) // response destination
        .storeUint(0, 1) // no custom payload
        .storeCoins(0) // forward amount
        .storeUint(0, 1) // no forward payload
        .endCell()
        });

        send(SendParameters{
        to: POVEL_DUREV_ADDRESS,
        value: 0,
        mode: SendRemainingValue,
        body: beginCell()
        .storeUint(TRANSFER, 32)
        .storeUint(0, 64) // queryId
        .storeCoins(fee)
        .storeAddress(self.owner)
        .storeAddress(myAddress()) // response destination
        .storeUint(0, 1) // no custom payload
        .storeCoins(0) // forward amount
        .storeUint(0, 1) // no forward payload
        .endCell()
        });

        // Remove item from listings
        self.items.set(msg.id, null);

        // Emit event or send notification about successful purchase
    }

    receive(msg: CancelListing) {
        let itemOpt: Item? = self.items.get(msg.id);
        require(itemOpt != null, "Item not found");
        let item: Item = itemOpt!!;

        require(sender() == item.owner, "Only the owner can cancel the listing");

        // Remove item from listings
        self.items.set(msg.id, null);

        // Emit event or send notification about cancelled listing
    }

    receive(msg: UpdateFee) {
        require(sender() == self.owner, "Only owner can update fee");
        self.feePercentage = msg.newFee;
    }

    get fun getItem(id: Int): Item? {
        return self.items.get(id);
    }

    get fun getItemsCount(): Int {
        return self.nextItemId;
    }
}