// Clases
class Income {
    constructor(incomeDescription, incomeAmount, type) {
      this.description = incomeDescription;
      this.amount = incomeAmount;
      this.type = type;
    }
  }
  class Expense { 
    constructor(expenseDescription, expenseAmount, type) {
      this.description = expenseDescription;
      this.amount = expenseAmount;
      this.type = type;
    }
  }
  
  // Variables
  let income, expense, balance;
  
  // Resultados
  let showIncome = document.getElementById("income");
  let showExpense = document.getElementById("expense");
  let showBalance = document.getElementById("balance");
  
  // Botones
  const incomeBtn = document.querySelector(".income-btn");
  const expenseBtn = document.querySelector(".expense-btn");
  const historyBtn = document.querySelector(".history-btn");
  const backBtn = document.querySelector(".back-btn");
  
  // Listado de ingresos + suma de ingresos
  const incomeList = [];
  let totalIncome = 0;
  
  // Listado de gastos + suma de gastos
  const expenseList = [];
  let totalExpense = 0;
  
  let inputList = [];
  
  // Funcionalidad del boton AGREGAR INGRESO
  incomeBtn.addEventListener("click", function () {
    // Creacion objeto INGRESO
    incomeDescription = prompt("Ingresar descripción de INGRESO").toUpperCase();
    incomeAmount = parseFloat(prompt(
      `Por favor, indique el monto que le ha ingresado como ${incomeDescription}`
    ));
  
    if (isNaN(incomeAmount) || incomeAmount === "" || incomeDescription === "") {
      alert("Por favor, ingrese un monto y descripción válidos");
    } else if (incomeAmount && incomeDescription) {
      inputList.push(new Income(incomeDescription, incomeAmount, 'income'));
      incomeList.push(new Income(incomeDescription, incomeAmount, 'income'));
      // Actualizar historial
      updateHistory("+", incomeDescription, incomeAmount, "green", 0);
    } else {
      alert("No se han ingresados datos como ingreso.");
    }
  
    
    // Suma de ingresos para mostrar en pantalla
    let sumIncome = 0;
    for (let i = 0; i < incomeList.length; i++) {
      sumIncome +=incomeList[i].amount;
    }
  
    // Actualizar varaiable total de ingresos para balance
    totalIncome = sumIncome;
  
    // Mostrar totalidad de ingresos en pantalla
    showIncome.textContent = `$ ${totalIncome}`;
  
    // Actualizar balance
    updateBalance();
  
  });
  
  // Funcionalidad del boton AGREGAR GASTO
  expenseBtn.addEventListener("click", function () {
    // Creacion objeto GASTO
    expenseDescription = prompt("Ingresar descripción de GASTO").toUpperCase();
    expenseAmount = prompt(
      `Por favor, indique el monto que ha gastado en ${expenseDescription}`
    );
  
    if (
      isNaN(expenseAmount) ||
      expenseAmount === "" ||
      expenseDescription === ""
    ) {
      alert("Por favor, ingrese un monto y descripción válidos");
    } else if (expenseAmount && expenseDescription) {
      inputList.push(new Expense(expenseDescription, expenseAmount, 'expense'));
      expenseList.push(new Expense(expenseDescription, expenseAmount, 'expense'));
      //Actualizar historial
      updateHistory("-", expenseDescription, expenseAmount, "red", 0);
    } else {
      alert("No se han ingresado datos como gasto.");
    }
  
    // Suma de gastos para mostrar en pantalla
    let sumExpense = 0;
    for (let i = 0; i < expenseList.length; i++) {
      sumExpense += parseFloat(expenseList[i].amount);
    }
  
    // Actualizar varaiable total de gastos para balance
    totalExpense = sumExpense;
  
    // Mostrar totalidad de gastos en pantalla
    showExpense.textContent = `$ ${totalExpense}`;
  
    // Actualizar balance
    updateBalance();
  
    console.log(inputList);
  
  });
  
  
  
  // Actualizar balance de ingresos y egresos
  function updateBalance() {
    // Operación para conocer el balance entre ingresos y egresos
    balance = totalIncome - totalExpense;
  
    // Mostrar balance en pantalla
    showBalance.textContent = `$ ${balance}`;
  
    // Alertar si la cuenta tiene un balance negativo
    if (balance < 0) {
      showBalance.style.color = "red";
      alert("El saldo de su cuenta es negativo.");
    }
  
    // console.clear();
    // let date = new Date();
  
    // // Display listado de inputs separados por categoria
  
    // let listIncomeItems = [];
    // let listExpenseItems = [];
  
    // for (let item of incomeList.values()) {
    //   item = `➕ ${item.description} $${item.amount}`;
    //   listIncomeItems.push(item);
    // }
  
    // displayList(listIncomeItems, "INGRESOS");
  
    // for (let item of expenseList.values()) {
    //   item = `➖ ${item.description} $${item.amount}`;
    //   listExpenseItems.push(item);
    // }
  
    // displayList(listExpenseItems, "GASTOS");
  
    // function displayList(list, type) {
    //   if (list.length !== 0) {
    //     console.log(
    //       `Listado de ${type.toUpperCase()} al ${date.toUTCString()}\n${list.join(
    //         "\n"
    //       )}`
    //     );
    //   } else {
    //     console.log(`⚠️ SIN ${type.toUpperCase()} al ${date.toUTCString()}`);
    //   }
    // }
  
    // // Display listado de inputs totales
  
    // let totalList = listIncomeItems.concat(listExpenseItems);
    // displayList(totalList, "INGRESOS y GASTOS TOTALES");
  }
  
  // Variables pestañas
  const heroDisplay = document.querySelector(".hero");
  const historyDisplay = document.querySelector(".history");
  
  // Funcionalidad botón VER HISTORIAL
  historyBtn.addEventListener("click", function () {
    heroDisplay.classList.add("hidden");
    historyDisplay.classList.remove("hidden");
  });
  
  backBtn.addEventListener("click", function () {
    historyDisplay.classList.add("hidden");
    heroDisplay.classList.remove("hidden");
  });
  
  
  // Historial
  let newInput;
  const historyInputs = [];
  const historyList = document.querySelector(".items-list");
  
  function updateHistory(type, description, amount, color, id) {
    
    const input = `<li class="item" id=${id} style="color:${color}">
                      <div class='description'>${description}</div>
                      <div>${type} $<span class="amount">${amount}</span></div>
                      <div class="item-btns">
                        <div class="item-btn edit-btn">
                        <img class="icon" src="img/icon-edit.png" alt="Boton editar" />
                        </div>
                        <div class="item-btn delete-btn" onclick='deleteItem()'>
                        <img class="icon" src="img/icon-delete.png" alt="Boton eliminar" />
                        </div>
                        </div>
                        </li>`;
  
    historyList.insertAdjacentHTML("afterbegin", input);
  }
  
  
  
  function deleteItem() {
  
    let item = document.querySelector(".item");
    historyList.removeChild(historyList.children[item]);
  
    // Actualizar dashboard
    // if(newInput.inputType == '+') {
    //   totalIncome = totalIncome - newInput.inputAmount;
    //   showIncome.textContent = `$ ${totalIncome}`;
    //   updateBalance();
    // } else {
    //   totalExpense = totalExpense - newInput.inputAmount;
    //   showExpense.textContent = `$ ${totalExpense}`
    //   updateBalance();
    // }
  }
  
  