const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items;

btnNew.onclick = () => {
    if (descItem.value === "" || amount.value === "" || type.value === "") {
      return alert("Preencha todos os campos!");
    }

    items.push({
      desc: descItem.value,
      amount: Math.abs(amount.value).toFixed(2),
      type: type.value,
      date: new Date().toISOString() 
    });
    setItensBD();
    loadItens();

    descItem.value = "";
    amount.value = "";
};

function deleteItem(index) {
  if (confirm("Tem certeza que deseja excluir este item?")) {
      items.splice(index, 1);
      setItensBD();
      loadItens();
  }
}

function insertItem(item, index) {
    let tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${item.desc}</td>
        <td>R$ ${item.amount}</td>
        <td>${item.type === "Entrada" ? '<i class="bx bxs-chevron-up-circle"></i>' : '<i class="bx bxs-chevron-down-circle"></i>'}</td>
        <td>${new Date(item.date).toLocaleDateString('pt-BR')}</td> <!-- Exibe a data formatada -->
        <td class="columnAction">
            <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
        </td>
    `;

    tbody.appendChild(tr);
}

function loadItens() {
    items = getItensBD();
    tbody.innerHTML = "";
    items.forEach((item, index) => {
        insertItem(item, index);
    });

    getTotals();
}

function formatCurrency(amount) {
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getTotals() {
    const amountIncomes = items
        .filter((item) => item.type === "Entrada")
        .map((transaction) => Number(transaction.amount));
    
    const amountExpenses = items
        .filter((item) => item.type === "Saída")
        .map((transaction) => Number(transaction.amount));

    const totalIncomeValue = amountIncomes.reduce((acc, cur) => acc + cur, 0);
    const totalExpenseValue = amountExpenses.reduce((acc, cur) => acc + cur, 0);
    const totalItemsValue = totalIncomeValue - totalExpenseValue;

    const totalIncomeFormatted = formatCurrency(totalIncomeValue);
    const totalExpenseFormatted = formatCurrency(Math.abs(totalExpenseValue));
    const totalItemsFormatted = formatCurrency(totalItemsValue);

    incomes.textContent = totalIncomeFormatted;
    expenses.textContent = totalExpenseFormatted;
    total.textContent = totalItemsFormatted;
}


const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) ?? [];
const setItensBD = () => localStorage.setItem("db_items", JSON.stringify(items));

loadItens();
