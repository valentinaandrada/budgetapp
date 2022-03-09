// Declaración de variables
let income;
let expense;
let balance;

// Resultados
let showIncome = document.getElementById("income");
let showExpense = document.getElementById("expense");
let showBalance = document.getElementById("balance");

// Botones
const incomeBtn = document.querySelector('.income-btn');
const expenseBtn = document.querySelector('.expense-btn');
const historyBtn = document.querySelector('.history-btn');

// Listado de ingresos + suma de ingresos
let incomeList = [];
let totalIncome = 0;

// Listado de gastos + suma de gastos
let expenseList = [];
let totalExpense = 0;


// Funcionalidad del boton AGREGAR INGRESO
incomeBtn.addEventListener('click', function() {
    // Permitir al usuario ingresar monto a añadir como ingreso
    income = parseFloat(prompt('Por favor, indique el monto a añadir como ingreso'));
    
    // Chequear si el input es un número, si lo es agregarlo a listado de ingresos, si no alertar input incorrecto.
    if (isNaN(income)) {
        alert('Por favor, ingrese un monto válido');
    } else { 
        incomeList.push(income);
        
    }
    
    // Suma de ingresos para mostrar en pantalla
    let sumIncome = 0;
    for (let i=0; i<incomeList.length; i++) {
        sumIncome += incomeList[i];
    }

    // Actualizar varaiable total de ingresos para balance
    totalIncome = sumIncome;
    console.log(`Listado de ingresos: ${incomeList}`)
    console.log(`La suma de ingresos es ${totalIncome}.`);
    
    // Mostrar totalidad de ingresos en pantalla
    showIncome.textContent = `$ ${totalIncome}`
    
    // Actualizar balance
    balanceUpdate(totalIncome, 0);
})

// Funcionalidad del boton AGREGAR GASTO
expenseBtn.addEventListener('click', function() {
    // Permitir al usuario ingresar monto a añadir como gasto
    expense = parseFloat(prompt('Por favor, indique el monto a añadir como gasto'));
    
    // Chequear si el input es un número, si lo es agregarlo a listado de gastos, si no alertar input incorrecto.
    if (isNaN(expense)) {
        alert('Por favor, ingrese un monto válido');
    } else {
        expenseList.push(expense);
    }
    
    // Suma de gastos para mostrar en pantalla
    let sumExpense = 0;
    for (let i=0; i<expenseList.length; i++) {
        sumExpense += expenseList[i];
    }
    
    // Actualizar varaiable total de gastos para balance
    totalExpense = sumExpense;
    console.log(`Listado de gastos: ${expenseList}`)
    console.log(`La suma de gastos es ${totalExpense}.`);
    
    // Mostrar totalidad de gastos en pantalla
    showExpense.textContent = `$ ${totalExpense}`
    
    // Actualizar balance
    balanceUpdate();
})

// Actualizar balance de ingresos y egresos
function balanceUpdate() {
    // Operación para conocer el balance entre ingresos y egresos
    balance = totalIncome - totalExpense;

    // Mostrar balance en pantalla
    showBalance.textContent = `$ ${balance}`;

    // Alertar si la cuenta tiene un balance negativo
    if (balance < 0) {
        showBalance.style.color = 'red';
        alert('El saldo de su cuenta es negativo.')
    }
}