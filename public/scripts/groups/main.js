define(function (require, exports, module) {

var $ = require('jquery');
require('tokeninput');

$(function createMemberList() {
  var memberList = $('.create-group #members');

  var userData = $('.init-user').text();
  if (userData) userData = JSON.parse(userData);

  memberList.tokenInput('/users', {
    hintText: 'Type in a user\'s name',
    preventDuplicates: true,
    onAdd: updateMemberInput,
    onDelete: updateMemberInput,
    onResult: removeSelf
  });

  function updateMemberInput() {
    var memberIds = memberList.tokenInput('get').map(function(member) {
      return member.id;
    });
    memberList.value = memberIds.join(',');
  }

  function removeSelf(results) {
    return results.filter(function(member) {
      return member.id !== userData.id;
    });
  }

});

});
