import "@stdlib/deploy";
import "@stdlib/ownable";

const SECONDS_IN_DAY: Int = 86400;
const ACTIONS_PER_DAY: Int = 5;
const MAX_PLAYERS: Int = 10000;
const TOP_PLAYERS_COUNT: Int = 10;
const POVEL_DUREV_ADDRESS: Address = address("EQB02DJ0cdUD4iQDRbBv4aYG3htePHBRK1tGeRtCnatescK0");

// Jetton operation codes
const MINT: Int = 21;
const INTERNAL_TRANSFER: Int = 0x178d4519;
const BURN: Int = 0x595f07bc;

struct PlayerData {
    reputation: Int as uint16;
    energy: Int as uint8;
    health: Int as uint8;
    devSkills: Int as uint8;
    lastActionTime: Int as uint32;
    actionsToday: Int as uint8;
    upgrades: Int as uint8;
    rating: Int as uint32;
}

struct UpgradeData {
    name: String;
    cost: Int as coins;
    effectType: Int as uint8;
    effectValue: Int as uint8;
}

message Register {
    playerAddress: Address;
}

message PerformAction {
    playerAddress: Address;
    actionType: Int as uint8;
}

message BuyUpgrade {
    playerAddress: Address;
    upgradeId: Int as uint8;
}

message LaunchProject {
    playerAddress: Address;
}

message DistributeRewards {
    queryId: Int as uint64;
}

contract GameMaster with Deployable, OwnableTransferable {
    owner: Address;
    players: map<Address, PlayerData>;
    upgrades: map<Int, UpgradeData>;
    weeklyPool: Int as coins;
    lastWeeklyDistribution: Int as uint32;
    totalPlayers: Int as uint32;
    topPlayers: map<Int, Address>;

    init() {
        self.owner = sender();
        self.weeklyPool = 0;
        self.lastWeeklyDistribution = now();
        self.totalPlayers = 0;
        self.initializeUpgrades();
    }

    fun initializeUpgrades() {
        self.upgrades.set(0, UpgradeData{
        name: "Programming Courses",
        cost: ton("50"),
        effectType: 3,
        effectValue: 5
        });
        self.upgrades.set(1, UpgradeData{
        name: "PR Training",
        cost: ton("50"),
        effectType: 0,
        effectValue: 5
        });
        self.upgrades.set(2, UpgradeData{
        name: "Gym Membership",
        cost: ton("100"),
        effectType: 2,
        effectValue: 10
        });
        self.upgrades.set(3, UpgradeData{
        name: "Energy Drink Supply",
        cost: ton("100"),
        effectType: 1,
        effectValue: 10
        });
        self.upgrades.set(4, UpgradeData{
        name: "Hire Assistant",
        cost: ton("200"),
        effectType: 4,
        effectValue: 1
        });
    }

    receive(msg: Register) {
        require(self.totalPlayers < MAX_PLAYERS, "Maximum number of players reached");
        require(self.players.get(msg.playerAddress) == null, "Player already registered");

        let newPlayer: PlayerData = PlayerData{
        reputation: 10,
        energy: 100,
        health: 100,
        devSkills: 10,
        lastActionTime: now(),
        actionsToday: 0,
        upgrades: 0,
        rating: 10
        };
        self.players.set(msg.playerAddress, newPlayer);
        self.totalPlayers = self.totalPlayers + 1;
        self.updateTopPlayers(msg.playerAddress, newPlayer.rating);
        self.sendTokens(msg.playerAddress, ton("100"));
    }

    receive(msg: PerformAction) {
        let playerOpt: PlayerData? = self.players.get(msg.playerAddress);
        require(playerOpt != null, "Player not found");
        let player: PlayerData = playerOpt!!;
        require(self.canPerformAction(player), "No actions left today");

        if (msg.actionType == 0) {
            // Develop
            player.devSkills = min(player.devSkills + 1, 255);
            player.energy = max(player.energy - 10, 0);
            player.rating = player.rating + 1;
        } else if (msg.actionType == 1) {
            // Network
            player.reputation = min(player.reputation + 1, 65535);
            player.energy = max(player.energy - 10, 0);
            player.rating = player.rating + 1;
        } else if (msg.actionType == 2) {
            // Rest
            player.health = min(player.health + 10, 255);
            player.energy = min(player.energy + 10, 255);
        } else {
            require(false, "Invalid action type");
        }

        player.actionsToday = player.actionsToday + 1;
        player.lastActionTime = now();
        self.players.set(msg.playerAddress, player);
        self.updateTopPlayers(msg.playerAddress, player.rating);
        self.weeklyPool = self.weeklyPool + ton("10");
    }

    receive(msg: BuyUpgrade) {
        let playerOpt: PlayerData? = self.players.get(msg.playerAddress);
        require(playerOpt != null, "Player not found");
        let player: PlayerData = playerOpt!!;

        let upgradeOpt: UpgradeData? = self.upgrades.get(msg.upgradeId);
        require(upgradeOpt != null, "Upgrade not found");
        let upgrade: UpgradeData = upgradeOpt!!;

        require((player.upgrades & (1 << msg.upgradeId)) == 0, "Upgrade already purchased");

        self.sendTokens(myAddress(), upgrade.cost);
        self.weeklyPool = self.weeklyPool + upgrade.cost;

        if (upgrade.effectType == 0) {
            player.reputation = min(player.reputation + upgrade.effectValue, 65535);
        } else if (upgrade.effectType == 1) {
            player.energy = min(player.energy + upgrade.effectValue, 255);
        } else if (upgrade.effectType == 2) {
            player.health = min(player.health + upgrade.effectValue, 255);
        } else if (upgrade.effectType == 3) {
            player.devSkills = min(player.devSkills + upgrade.effectValue, 255);
        }

        player.upgrades = player.upgrades | (1 << msg.upgradeId);
        player.rating = player.rating + 5;
        self.players.set(msg.playerAddress, player);
        self.updateTopPlayers(msg.playerAddress, player.rating);
    }

    receive(msg: LaunchProject) {
        let playerOpt: PlayerData? = self.players.get(msg.playerAddress);
        require(playerOpt != null, "Player not found");
        let player: PlayerData = playerOpt!!;
        require(player.devSkills >= 20, "Insufficient dev skills");

        self.sendTokens(myAddress(), ton("50"));
        self.weeklyPool = self.weeklyPool + ton("50");

        let successChance: Int = (player.devSkills + player.reputation) / 2;
        let success: Bool = random(0, 100) < successChance;
        if (success) {
            player.reputation = min(player.reputation + 50, 65535);
            player.rating = player.rating + 20;
            self.sendTokens(msg.playerAddress, ton("200"));
        } else {
            player.reputation = max(player.reputation - 10, 0);
            player.rating = max(player.rating - 5, 0);
        }

        self.players.set(msg.playerAddress, player);
        self.updateTopPlayers(msg.playerAddress, player.rating);
    }

    receive(msg: DistributeRewards) {
        require(sender() == self.owner, "Only owner can distribute rewards");
        require(now() - self.lastWeeklyDistribution >= 7 * SECONDS_IN_DAY, "Too early for distribution");

        let totalRewards: Int = self.weeklyPool;
        let playerReward: Int = (totalRewards * 60) / 1000;

        let i: Int = 0;
        repeat (TOP_PLAYERS_COUNT) {
            let playerAddressOpt: Address? = self.topPlayers.get(i);
            if (playerAddressOpt != null) {
                self.sendTokens(playerAddressOpt!!, playerReward);
            }
            i = i + 1;
        }

        self.burnTokens((totalRewards * 15) / 100);
        self.sendTokens(self.owner, (totalRewards * 15) / 100);

        self.weeklyPool = (totalRewards * 10) / 100;
        self.lastWeeklyDistribution = now();
    }

    fun canPerformAction(player: PlayerData): Bool {
        return (now() - player.lastActionTime >= SECONDS_IN_DAY) || (player.actionsToday < ACTIONS_PER_DAY);
    }

    fun sendTokens(to: Address, amount: Int) {
        send(SendParameters{
        to: POVEL_DUREV_ADDRESS,
        value: 0,
        mode: SendRemainingValue,
        body: beginCell()
        .storeUint(MINT, 32)
        .storeUint(0, 64)  // query_id
        .storeAddress(to)
        .storeCoins(amount)
        .storeRef(beginCell()
        .storeUint(INTERNAL_TRANSFER, 32)
        .storeUint(0, 64)  // query_id
        .storeCoins(amount)
        .storeAddress(myAddress())  // from_address
        .storeAddress(to)  // response_address
        .storeUint(0, 1)  // no custom_payload
        .storeCoins(0)  // forward_ton_amount
        .storeUint(0, 1)  // no forward_payload
        .endCell()
        )
        .endCell()
        });
    }

    fun burnTokens(amount: Int) {
        send(SendParameters{
        to: POVEL_DUREV_ADDRESS,
        value: 0,
        mode: SendRemainingValue,
        body: beginCell()
        .storeUint(BURN, 32)
        .storeUint(0, 64)  // query_id
        .storeCoins(amount)
        .storeAddress(myAddress())  // response_destination
        .storeUint(0, 1)  // no custom_payload
        .endCell()
        });
    }

    fun updateTopPlayers(address: Address, rating: Int) {
        let i: Int = 0;
        let inserted: Bool = false;

        repeat (TOP_PLAYERS_COUNT) {
            if (!inserted) {
                let currentTopPlayerOpt: Address? = self.topPlayers.get(i);
                if (currentTopPlayerOpt == null) {
                    self.topPlayers.set(i, address);
                    inserted = true;
                } else {
                    let currentTopPlayerData: PlayerData? = self.players.get(currentTopPlayerOpt!!);
                    if (currentTopPlayerData != null && rating > currentTopPlayerData!!.rating) {
                        // Shift down all players below
                        let j: Int = TOP_PLAYERS_COUNT - 1;
                        while (j > i) {
                            let prevPlayerOpt: Address? = self.topPlayers.get(j - 1);
                            if (prevPlayerOpt != null) {
                                self.topPlayers.set(j, prevPlayerOpt!!);
                            }
                            j = j - 1;
                        }
                        self.topPlayers.set(i, address);
                        inserted = true;
                    }
                }
            }
            i = i + 1;
        }
    }

    get fun getPlayerData(address: Address): PlayerData? {
        return self.players.get(address);
    }

    get fun getUpgradeData(id: Int): UpgradeData? {
        return self.upgrades.get(id);
    }

    get fun getWeeklyPool(): Int {
        return self.weeklyPool;
    }

    get fun getTopPlayers(): map<Int, Address> {
        return self.topPlayers;
    }
}