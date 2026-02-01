class StateManager {
  constructor(eventBus, initialState = {}) {
    this.eventBus = eventBus;
    this.state = {
      viewMonth: new Date().getMonth(),
      viewYear: new Date().getFullYear(),
      selectedDate: null,
      isOpen: false,

      ...initialState,
    };

    // create a cope of current state
    this.previousState = { ...this.state };
  }

  getState() {
    return { ...this.state };
  }

  get(key) {
    return this.state[key];
  }
  setState(updateState) {
    // backup preve State
    this.previousState = { ...this.state };
    // update this state
    this.state = { ...this.state, ...updateState };

    Object.keys(updateState).forEach((key) => {
      //   check if value change
      if (this.previousState[key] != this.state[key]) {
        // emit event for updateState (updateState, currentState)
        this.eventBus.emit(`state:${key}`, {
          value: this.state[key],
          previous: this.previousState[key],
        });
      }
    });

    // emit state change
    this.eventBus.emit(`state:change`, {
      state: this.getState(),
      previous: this.previousState,
      changes: updateState,
    });
  }
  setSelectedDate(date) {
    this.setState({
      selectedDate: date,
    });

    // emit event
    this.eventBus.emit(`date:select`, { date });
  }
  setView(month, year) {
    if (month > 11) {
      month = 0;
      year++;
    } else if (month < 0) {
      month = 11;
      year--;
    }

    this.setState({ viewMonth: month, viewYear: year });

    // emit event
    this.eventBus.emit(`view:change`, { month, year });
  }

  navigate(monthOffSet = 0, yearOffset = 0) {
    const newMonth = this.state.viewMonth + monthOffSet;

    const newYear = this.state.viewYear + yearOffset;

    this.setView(newMonth, newYear);
  }

  open() {
    if (!this.state.isOpen) {
      this.setState({ isOpen: true });
      this.eventBus.emit("picker:open");
    }
  }
  close() {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
      this.eventBus.emit("picker:close");
    }
  }
  toggle() {
    if (!this.state.isOpen) {
      this.open();
    } else {
      this.close();
    }
  }
  goToday() {
    const today = new Date();
    this.setView(today.getMonth(), today.getFullYear());
    this.setSelectedDate(today);
  }

  clear() {
    this.setSelectedDate(null);
  }
  reset(initialState = {}) {
    this.setState({
      viewMonth: new Date().getMonth(),
      viewYear: new Date().getFullYear(),
      selectedDate: null,
      isOpen: false,

      ...initialState,
    });

    this.eventBus.emit("state:reset", {
      state: this.getState(),
    });
  }

  //   reset(initialState = {}) {
  //     const defaultState = {
  //       viewMonth: new Date().getMonth(),
  //       viewYear: new Date().getFullYear(),
  //       selectedDate: null,
  //       isOpen: false,

  //       ...initialState,
  //     };

  //     this.previousState = { ...this.state };
  //     this.state = defaultState;

  //     this.eventBus.emit("state:reset", {
  //       state: this.getState(),
  //     });
  //   }
}

export default StateManager;
