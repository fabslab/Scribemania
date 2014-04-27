define(function (require, exports, module) {

var $ = require('jquery');
require('tokeninput');

$(function documentReady() {
  var memberList = $('.create-group #members');

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

  function removeSelf() {

  }

});

});
