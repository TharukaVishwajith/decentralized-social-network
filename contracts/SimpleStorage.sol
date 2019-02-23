pragma solidity 0.5.0;

contract SimpleStorage {

//  uint256 masterAddress = 0x7CacEE641aa61292c6035906384811186B5F3A2D;


  string ipfsHash;
  // Model a Candidate
  struct User {
      uint id;
      string userIpfsHash;
      uint friendsCount;
      string friends;
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

  mapping(uint => address) public userAddressList;

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
    userAddressList[userCount] = msg.sender;
    users[_address] = User(userCount, _userIpfsHash , 0, '');
//    users[_address] = User(userCount, _userIpfsHash , _friends);
  }

  function updateUser(string memory _userIpfsHash, uint256 _address) public{
    User storage  u = users[_address];
//    users[_address] = User(userCount, _userIpfsHash, u.friendsCount, u.friends);
    u.userIpfsHash = _userIpfsHash;
//    users[_address] = User(userCount, _userIpfsHash, u.friends);
  }

  function getUserByAddress(uint256 _address) public returns (uint id, string memory userIpfsHash, string memory friends) {
    // copy the data into memory
    User memory u = users[_address];

    // break the struct's members out into a tuple
    // in the same order that they appear in the struct
    return (u.id, u.userIpfsHash, u.friends);
  }


  function addNewPost(string memory _postIpfsHash, string memory _date) public{
    postCount++;
    posts[postCount] = Post(_postIpfsHash, _date, msg.sender);
  }

//  function getMasterAddress() public returns (uint256 masterAddress){
//    return masterAddress;
//  }

  function addFriend(uint256 _address, string memory _friends) public{
    User storage  u = users[_address];
//    f.push(_friend);
    u.friendsCount++;
//    u.friends =  concat(u.friends,';');
    u.friends = _friends;
//    users[_address] = User(userCount, u.userIpfsHash, u.friendsCount, u.friends);
//    users[_address] = User(userCount, u.userIpfsHash, u.friends);
  }

  function concat(string memory _a, string memory _b)private view returns (string memory) {
    bytes memory bytes_a = bytes(_a);
    bytes memory bytes_b = bytes(_b);
    string memory length_ab = new string(bytes_a.length + bytes_b.length);
    bytes memory bytes_c = bytes(length_ab);
    uint k = 0;
    for (uint i = 0; i < bytes_a.length; i++) bytes_c[k++] = bytes_a[i];
    for (uint i = 0; i < bytes_b.length; i++) bytes_c[k++] = bytes_b[i];
    return string(bytes_c);
  }
}
