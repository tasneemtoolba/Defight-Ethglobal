pragma solidity ^0.8.35;

contract TravellingSalesmanBenchmark
{

    struct Point {
        uint256 x;
        uint256 y;
    }

    mapping(uint256 => mapping(uint8 => Point)) public points;
    mapping(uint256 => mapping(string => uint)) public scoreboard;

    struct distCompCheckpoint {
        uint distanceScaled;
        uint x1;
        uint y1;
        uint x2;
        uint y2;
        uint xDiff;
        uint yDiff;
    }


    mapping(uint256 => mapping(uint => distCompCheckpoint)) public answerDistsCheckpoint; //used for testing, gotta see that its computing correctly

    event AnswerSubmitted(uint roundId, string agentId, uint score);

    function submitResponse(string calldata agentResponse, string calldata agentId, uint roundId) public returns (bool correctFormat)
    {
        correctFormat = validateAY(agentResponse);
        if(correctFormat)
        {
            // compute score, add to leaderboard
            scoreboard[roundId][agentId] = _computeScore(agentResponse, roundId);
            emit AnswerSubmitted(roundId, agentId, scoreboard[roundId][agentId]);
        }
        else
        {
            // TODO set score to 0, add to leaderboard 
                // since scores are high, maybe these need to be reversed
        }
    }

    // validates that the input string is of the form "ABCD....WXY" with 25 chars and exactly one instnace of each
    function validateAY(string memory input) public pure returns (bool) {
        bytes memory str = bytes(input);

        // Must be exactly 25 characters (A-Y)
        if (str.length != 25) return false;

        uint256 seen = 0;

        for (uint i = 0; i < 25; i++) {
            bytes1 char = str[i];

            // Ensure character is between 'A' and 'Y'
            if (char < 0x41 || char > 0x59) return false;

            uint256 index = uint8(char) - uint8(bytes1("A"));
            uint256 mask = 1 << index;

            // If already seen → duplicate
            if (seen & mask != 0) return false;

            seen |= mask;
        }

        // Check all 25 bits are set: (1 << 25) - 1
        return seen == ((1 << 25) - 1);
    }

    function _computeScore(string memory path, uint roundId) public returns (uint score) {
        bytes memory str = bytes(path);

        uint256 total = 0;

        for (uint256 i = 0; i < 24; i++) {
            uint8 from = uint8(str[i]) -65;
            uint8 to = uint8(str[i + 1]) -65;

            Point memory p1 = points[roundId][from];
            Point memory p2 = points[roundId][to];

            uint256 dx = p1.x > p2.x ? p1.x - p2.x : p2.x - p1.x;
            uint256 dy = p1.y > p2.y ? p1.y - p2.y : p2.y - p1.y;

            uint256 distSquared = dx * dx + dy * dy;

            // sqrt(distSquared * 1e6) = sqrt(distSquared) * 1000
            uint256 distScaled = sqrt(distSquared * 1e6);

            answerDistsCheckpoint[roundId][i].distanceScaled = distScaled;
            answerDistsCheckpoint[roundId][i].x1 = p1.x;
            answerDistsCheckpoint[roundId][i].x2 = p2.x;
            answerDistsCheckpoint[roundId][i].y1 = p1.y;
            answerDistsCheckpoint[roundId][i].y2 = p2.y;
            answerDistsCheckpoint[roundId][i].xDiff = dx;
            answerDistsCheckpoint[roundId][i].yDiff = dy;



            total += distScaled;
        }

        return total;
    }

    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;

        uint256 z = (x + 1) / 2;
        uint256 y = x;

        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }

    return y;
    }

    function createRound(uint256 round, Point[25] calldata newPoints) public
    {
        for (uint8 i = 0; i < 25; i++) {
            // Optional safety check if you want to enforce bounds
            require(newPoints[i].x <= 100 && newPoints[i].y <= 100, "Out of bounds");

            points[round][i] = newPoints[i];
        }
    }
    
}