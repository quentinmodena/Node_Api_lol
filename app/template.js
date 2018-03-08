module.exports = {

  loadLayout: function(data, callback) {
    fs.readFile('/app/app/html/layout.html', 'utf8', function(err, layout){
      mustache.parse(layout);
      var rendered = mustache.render(layout, data);
      callback(rendered);
    });
  },

  renderTemplate: function(data, templateName, callback){
    fs.readFile('/app/app/html/'+templateName, 'utf8', function(err, template){
      console.error(err);
      mustache.parse(template);
      var rendered = mustache.render(template, data);
      templateMustache.loadLayout({"body" : rendered, "debug" : JSON.stringify(data, null, 4)}, callback)
    });
  }

}
