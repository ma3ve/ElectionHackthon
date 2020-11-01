// SPDX-License-Identifier: MIT
pragma solidity >0.5.0 <0.7.1;

contract Factory {
    address electionAddress;
    event GetELectionAddress(address _electionAddress);

    function createElection() public returns (address) {
        electionAddress = address(new Election(msg.sender));
        emit GetELectionAddress(electionAddress);
    }
}

contract Election {
    address public admin;
    mapping(address => bool) public Voter;
    mapping(address => bool) private Voted;
    mapping(address => bool) private Staff;
    struct Candidate {
        bool isCandidate;
        uint256 votes;
        uint256 id;
    }
    mapping(address => Candidate) private Candidates;
    address[] public candidateArray;
    uint256 candidateCount;
    bool started;

    modifier onlyAdmin() {
        require(admin != msg.sender, "Only admin can call this function");
        _;
    }

    modifier onlyStaff() {
        require(Staff[msg.sender], "Only staff can call this function");
        _;
    }

    modifier beforeStart() {
        require(!started, "can't edit candidates after election started");
        _;
    }

    modifier afterStart() {
        require(started, "can't vote before the election started");
        _;
    }

    constructor(address _admin) public {
        admin = _admin;
        Staff[admin] = true;
    }

    function createStaff(address _staffAddress) public onlyAdmin {
        Staff[_staffAddress] = true;
    }

    function deleteStaff(address _staffAddress) public onlyAdmin {
        Staff[_staffAddress] = false;
    }

    function createVoter(address _voterAddress) public onlyStaff beforeStart {
        Voter[_voterAddress] = true;
    }

    function deleteVoter(address _voterAddress) public onlyStaff beforeStart {
        Voter[_voterAddress] = false;
    }

    function createCandidate(address _candidateAddress)
        public
        onlyStaff
        beforeStart
    {
        Candidates[_candidateAddress] = Candidate(true, 0, candidateCount);
        candidateArray.push(_candidateAddress);
        candidateCount++;
    }

    function deleteCandidate(address _candidateAddress)
        public
        onlyStaff
        beforeStart
    {
        if (!Candidates[_candidateAddress].isCandidate)
            revert("candidate doesnt exists");
        delete candidateArray[Candidates[_candidateAddress].id];
        Candidates[_candidateAddress].isCandidate = false;
        candidateCount--;
    }

    function castVote(address _candidateAddress) public afterStart {
        if (!Voter[msg.sender]) revert("you cant vote");
        Candidates[_candidateAddress].votes++;
        Voted[msg.sender] = true;
    }

    function getVotes(address _candidateAddress)
        public
        view
        onlyAdmin
        returns (uint256)
    {
        if (!Candidates[_candidateAddress].isCandidate)
            revert("candidate doesnt exist");
        return Candidates[_candidateAddress].votes;
    }
}
