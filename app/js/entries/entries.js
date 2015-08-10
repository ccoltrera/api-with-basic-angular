"use strict";

module.exports = function(app) {
  require("./controllers/entries_controller")(app);
  require("./controllers/reader_controller")(app);
  require("./controllers/writer_controller")(app);
}
