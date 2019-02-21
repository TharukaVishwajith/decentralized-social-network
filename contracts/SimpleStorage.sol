pragma solidity 0.5.0;

contract SimpleStorage {

//  uint256 masterAddress = 0x7CacEE641aa61292c6035906384811186B5F3A2D;

  string ipfsHash;
  // Model a Candidate
  struct User {
      uint id;
      string userIpfsHash;
  }

  struct Post{
    string postIpfsHash;
    string date;
    address author;
  }

  uint public postCount;

  // Store Candidates Count
  uint public userCount;

  mapping(uint256 => User) public users;

  mapping(uint => Post) public posts;
    // Store Candidates Count
    uint public candidatesCount;

  function set(string memory x) public {
    ipfsHash = x;
  }

  function get() public view returns (string memory) {
    return ipfsHash;
  }

  function addNewUser(string memory _userIpfsHash, uint256 _address) public{
    userCount ++;
    users[_address] = User(userCount, _userIpfsHash);
  }

  function updateUser(string memory _userIpfsHash, uint256 _address) public{
    users[_address] = User(userCount, _userIpfsHash);
  }

  function getUserByAddress(uint256 _address) public returns (uint id, string memory userIpfsHash) {
    // copy the data into memory
    User memory u = users[_address];

    // break the struct's members out into a tuple
    // in the same order that they appear in the struct
    return (u.id, u.userIpfsHash);
  }


  function addNewPost(string memory _postIpfsHash, string memory _date) public{
    postCount++;
    posts[postCount] = Post(_postIpfsHash, _date, msg.sender);
  }

//  function getMasterAddress() public returns (uint256 masterAddress){
//    return masterAddress;
//  }
}
