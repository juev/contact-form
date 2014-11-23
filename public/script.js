$(document).ready(function() {

  Backbone.Validation.configure({
    forceUpdate: true
  });

  _.extend(Backbone.Validation.callbacks, {
    valid: function (view, attr, selector) {
      var $el = view.$('[name=' + attr + ']'), 
      $group = $el.closest('.form-group');

      $group.removeClass('has-error');
      $group.find('.help-block').html('').addClass('hidden');
    },
    invalid: function (view, attr, error, selector) {
      var $el = view.$('[name=' + attr + ']'), 
      $group = $el.closest('.form-group');

      $group.addClass('has-error');
      $group.find('.help-block').html(error).removeClass('hidden');
    }
  });

  var HomeModel = Backbone.Model.extend({
    validation: {
      email: {
        required: true,
        pattern: 'email'
      }
    }
  });

  var HomeView = Backbone.View.extend({
    initialize: function() {
      Backbone.Validation.bind(this);
      $(".container").html(this.el);
      this.render();
    },
    bindings: {
      '[name=email]': {
        observe: 'email',
        setOptions: {
          validate: true
        }
      }
    },
    render: function() {
      this.$el.html('\
                    <form role="form">\
                    <div class="form-group">\
                    <label for="email">Email address</label>\
                    <div>\
                    <input type="text" name="email" class="form-control" placeholder="example@domain.com" autofocus />\
                    <span class="help-block hidden"></span>\
                    </div>\
                    </div>\
                    <button class="btn btn-default" type="submit">Send</button>\
                    </form>\
                    ');
                    this.stickit();
                    return this;
    },
    events: {
      'submit': 'onSubmit'
    },
    onSubmit: function(e) {
      e.preventDefault();
      if(this.model.isValid(true)){
        $.cookie('email', this.model.attributes.email, { expires: 7 });
        $(this.el).remove();
        view = new SendView({
          model: new SendModel()
        });
        view.render();
      }
      return false;
    },
    remove: function() {
      Backbone.Validation.unbind(this);
      return Backbone.View.prototype.remove.apply(this, arguments);
    }
  });


  var SendModel = Backbone.Model.extend({
    validation: {
      message: {
        required: true,
        msg: 'Please enter a message'
      }
    }
  });

  var SendView = Backbone.View.extend({
    initialize: function() {
      Backbone.Validation.bind(this);
      $(".container").html(this.el);
      this.render();
    },
    bindings: {
      '[name=message]': {
        observe: 'message',
        setOptions: {
          validate: true
        }
      }
    },
    render: function() {
      this.$el.html('\
                    <form role="form">\
                    <div class="form-group">\
                    <label for="inputText">Message from ' + $.cookie("email") + '</label>\
                    <div>\
                    <textarea class="form-control" name="message" rows="3"></textarea>\
                    <span class="help-block hidden"></span>\
                    </div>\
                    </div>\
                    <button class="btn btn-default" type="submit">Send</button>\
                    </form>\
                    ');
                    this.stickit();
                    return this;
    },
    events: {
      'submit': 'onSubmit'
    },
    onSubmit: function(e) {
      e.preventDefault();
      if((this.model.isValid(true))&&($.cookie("email"))){
        $.post('/api/send',{ email: $.cookie("email"), message: this.model.attributes.message });
        $(this.el).remove();
        view = new HomeView({
          model: new HomeModel()
        });
        view.render();
      }
      return(false);
    },
    remove: function() {
      Backbone.Validation.unbind(this);
      return Backbone.View.prototype.remove.apply(this, arguments);
    }
  });

  var view = new HomeView({
    model: new HomeModel()
  });
  view.render();
});
