/******* CLASES *******/

class Input {
  constructor(type, description, amount) {
    this.type = type;
    this.description = description;
    this.amount = parseFloat(amount);
  }
}

/******* VARIABLES *******/

let income, expense, balance;

// Modals
const input = document.querySelector(".input-form");
const history = document.querySelector(".history");
const alertMessage = document.querySelector(".alert");
const edition = document.querySelector(".edition");

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


/******* EVENTOS *******/

// Abrir Formulario
inputBtn.addEventListener("click", () => {
  input.classList.remove("hidden");
});

// Agregar Input
addInput.addEventListener("click", () => {
  input.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  let inputDescription = document.getElementById("description").value;
  let inputAmount = document.getElementById("amount").value;
  let inputType = document.getElementById("type").value;

  // Validación de datos ingresados
  if (isNaN(inputAmount) || !inputAmount || !inputDescription) {
    showAlert(
      "Debe ingresar una descripción y un monto válidos. Por favor, intente nuevamente."
    );
    return;
  } else {
    // Creación de objeto INPUT + adición a listado
    const input = inputList.push(
      new Input(inputType, inputDescription, inputAmount)
    );
  }

  // Actualizar balance
  updateBalance();

  // Cierre de modal y reseteo de valores de formulario
  closeModal(input);
  document.getElementById("form").reset();

  console.log(inputList);
});

// Abrir Historial
historyBtn.addEventListener("click", () => {
  history.classList.remove("hidden");
});

// Editar o eliminar input
historyList.addEventListener("click", editOrDelete);

/******* FUNCIONES *******/

// Actualizar tablero con resultados
function updateBalance() {
  // Sumar total de INGRESOS y GASTOS
  totalIncome = calcTotal("income", inputList);
  totalExpense = calcTotal("expense", inputList);

  // Mostrar totalidad de ingresos / gastos en pantalla
  showIncome.textContent = `$ ${totalIncome}`;
  showExpense.textContent = `$ ${totalExpense}`;

  // Operación para conocer el balance entre ingresos y egresos
  balance = totalIncome - totalExpense;

  // Mostrar balance en pantalla
  showBalance.textContent = `$ ${balance}`;

  // Alertar si la cuenta tiene un balance negativo
  if (balance < 0) {
    showBalance.style.color = "#f37b57";
    showAlert("El saldo de su cuenta es negativo.");
  } else {
    showBalance.style.color = "#6c63ff";
  }

  // Evitar repetición de inputs en historial
  clearElement(historyList);

  // Actualizar historial
  inputList.forEach((input, index) => {
    updateHistory(input.type, input.description, input.amount, index);
  });
}

// Función para actualizar historial
function updateHistory(type, description, amount, id) {
  type = type === "income" ? "+" : "-";
  const input = `<li id="${id}" class="item">
                    <div class='description'>${description}</div>
                    <div>${type} $ <span class="amount">${amount}</span></div>
                    <div class="items-btn">
                    <img class="item-btn" id="edit-btn" src="img/icon-edit.png" alt="Boton editar"/>
                    <img class="item-btn" id="delete-btn" src="img/icon-delete.png" alt="Boton eliminar" />
                    </div>
                  </li>`;

  historyList.insertAdjacentHTML("afterbegin", input);
}

// Función para cerrar ventana emergente
function closeModal(modal) {
  modal.classList.add("hidden");
}

// Función para mostrar una alerta
function showAlert(message) {
  document.getElementById("alert-message").innerHTML = message;
  alertMessage.classList.remove("hidden");

  // Cerrar modal de alerta si con la tecla ESC
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') {
      alertMessage.classList.add('hidden');
    }
  })
}

// Función para vaciar un elemento
function clearElement(element) {
  element.innerHTML = "";
}

// Función para calcular total
function calcTotal(type, list) {
  let sum = 0;

  list.forEach((input) => {
    if (input.type == type) {
      sum += input.amount;
    }
  });

  return sum;
}

// Función para detectar si se apretó botón de editar o borrar 
function editOrDelete(e) {
  // Detectar botón seleccionado
  const targetBtn = e.target;
  console.log(targetBtn);
  // Alcanzar el elemento ´li´ que contiene a ese botón
  const item = targetBtn.parentNode.parentNode;
  console.log(item);

  if (targetBtn.id == "delete-btn") {
    deleteInput(item);
  } else if (targetBtn.id == "edit-btn") {
    editInput(item);
  }
}

// Función para borrar un input
function deleteInput(item) {
  inputList.splice(item.id, 1);
  updateBalance();
}

// Función para editar un input
function editInput(item) {
  // Open edition modal
  edition.classList.remove("hidden");

  // Encontrar elemento a editar en array 
  itemToEdit = inputList[item.id];

  document.querySelector('.old-description').textContent = itemToEdit.description;
  document.querySelector('.old-amount').textContent = `$${itemToEdit.amount}`;

  document.getElementById("edit-form").addEventListener("submit", (e) => {
    e.preventDefault();

    let newDescription = document.getElementById("new-description").value;
    let newAmount = parseFloat(document.getElementById("new-amount").value);

    // Validación de datos ingresados
  if (isNaN(newAmount) || !newAmount || !newDescription) {
    showAlert(
      "Debe ingresar una descripción y un monto válidos. Por favor, intente nuevamente."
    );
    return;
  } else {
    // Modificar descripción y monto por nuevos inputs
    itemToEdit.description = newDescription;
    itemToEdit.amount = newAmount;
  }

    // Actualizar tablero de resultados
    updateBalance();

    // Cierre de modal y reseteo de valores de formulario
    closeModal(edition);
    document.getElementById("edit-form").reset();
  });
}
