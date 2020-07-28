//BUDGET CONTROLLER

// The budget controller is an IFFE which is called by another function is a colsure which returns the function inclide which is the public test function. This means that other functions have access to the budget

let budgetController = (function () {
  class Expense {
    constructor(id, description, value, percentage) {
      (this.id = id),
        (this.description = description),
        ((this.value = value), (this.percentage = percentage));
    }
    calcPercentage(totalIncome) {
      if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
      } else {
        this.percentage = -1;
      }
    }
    getPercentage() {
      return this.percentage;
    }
  }

  class Income {
    constructor(id, description, value) {
      (this.id = id), (this.description = description), (this.value = value);
    }
  }

  let calculateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  let data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };
  // this function is my closure which creates a new ID each time an item is added
  function idNo() {
    let no = 0;
    return function () {
      return no++;
    };
  }
  let test = idNo();

  return {
    addItem: function (type, des, val) {
      let newItem, ID;
      // this creates a new id from the closure in my idNo function and stores it in the id variables which used to create the new item.
      ID = test();

      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else {
        newItem = new Income(ID, des, val);
      }
      data.allItems[type].push(newItem);
      return newItem;
    },

    deleteItem: function (type, id) {
      let ids = data.allItems[type].map((item) => {
        return item.id;
      });
      let index = ids.indexOf(parseInt(id));
      console.log(ids, index);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // Calculate the percentage of income we have spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percnetage = -1;
      }
    },

    calculatePercentages: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      let allPerc = data.allItems.exp.map((cur) => {
        console.log(cur);
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },

    testing: function () {
      console.log(data);
    },
  };
})();

//UI CONTROLLER

// This controller controls user interaction . the DOM strings object includes variables for the dom strings. The UI controller is also a IFFE which immedately returns the public functions available to the other modules/controllers.

let UIController = (function () {
  let DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month',
  };
  // The returned functions are closures which are returned immediately by the IIFE, so are public to the other modules.
  return {
    getinput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // will be either inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMStrings.inputValue).value),
      };
    },
    addListItem: function (type, obj) {
      let { description, value, id } = obj;
      if (type === 'inc') {
        let container = document.querySelector('.income__list');
        container.innerHTML += `  <div class="item clearfix" id="inc-${id}">
          <div class="item__description">${description}</div>
          <div class="right clearfix">
              <div class="item__value">${this.formatNumber(value, type)}</div>
              <div class="item__delete"> 
                  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
              </div>
          </div>
      </div>`;
      } else if (type === 'exp') {
        let container = document.querySelector('.expenses__list');
        console.log(container);
        container.innerHTML += `<div class="item clearfix" id="exp-${id}">
        <div class="item__description">${description}</div>
        <div class="right clearfix">
            <div class="item__value">${this.formatNumber(value, type)}</div>
            <div class="item__percentage">21%</div>
            <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
            </div>
        </div>
    </div>`;
      }
    },

    deleteListItem: function (selectorId) {
      let el = document.getElementById(selectorId);
      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      let fields = document.querySelectorAll('.add__container input');
      fields.forEach((field) => {
        field.value = '';
      });
      fields[0].focus();
    },

    displayBudget: function (obj) {
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMStrings.expenseLabel).textContent =
        obj.totalExp;
      document.querySelector(DOMStrings.percentageLabel).textContent =
        obj.percentage;

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent =
          obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }
    },

    displayPercentages: function (percentages) {
      console.log(percentages);
      let fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
      fields.forEach((field, index) => {
        if (percentages[index] > 0) {
          field.textContent = percentages[index] + '%';
        } else {
          field.textContent = percentages[index] + '---';
        }
      });
    },

    displayMonth: function () {
      var now, months, month, year;

      now = new Date();
      //var christmas = new Date(2016, 11, 25);

      months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      month = now.getMonth();

      year = now.getFullYear();
      document.querySelector(DOMStrings.dateLabel).textContent =
        months[month] + ' ' + year;
    },

    formatNumber: function (num, type) {
      num = Math.abs(num);
      num = num.toFixed(2);
      let numSplit = num.split('.');
      let int = numSplit[0];
      if (int.length > 3) {
        int =
          int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
      }

      let dec = numSplit[1];

      let x = type === 'exp' ? (sign = '-') : (sign = '+');

      return x + ' ' + int + '.' + dec;
    },

    changedType: function () {
      console.log('clicked');
      let fields = document.querySelectorAll(
        DOMStrings.inputType +
          ',' +
          DOMStrings.inputDescription +
          ',' +
          DOMStrings.inputValue
      );
      console.log(fields);
      fields.forEach((field) => {
        field.classList.toggle('red-focus');
      });
    },

    getDOMStrings: function () {
      return DOMStrings;
    },
  };
})();

//GLOBAL APP CONTROLLER

// The global app controls the interaction between the budget controller and the ui controller. This iffe takes in the other functions as parameters within the iffe parameters at the end so it can use them in the app.

let controller = (function (budgetCtrl, UICtrl) {
  let DOM = UICtrl.getDOMStrings();

  let setupEventListeners = function () {
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (e) {
      if (event.keyCode == 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener('click', ctrlDeleteItem);
    document
      .querySelector(DOM.inputType)
      .addEventListener('change', UICtrl.changedType);
  };

  let updateBudget = function () {
    //1. Calculate the budget
    budgetCtrl.calculateBudget();
    //2. Return the  budget on the UI
    let budget = budgetCtrl.getBudget();
    //3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  let updatePercentages = function () {
    // 1.calculate percentages
    budgetCtrl.calculatePercentages();

    //2. Read percentages from the budget controller
    let percentages = budgetCtrl.getPercentages();
    //3. update the ui with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  let ctrlAddItem = function () {
    let input = UICtrl.getinput();

    if (input.description && input.value > 0) {
      //1. get the filled input data
      let { type, description, value } = input;
      //2. Add the item to the budget controller
      let newItem = budgetCtrl.addItem(type, description, value);
      //3. Add the ite to the UI
      UICtrl.addListItem(type, newItem);
      // Clear the fields
      UICtrl.clearFields();
      //5. Calculcate and update the budget
      updateBudget();

      // 6. caclculate and update percentages
      updatePercentages();
    }
  };

  let ctrlDeleteItem = function (e) {
    let itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemId) {
      let splitID = itemId.split('-');
      let type = splitID[0];
      let ID = splitID[1];
      console.log(type, ID);

      //1. delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);
      //2. delete the item from the UI
      UICtrl.deleteListItem(itemId);
      //3. Update the show the new budget
      updateBudget();
      // 4. caclculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log('Application has started');
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventListeners();
    },
  };
})(budgetController, UIController);

// This initiates the app by calling the init function.

controller.init();
