// Declaración de variables
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
const editBtn = document.querySelector('.edit-btn');
const deleteBtn = document.querySelector('.delete-btn');

// Listado de ingresos + suma de ingresos
const incomeList = [];
let totalIncome = 0;

// Listado de gastos + suma de gastos
const expenseList = [];
let totalExpense = 0;

// Historial
const historyList = document.querySelector(".items-list");

// Crear objeto para incluir en array
class Income {
  constructor(incomeDescription, incomeAmount) {
    this.description = incomeDescription;
    this.amount = incomeAmount;
  }
}

// Funcionalidad del boton AGREGAR INGRESO
incomeBtn.addEventListener("click", function () {
  // Creacion objeto INGRESO
  incomeDescription = prompt("Ingresar descripcion");
  incomeAmount = prompt("Por favor, indique el monto a añadir como ingreso");

  if (isNaN(incomeAmount) ||  expenseDescription === '') {
    alert("Por favor, ingrese un monto y descripción válidos");
  } else {
    incomeList.push(new Income(incomeDescription, incomeAmount));

    // Actualizar historial
    updateHistory("+", incomeDescription, incomeAmount, 'green');
  }

  // Suma de ingresos para mostrar en pantalla
  let sumIncome = 0;
  for (let i = 0; i < incomeList.length; i++) {
    sumIncome += parseFloat(incomeList[i].amount);
  }

  // Actualizar varaiable total de ingresos para balance
  totalIncome = sumIncome;
  console.log(`La suma de ingresos es ${totalIncome}.`);

  // Mostrar totalidad de ingresos en pantalla
  showIncome.textContent = `$ ${totalIncome}`;

  // Actualizar balance
  updateBalance();
});

class Expense {
  constructor(expenseDescription, expenseAmount) {
    this.description = expenseDescription;
    this.amount = expenseAmount;
  }
}

// Funcionalidad del boton AGREGAR GASTO
expenseBtn.addEventListener("click", function () {
  // Creacion objeto GASTO
  expenseDescription = prompt("Ingresar descripcion");
  expenseAmount = prompt("Por favor, indique el monto a añadir como ingreso");

  if (isNaN(expenseAmount) ||  expenseDescription === '') {
    alert("Por favor, ingrese un monto y descripción válidos");
  } else {
    expenseList.push(new Expense(expenseDescription, expenseAmount));
    //Actualizar historial
    updateHistory("-", expenseDescription, expenseAmount, 'red');
  }

  // Suma de gastos para mostrar en pantalla
  let sumExpense = 0;
  for (let i = 0; i < expenseList.length; i++) {
    sumExpense += parseFloat(expenseList[i].amount);
  }

  // Actualizar varaiable total de gastos para balance
  totalExpense = sumExpense;
  console.log(`La suma de gastos es ${totalExpense}.`);

  // Mostrar totalidad de gastos en pantalla
  showExpense.textContent = `$ ${totalExpense}`;

  // Actualizar balance
  updateBalance();

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
}

// **** History

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

function updateHistory(type, description, amount, color) {
  const input = `<li class="item" style="color:${color}">
                    <div class='description'>${description}</div>
                    <div class='amount'>${type} $${amount}</div>
                    <div class="item-btns">
                        <button class="item-btn edit-btn">
                            <img class="icon" src="../img/icon-edit.png" alt="Boton editar" />
                        </button>
                        <button class="item-btn delete-btn">
                            <img class="icon" src="../img/icon-delete.png" alt="Boton eliminar" />
                        </button>
                    </div>
                </li>`;

  historyList.innerHTML += input;
  console.log(historyList.input)
}



