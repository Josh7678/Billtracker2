let bills = [];

function addBill() {
  const name = document.getElementById('billName').value;
  const amount = parseFloat(document.getElementById('billAmount').value);
  const dueDate = new Date(document.getElementById('billDueDate').value);

  if (!name || isNaN(amount) || !dueDate) {
    alert('Please fill in all fields correctly.');
    return;
  }

  const bill = { name, amount, dueDate, paid: false };
  bills.push(bill);
  renderBills();
  updateSummary();
  clearInputs();
}

function clearInputs() {
  document.getElementById('billName').value = '';
  document.getElementById('billAmount').value = '';
  document.getElementById('billDueDate').value = '';
}

function renderBills() {
  const tbody = document.getElementById('billsTable').querySelector('tbody');
  tbody.innerHTML = '';

  bills.forEach((bill, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${bill.name}</td>
      <td>$${bill.amount.toFixed(2)}</td>
      <td>${bill.dueDate.toDateString()}</td>
      <td>${bill.paid ? 'Paid' : 'Pending'}</td>
      <td>
        ${!bill.paid ? `<button onclick="payBill(${index})">Pay</button>` : ''}
      </td>
    `;
    tbody.appendChild(row);
  });
}

function payBill(index) {
  bills[index].paid = true;
  renderBills();
  updateSummary();
}

function updateSummary() {
  const today = new Date();
  let total = 0;
  let daysRemaining = Infinity;

  bills.forEach(bill => {
    if (!bill.paid) {
      total += bill.amount;
      const diffTime = bill.dueDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < daysRemaining) {
        daysRemaining = diffDays;
      }
    }
  });

  if (daysRemaining === Infinity) {
    daysRemaining = 0;
  }

  const dailySave = daysRemaining > 0 ? total / daysRemaining : total;

  document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
  document.getElementById('daysRemaining').textContent = daysRemaining;
  document.getElementById('dailySave').textContent = `$${dailySave.toFixed(2)}`;
}

// Optionally, update daily savings every day
setInterval(updateSummary, 1000 * 60 * 60 * 24); // once per day