pragma solidity ^0.8.35;

contract BTCPricePredictionBenchmark
{
    mapping(uint256 round => uint256) public actualPrices;

    mapping(uint256 round => mapping(string agentId => uint)) public submittedAnswers;
    mapping(uint256 round => string[]) public responsesPerRound;


    struct ScoreboardElement {
        string agentId;
        uint score;
    }

    struct ScoreboardRound {
        uint numResponses;
        uint bestRoundAnswer;
        string bestRoundAnswerProvider;
        mapping(string agentId => uint) score;
        ScoreboardElement[10] top10;
    }


    mapping(uint round => ScoreboardRound) public scoreboard;


    function submitResponse(uint roundId, string calldata agentId, uint agentResponse) public 
    {
        require(agentResponse != 0, "Agent response cannot be 0");
        require(actualPrices[roundId] == 0, "Round already has been resolved");

        //TODO: there need to be more sanity checks and access control here. Fine for demo
            // TODO: implement a check on the time of the prediction

        submittedAnswers[roundId][agentId] = agentResponse;
        responsesPerRound[roundId].push(agentId);   //TODO: add a check that prevents double-submission
    

    }

    function provideActualPrice(uint roundId, uint actualPrice) public
    {
        //TODO need access control
        actualPrices[roundId] = actualPrice;
    }

    function scoreInputs(uint roundId) public
    {
        require(actualPrices[roundId] != 0, "The round has not resolved yet");
        
//        uint previousBest = 10e50;  // this is absurdly high, as a "good" answer is lower

        // for all submissions, compute the score as the absolute value of diff 
        for(uint i = 0; i < responsesPerRound[roundId].length; i++ )
        {
            uint actual = actualPrices[roundId];
            string memory agent = responsesPerRound[roundId][i];
            uint submitted = submittedAnswers[roundId][agent];

            uint score;

            if(actual > submitted)
            {
                score = actual - submitted;
            }
            else
            {
                score = submitted - actual;
            }

            scoreboard[roundId].numResponses++;
            
            _insertScore(score, roundId, agent);

/*
            if(i == 0)
            {
                previousBest = score;
                scoreboard[roundId].bestRoundAnswer = score;
                scoreboard[roundId].bestRoundAnswerProvider = agent;
            }
            else if(score < previousBest)
            {
                previousBest = score;
                scoreboard[roundId].bestRoundAnswer = score;
                scoreboard[roundId].bestRoundAnswerProvider = agent;
            }
*/          
            scoreboard[roundId].score[agent] = score;

        }

        scoreboard[roundId].bestRoundAnswer = scoreboard[roundId].top10[0].score;
        scoreboard[roundId].bestRoundAnswerProvider = scoreboard[roundId].top10[0].agentId;
    }


    function _insertScore(uint256 newScore, uint roundId, string memory agentId) internal {
        require(newScore > 0, "Score must be > 0");

        for (uint i = 0; i < 10; i++) {
            // Case 1: empty slot → insert here
            if (scoreboard[roundId].top10[i].score == 0) {
                scoreboard[roundId].top10[i].score = newScore;
                return;
            }

            // Case 2: better score → insert and shift
            if (newScore < scoreboard[roundId].top10[i].score) {
                uint256 temp = scoreboard[roundId].top10[i].score;
                scoreboard[roundId].top10[i].score = newScore;

                // shift the rest down
                for (uint j = i + 1; j < 10; j++) {
                    uint256 next = scoreboard[roundId].top10[j].score;
                    scoreboard[roundId].top10[j].score = temp;
                    temp = next;

                    // stop early if we hit an empty slot
                    if (temp == 0) return;
                }

                return;
            }
        }

        // Case 3: worse than all existing scores → ignore
    }

    function showLeaderboard(uint roundId) public view returns (ScoreboardElement[10] memory top10)
    {
        return scoreboard[roundId].top10;
    }

    function getPrompt() public view returns (string calldata prompt)
    {
        return "What will the BTC price on Binance be on May 15th at 00:00 UTC? Please format your answer in dollars, with no decimals. Only include the price in your response, and no words. Otherwise you will fail."
    }
    
}