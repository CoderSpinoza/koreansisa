var child_process, clearDatabase, models, path, servers, startServer, stopServer;
path = require('path');
child_process = require('child_process');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/koreansisa_test');
var DatabaseCleaner = require('database-cleaner');
var databaseCleaner = new DatabaseCleaner('mongodb');

servers = {};

startServer = function(cb) {
	var filepath, server;

	process.env.PORT = Math.max(1000, 10000 - Math.round(Math.random() * 10000));
	process.env.NODE_ENV = "testing";
	filepath = path.resolve(path.dirname(module.filename), "../app");
	server = child_process.spawn("node", [filepath]);

	server.stdout.on("data", function(data) {
    var serverPath, str;
    str = data.toString();
    console.log(data.toString());
    if (/listening on/.test(str)) {
      serverPath = "http://localhost:" + str.split(" ").pop().trim();
      servers[serverPath] = server;
      return cb(null, serverPath);
    }
  });

  return server.stderr.on("data", function(data) {
    var str;
    str = data.toString();
    console.error(str);
    return cb(str);
  });
};

stopServer = function(serverPath, cb) {
  var server;
  if (servers[serverPath]) {
    server = servers[serverPath];
    server.on('exit', function() {
      return cb(null);
    });
    return server.kill();
  } else {
    return cb(null);
  }
};

clearDatabase = function(cb) {
	databaseCleaner.clean(mongoose.connections[0].db, function(err) {
		return cb(null);
	});
}

module.exports = {
	startServer: startServer,
	stopServer: stopServer,
	clearDatabase: clearDatabase
};