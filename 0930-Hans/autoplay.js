require(["jquery", "base/js/namespace"], function($, Jupyter) {
  var Autoplay = function() {
    this.interval = null;
    this._stopped = false;
    this.step_ms = 2000;
    this.restart_ms = 60000;
  };

  Autoplay.prototype.step = function() {
    // don't do anything if another window has focus
    if (!document.hasFocus()) {
      console.debug("autoplay: out of focus");
      return;
    }
    var nb = Jupyter.notebook;
    if (nb.keyboard_manager.mode === "edit") {
      // don't auto-execute while a cell is being edited
      console.debug("autoplay: in edit mode");
      return;
    }
    if (
      nb.get_selected_index() + 1 === nb.ncells() &&
      nb.get_selected_cell().get_text().trim() === ""
    ) {
      // at the end
      this.schedule_restart();
    } else {
      Jupyter.notebook.execute_cell_and_select_below();
    }
  };

  Autoplay.prototype.schedule_restart = function() {
    // called when we reach the end
    var autoplay = this;
    this._stop();
    console.debug("autoplay: scheduling restart");
    setTimeout(
      function() {
        if (this._stopped) {
          // someone else stopped us
          console.debug("autoplay: aborting restart");
          return;
        }
        console.debug("autoplay: restarting");
        var nb = Jupyter.notebook;
        nb.clear_all_output();
        nb.select(0);
        nb.restart_kernel({ confirm: false }).then(function() {
          autoplay.start();
        });
      },
      this.restart_ms,
    );
  };

  Autoplay.prototype.stop = function() {
    this._stopped = true;
    if (this.interval) {
      console.debug("autoplay: stopping");
      this._stop();
    }
  };

  Autoplay.prototype._stop = function() {
    clearInterval(this.interval);
    this.interval = null;
  };

  Autoplay.prototype.start = function(ms) {
    ms = ms || this.step_ms;
    this._stop();
    console.debug("autoplay: starting");
    this.pasued = false;
    var autoplay = this;
    this.interval = setInterval(
      function() {
        autoplay.step();
      },
      ms,
    );
  };

  // create and start the global instance
  // avoid duplicate instances:
  if (window.autoplay) {
    window.autoplay.stop();
  }

  window.autoplay = new Autoplay();
  window.autoplay.start();

  return {
    Autoplay: Autoplay,
  };
});
