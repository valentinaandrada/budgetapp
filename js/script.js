/******* Clases *******/
class Input {
  constructor(type, description, amount) {
    this.type = type;
    this.description = description;
    this.amount = parseFloat(amount);
  }
}

/******* Variables *******/

let income, expense, balance;

// Modals
const input = document.querySelector(".input-form");
const history = document.querySelector(".history");
const alertMessage = document.querySelector(".alert");

// Resultados
const inputList = [];
let totalIncome = 0;
let totalExpense = 0;
let showIncome = document.getElementById("income");
let showExpense = document.getElementById("expense");
let showBalance = document.getElementById("balance");
const historyList = document.querySelector(".items-list");

// Botones
const inputBtn = document.querySelector(".input-btn");
const addInput = document.getElementById("add-input");
const historyBtn = document.querySelector(".history-btn");
const analysisBtn = document.querySelector(".analysis-btn");

/******* Funciones generales *******/

// Función para cerrar modal
function closeModal(modal) {
  modal.classList.add("hidden");
}

// Función para mostrar alerta
function showAlert(message) {
  document.getElementById("alert-message").innerHTML = message;
  alertMessage.classList.remove("hidden");
}

/******* Agregar INGRESO o GASTO *******/

// Abrir Formulario
inputBtn.addEventListener("click", () => {
  input.classList.remove("hidden");
});

addInput.addEventListener("click", () => {
  // Variables de formulario
  let inputDescription = document.getElementById("description").value;
  let inputAmount = document.getElementById("amount").value;
  let inputType = document.getElementById("type").value;

  // Creación de objeto + validación de datos + incluir en listado
  if (isNaN(inputAmount) || !inputAmount || !inputDescription) {
    showAlert(
      "Debe ingresar una descripción y un monto válidos. Por favor, intente nuevamente."
    );
    return;
  } else {
    inputList.push(new Input(inputType, inputDescription, inputAmount));

    // Actualizar historial
    updateHistory(inputType, inputDescription, inputAmount);
  }

  // Suma de INGRESOS / EGRESOS para mostrar en pantalla
  const incomeList = inputList.filter((input) => input.type === "income");
  const expenseList = inputList.filter((input) => input.type === "expense");
  let sumIncome = 0;
  let sumExpense = 0;

  for (let i = 0; i < incomeList.length; i++) {
    sumIncome += incomeList[i].amount;
  }

  for (let i = 0; i < expenseList.length; i++) {
    sumExpense += parseFloat(expenseList[i].amount);
  }

  // Actualizar varaiables totales para balance
  totalIncome = sumIncome;
  totalExpense = sumExpense;

  // Mostrar totalidad de ingresos / gastos en pantalla
  showIncome.textContent = `$ ${totalIncome}`;
  showExpense.textContent = `$ ${totalExpense}`;

  // Actualizar balance
  updateBalance();

  // Cierre de modal y reseteo de valores de formulario
  closeModal(input);
  document.getElementById("form").reset();
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
    showAlert("El saldo de su cuenta es negativo.");
  }
}

/******* HISTORIAL *******/

// Abrir Historial
historyBtn.addEventListener("click", () => {
  history.classList.remove("hidden");
});

function updateHistory(type, description, amount, id) {
  type = type === 'income' ? '+' : '-';
  const input = `<li id='${id}' class="item">
                    <div class='description'>${description}</div>
                    <div>${type} $ <span class="amount">${amount}</span></div>
                    <div class="item-btns">
                      <div class="item-btn edit-btn">
                      <img class="icon" src="img/icon-edit.png" alt="Boton editar" />
                      </div>
                      <div class="item-btn delete-btn">
                      <img class="icon" src="img/icon-delete.png" alt="Boton eliminar" />
                      </div>
                      </div>
                      </li>`;

  historyList.insertAdjacentHTML("afterbegin", input);
}

