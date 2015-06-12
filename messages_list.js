Template.flashMessages.helpers({
  messages: function (namespace) {

	var query = {};
	if(namespace) {
		query = {"options.namespace": namespace};
	}

    if (flashMessages.find(query).count() && FlashMessages.options.autoScroll)
      $('html, body').animate({
        scrollTop: 0
      }, 200);
    var messages = flashMessages.find(query).fetch();
    $.each(messages, function(index, value) {
      value.group = value.message instanceof Array;
    });
    return messages;
  }
});

Template.flashMessageItem.rendered = function () {
  var message = this.data;
  Meteor.defer(function() {
    flashMessages.update(message._id, {$set: {seen: true}});
  });
  if (message.options && message.options.autoHide) {
    $alert = $(this.find('.alert'));
    Meteor.setTimeout(function() {
        $alert.fadeOut(400, function() {
          flashMessages.remove({_id: message._id});
        });    
      }, 
      message.options.hideDelay);
  }
};

Template.flashMessageItem.events({
  "click .close": function (e, tmpl) {
    e.preventDefault();
    flashMessages.remove(tmpl.data._id);
  }
});