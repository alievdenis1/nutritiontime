import "@stdlib/deploy";
import "@stdlib/ownable";

const MAX_TOP_PLAYERS: Int = 100;

struct PlayerScore {
    address: Address;
    score: Int as uint32;
}

message UpdateScore {
    player: Address;
    newScore: Int as uint32;
}

contract Leaderboard with Deployable, OwnableTransferable {
    owner: Address;
    gameMaster: Address;
    topPlayers: map<Int, PlayerScore>;
    playerRanks: map<Address, Int>;
    lowestTopScore: Int as uint32;

    init(gameMaster: Address) {
        self.owner = sender();
        self.gameMaster = gameMaster;
        self.lowestTopScore = 0;
    }

    receive(msg: UpdateScore) {
        require(sender() == self.gameMaster, "Only GameMaster can update scores");

        let currentRank: Int? = self.playerRanks.get(msg.player);

        if (currentRank != null) {
            let currentScore: PlayerScore? = self.topPlayers.get(currentRank!!);
            if (currentScore != null && currentScore!!.score >= msg.newScore) {
                // Score didn't improve, no update needed
                return;
            }
            // Remove the old score
            self.topPlayers.set(currentRank!!, null);
        }

        // Find the new rank for the player
        let newRank: Int = self.findNewRank(msg.newScore);

        if (newRank <= MAX_TOP_PLAYERS) {
            // Shift down all players below the new rank
            let i: Int = MAX_TOP_PLAYERS;
            while (i > newRank) {
                let playerAtPrevRank: PlayerScore? = self.topPlayers.get(i - 1);
                if (playerAtPrevRank != null) {
                    self.topPlayers.set(i, playerAtPrevRank!!);
                    self.playerRanks.set(playerAtPrevRank!!.address, i);
                }
                i = i - 1;
            }

            // Insert the new score
            self.topPlayers.set(newRank, PlayerScore{address: msg.player, score: msg.newScore});
            self.playerRanks.set(msg.player, newRank);

            // Update the lowest top score
            let lowestScorePlayer: PlayerScore? = self.topPlayers.get(MAX_TOP_PLAYERS);
            if (lowestScorePlayer != null) {
                self.lowestTopScore = lowestScorePlayer!!.score;
            } else {
                self.lowestTopScore = 0;
            }
        }
    }

    fun findNewRank(score: Int): Int {
        let rank: Int = 1;
        while (rank <= MAX_TOP_PLAYERS) {
            let playerAtRank: PlayerScore? = self.topPlayers.get(rank);
            if (playerAtRank == null || score > playerAtRank!!.score) {
                return rank;
            }
            rank = rank + 1;
        }
        return MAX_TOP_PLAYERS + 1;
    }

    get fun getTopPlayers(): map<Int, PlayerScore> {
        return self.topPlayers;
    }

    get fun getPlayerRank(player: Address): Int? {
        return self.playerRanks.get(player);
    }

    get fun getLowestTopScore(): Int {
        return self.lowestTopScore;
    }
}