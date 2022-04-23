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

// Modals y aperturas
const inputModal = document.querySelector(".input-form");
const history = document.querySelector(".history");
const overview = document.querySelector(".overview");
const alertMessage = document.querySelector(".alert");
const edition = document.querySelector(".edition");
const categories = document.querySelector(".categories");
const currency = document.querySelector(".currency-exchange");
const alertBtns = document.querySelector('.alert-btns');

// Formularios / inputs
const inputForm = document.getElementById("form");
const editionForm = document.getElementById("edit-form");
const submissionForm = document.getElementById("submission-form");

// Resultados
const historyList = document.querySelector(".items-list");
const inputType = document.getElementById("type");
const budget = document.getElementById("budget");
const categoryChart = document.querySelector(".expense-chart");
const showIncome = document.getElementById("income");
const showExpense = document.getElementById("expense");
const showBalance = document.getElementById("balance");
let totalIncome = 0;
let totalExpense = 0;
let generalChart;
let expenseChart;

// Botones
const inputBtn = document.querySelector(".input-btn");
const historyBtn = document.querySelector(".history-btn");
const overviewBtn = document.querySelector(".overview-btn");
const submitBtn = document.getElementById("submit");
const addInput = document.getElementById("add-input");
const convertBtn = document.getElementById("curr-btn");
const confirmBtn = document.getElementById('alert-yes');
const denyBtn = document.getElementById('alert-no');

// Filtros
const filterByType = document.getElementById("filter-type");
const filterByCategory = document.getElementById("filter-cat");
const filterCategoriesBox = document.querySelector(".filter-cat");

// Dropdown menu
const currencyExchange = document.getElementById("menu-currency");
const deleteData = document.getElementById("menu-clearall");

// Currency Exchange
const actualCurrSelector = document.getElementById("actual-currency");
const newCurrSelector = document.getElementById("new-currency");
const currencyBalance = document.getElementById("curr-balance");
const currencyOutput = document.getElementById("curr-output");


/* STORAGE:  Si hay datos guardados en Local Storage, 
  inicializar listado de inputs con los datos ya guardados; si no, 
  inicializar array vacío. */
let inputList = JSON.parse(localStorage.getItem("inputsSaved")) || [];
updateBalance();
let expenseList;

/******* EVENTOS *******/

// Abrir Formulario
inputBtn.addEventListener("click", () => {
  inputModal.classList.remove("hidden");
  categories.classList.add('hidden');
  inputForm.reset();
});

// Agregar Input
addInput.addEventListener("click", (e) => {
  e.preventDefault();

  const inputDescription = document.getElementById("description").value;
  const inputAmount = document.getElementById("amount").value;
  const expenseCategory = document.getElementById("category").value;
  let input;

  // Validación de datos ingresados
  if (isNaN(inputAmount) || !inputAmount || !inputDescription) {
    showAlert(
      "Debe ingresar una descripción y un monto válidos. Por favor, intente nuevamente.", false
    );
    return;
  } else {
    // Creación de objeto INPUT
    input = new Input(inputType.value, inputDescription, inputAmount);
    if (inputType.value === "expense") {
      input.category = expenseCategory;
    }

    inputList.push(input);
  }

  // Actualizar balance
  updateBalance();

  // Cierre de modal y reseteo de valores de formulario
  closeModal(inputModal);
  inputForm.reset();
});

// Abrir Historial
historyBtn.addEventListener("click", () => {
  history.classList.remove("hidden");

  // Resetear valor por defecto en filtros
  filterByType.selectedIndex = null;
  filterByCategory.selectedIndex = null;

  submissionForm.reset();
});

// Editar o eliminar input
historyList.addEventListener("click", editOrDelete);

// Eliminar datos de Local Storage
deleteData.addEventListener("click", () => {
  if (!inputList.length == 0) {
    showAlert("¿Está seguro de querer eliminar todos los datos?", true);
    confirmBtn.onclick = clearStorage;
  } else {
    showAlert('No existen datos guardados.')
  }
});

// Mostrar resultados
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const userEmail = document.getElementById("user-email").value;
  const userName = document.getElementById("user-name").value;
  let today = new Date().toISOString().slice(0, 10);
  let incListPrint = "";
  let expListPrint = "";

  // Crear listado de ingresos y gastos
  for (let i = 0; i < inputList.length; i++) {
    const inputObject = inputList[i];
    // Desestructuración de objeto
    let { type, description, amount } = inputObject;

    if (type === "income") {
      incListPrint += `<li style="margin: 0; list-style-type: none">+ $${amount} en concepto de ${description}</li>`;
    } else {
      expListPrint += `<li style="margin: 0; list-style-type: none">- $${amount} en concepto de ${description}</li>`;
    }
  }

  // Construcción de cuerpo de email
  const emailBody = `  
      <div style="margin: 0; padding: 0; box-sizing: border-box; font-family: Poppins, sans-serif; font-size: 14px; background-color: #d7d5d5; color: #777777;">
        <div style="width: 80%; margin: auto;background-color: #ffffff;">
          <!-- header -->
          <div style="background-color: #6c63ff; padding: 12px; text-align: center;">
            <h2 style="color: #ffffff; line-height: 100%">Tu historial de Control-O</h2>
          </div>
          <!-- body -->
          <div style="padding: 2rem;">
            <h3 style="color: #333333">Hola ${userName}!</h3>
            <p>Desde Control-O te enviamos tu historial de transacciones hasta hoy ${today}.</p>
            <div>
              <h4 style="color: #333333">INGRESOS:</h4>
              <ul>${incListPrint}</ul>
              <p style="font-style: italic; color: #333333">💸 Total de INGRESOS hasta la fecha ${today}: <span style="font-weight: bold">$ ${totalIncome}</span> 💸</p>
            </div>
            <div>
              <h4 style="color: #333333">GASTOS:</h4>
              <ul>${expListPrint}</ul>
              <p style="font-style: italic; color: #333333">⚠️ Total de GASTOS hasta la fecha ${today}: <span style="font-weight: bold">$ ${totalExpense}</span> ⚠️</p>
            </div>
            <p style="color: #6c63ff;">🚀 Tu presupuesto hasta la fecha ${today} es de <span style="font-weight: bold">$ ${balance}</span> 🚀</p><br>
            <p style="color: #777777">Saludos,</p>
            <h4 style="color: #333333">Equipo de Control-O</h4>
          </div>
        </div>
      </div>
  `;

  // Validación de datos
  if (!userEmail || !userName) {
    showAlert(
      "Ingresa tu nombre y correo para que podamos enviarte tu historial de transacciones.", false
    );
    return;
  } else {
    Email.send({
      Host: "smtp.gmail.com",
      Username: "controloapp.finanzas@gmail.com",
      Password: "controlo1",
      To: userEmail,
      From: "controloapp.finanzas@gmail.com",
      Subject: "Tu historial de transacciones",
      Body: emailBody,
    }).then((message) =>
      showAlert(
        `Hemos enviado con éxito tu historial a ${userEmail}. ¡Revisa tu correo!`, false
      )
      );
      submissionForm.reset();
  }
});

// Mostrar resumen
overviewBtn.addEventListener("click", () => {
  // No mostrar resumen si no existen datos
  inputList.length !== 0
    ? overview.classList.remove("hidden")
    : showAlert("No hay datos para visualizar", false);

  // No mostrar gráfico de categorías si no hay datos de gastos
  totalExpense === 0
    ? categoryChart.classList.add("hidden")
    : categoryChart.classList.remove("hidden");

  chartsCreation();
});

// Conocer balance en otra moneda
currencyExchange.addEventListener("click", () => {
  currency.classList.remove("hidden");
  let symbol;
  currencyBalance.textContent = `${actualCurrSelector.value} ${balance}`;
  currencyOutput.textContent = 0;

  actualCurrSelector.onchange = (e) => {
    symbol = e.target.value;
    currencyBalance.textContent = `${symbol} ${balance}`;
  };
});

// Convertir balance
convertBtn.addEventListener("click", () => {

  const key = "0053658357175035a207a95dbbce66dc22bac9b7";
  const api = `https://api.getgeoapi.com/v2/currency/list?api_key=${key}&format=json`;

  fetch(
    `https://api.getgeoapi.com/v2/currency/convert?api_key=${key}&from=${actualCurrSelector.value}&to=${newCurrSelector.value}&amount=${balance}&format=json`
  )
    .then((result) => result.json())
    .then((result) => {
      currencyOutput.textContent = `${newCurrSelector.value} ${
        Object.values(result.rates)[0].rate_for_amount
      }`;
    });
});

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

  // Mostrar balance en pantalla + resumen
  showBalance.textContent = `$ ${balance}`;
  balance < 0
    ? (budget.textContent = `$0`)
    : (budget.textContent = `$${balance}`);

  // Alertar si la cuenta tiene un balance negativo
  if (balance < 0) {
    showBalance.style.color = "#f37b57";
    showAlert("El saldo de su cuenta es negativo.", false);
  } else {
    showBalance.style.color = "#6c63ff";
  }

  // Evitar repetición de inputs en historial
  clearElement(historyList);

  // Actualizar historial
  showList(inputList);

  // Guardar datos en Local Storage
  localStorage.setItem("inputsSaved", JSON.stringify(inputList));
}

// Función para actualizar historial
function updateHistory(type, description, amount, id) {
  type === "income" ? (type = "+") : (type = "-");
  const input = `<li id="${id}" class="item">
                  <div class="item-content">
                    <div class='description'>${description}</div>
                    <div>${type} $ <span class="amount">${amount}</span></div>
                  </div>
                    <div class="items-btn">
                    <img class="item-btn" id="edit-btn" src="img/icon-edit.png" alt="Boton editar"/>
                    <img class="item-btn" id="delete-btn" src="img/icon-delete.png" alt="Boton eliminar" />
                    </div>
                  </li>`;

  historyList.insertAdjacentHTML("afterbegin", input);
}


// Función para mostrar categorias
inputType.onchange = showCategories;
function showCategories(e) {
  e.preventDefault();
  let value = this.value;

  value === "expense"
    ? categories.classList.remove("hidden")
    : categories.classList.add("hidden");
}

// Función para cerrar ventana emergente
function closeModal(modal) {
  modal.classList.add("hidden");
}

// Función para mostrar pop-up con alerta
function showAlert(message, isToConfirm) {
  document.getElementById("alert-message").innerHTML = message;
  alertMessage.classList.remove("hidden");

  isToConfirm == true ? alertBtns.classList.remove('hidden'): alertBtns.classList.add('hidden');
  
  // Cerrar modal de alerta si con la tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      alertMessage.classList.add("hidden");
    }
  });
}

// Función para vaciar un elemento
function clearElement(element) {
  element.innerHTML = "";
}

function clearStorage() {
  localStorage.clear();
  
    // Actualizar tablero
    inputList = [];
    updateBalance();

    showAlert('Se han eliminado todos los datos introducidos', false)
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
  // Alcanzar el elemento ´li´ que contiene a ese botón
  const item = targetBtn.parentNode.parentNode;

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

  const oldDescription = document.querySelector(".old-description");
  const oldAmount = document.querySelector(".old-amount");

  oldDescription.textContent = itemToEdit.description;
  oldAmount.textContent = `$${itemToEdit.amount}`;

  editionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let newDescription = document.getElementById("new-description").value;
    let newAmount = parseFloat(document.getElementById("new-amount").value);
    

    if (newDescription === '' && newAmount === '') {
      showAlert(`No se han ingresado datos a modificar`);
    } else {
      itemToEdit.description = newDescription || itemToEdit.description;
      itemToEdit.amount = newAmount || itemToEdit.amount;
    }


    // Actualizar tablero de resultados
    updateBalance();

    // Cierre de modal y reseteo de valores de formulario
    closeModal(edition);
    editionForm.reset();
  });
}

// Función para filtrar Historial
filterByType.onchange = filterHistory;
function filterHistory() {
  let value = this.value;
  console.log(value);

  if (value === "income") {
    filterCategoriesBox.classList.add("hidden");
    incomeList = inputList.filter((item) => item.type == value);
    showList(incomeList);
  } else if (value === "expense") {
    filterCategoriesBox.classList.remove("hidden");
    expenseList = inputList.filter((item) => item.type == value);
    showList(expenseList);
    filterByCategory.onchange = filterExpenseListByCategory;
  } else {
    filterCategoriesBox.classList.add("hidden");
    showList(inputList);
  }
}

// Filtrar Historial de GASTOS por categoria
function filterExpenseListByCategory() {
  let value = this.value;

  if (value === "all") {
    showList(expenseList);
  } else {
    const filteredList = inputList.filter((item) => item.category == value);
    showList(filteredList);
  }
}

// Mostrar historial segun listado
function showList(list) {
  clearElement(historyList);
  list.forEach((input, index) => {
    updateHistory(input.type, input.description, input.amount, index);
  });
}

// Obtener total de gastos por categoría
function categoryTotal(cat) {
  const catList = [];
  inputList.forEach((input) => {
    if (input.category === cat) {
      catList.push(input.amount);
    }
  });

  const catTotal = catList.reduce((a, b) => a + b, 0);
  return catTotal;
}

// Crear gráficos para visualización de datos ingresados
function chartsCreation() {
  if (generalChart || expenseChart) {
    generalChart.destroy();
    expenseChart.destroy();
  }

  let budget = totalIncome - totalExpense;
  if (budget < 0) {
    budget = 0;
  }
  // Datos y configuración de los gráficos
  const generalData = {
    labels: ["Gastos", "Presupuesto"],
    datasets: [
      {
        label: "General Dataset",
        data: [totalExpense, budget],
        backgroundColor: ["rgb(205, 205, 205)", "rgb(108, 99, 255)"],
        hoverOffset: 4,
      },
    ],
  };

  const generalConfig = {
    type: "doughnut",
    data: generalData,
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  const expenseData = {
    labels: [
      "Gasto Fijo",
      "Mercado",
      "Transporte",
      "Personal",
      "Compras",
      "Salidas",
    ],
    datasets: [
      {
        label: "General Dataset",
        data: [
          categoryTotal("fixed"),
          categoryTotal("food"),
          categoryTotal("transport"),
          categoryTotal("personal"),
          categoryTotal("shopping"),
          categoryTotal("out"),
        ],
        backgroundColor: [
          "rgb(74, 71, 163)",
          "rgb(65, 60, 105)",
          "rgb(0, 189, 170)",
          "rgb(98, 30, 129)",
          "rgb(173, 98, 170)",
          "rgb(244, 176, 199)",
        ],
        hoverOffset: 2,
      },
    ],
  };

  const expenseConfig = {
    type: "doughnut",
    data: expenseData,
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  // Creación de gráficos
  generalChart = new Chart(
    document.getElementById("general-chart"),
    generalConfig
  );

  expenseChart = new Chart(
    document.getElementById("expense-chart"),
    expenseConfig
  );
}
