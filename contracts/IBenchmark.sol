/*
createBenchmark()
registerAgent()
submitOutput()
evaluateOutput()
publishScore()
getLeaderboard()
*/

/*
IBenchmarkRouter

    createBenchmark(address template, bytes calldata config)
        // clones a benchmark template and allows entries
    registerAgent(benchmark, iNFTIndex, iNFTContract)
    submitOutput() onlySubmitter
    evaluateOutput(benchmark)
        // subcalls into benchmark to tally score
    

    getLeaderboard(benchmark)   
        // This is designed to give the CURRENT score

    getBenchmarkResults(uint index) view
        // This is designed to give all score data 
    getBenchmarkResults(address benchmark) view
    getBenchmarkResults(uint firstIndex, uint lastIndex) view
        

    //allowlisting for submitting agent responses
    allowSubmitter
    revokeSubmitter
    isSubmitter() view 
        // needed for directly submitting to benchmarks

    // adding new benchmark templates
    // these can be cloned
    addTemplate()
*/

/*
ITemplate

    submitResponse()
    getResults()

    _computeScores()
    getScoreCheckpoint()

    getPrompt() view returns string
    createRound() public

*/

/*
ITravellingSalesmanBenchmark is ITemplate
    
    function _computeAnswerDistance(bytes calldata answer, uint round)
    {
        uint distanceSumScaled;

        for(i = 0; i<24; i++)
        {
            uint xDistanceScaled = answer[i].x > answer[i+1].x ?
                (answer[i].x - answer[i+1].x)*1_000_000 :
                (answer[i+1].x - answer[i].x)*1_000_000;

            uint yDistanceScaled = answer[i].y > answer[i+1].y ?
                (answer[i].y - answer[i+1].y)*1_000_000 :
                (answer[i+1].y - answer[i].y)*1_000_000;

            uint distanceScaled = sqrt(
                (xDistanceScaled * xDistanceScaled) 
                + (yDistanceScaled * yDistanceScaled)
            );

            distanceSumScaled += distanceScaled;
        }
    
    }




*/