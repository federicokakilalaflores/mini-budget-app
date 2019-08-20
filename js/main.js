var budgetApp = {
    budgetInput: document.getElementById("budget"),
    expTitleInput:  document.getElementById("expenseTitle"),
    expAmountInput:  document.getElementById("expenseAmount"),
    expenses: {} 
}

//type string: success | danger | warning
budgetApp.errorMsg =function(msg, type = "muted"){
    let errMsg = document.getElementById("errorMsg");
    let alert = errMsg.firstChild;
    alert.removeAttribute("class");
    alert.setAttribute("class","alert alert-" + type);
    alert.innerText = msg;
}

budgetApp.clearFields = function() {
    this.budgetInput.value = 0;
    this.expTitleInput.value = "";
    this.expAmountInput.value = 0;
}

/* BUDGET GOES HERE */
budgetApp.addBudget = function(){
    localStorage.setItem("budget", this.budgetInput.value);
    this.displayBudget(); 
    this.displayTotalExpenseAmnt();
    this.displayComputedBalance();
    this.clearFields();
    this.errorMsg("Your budget updated successfully!", "success");
}

budgetApp.displayBudget = function(){
    document.getElementById("myBudget").innerHTML = "PHP " + localStorage.getItem("budget");
}

/* EXPENSES GOES HERE */
budgetApp.addExpenses = function(){
    localStorage.setItem(this.expTitleInput.value.toUpperCase(), this.expAmountInput.value.toUpperCase());
}

budgetApp.checkExpenseExistence = function(){
        if (this.expenses.hasOwnProperty(this.expTitleInput.value.toUpperCase())) {
            this.errorMsg("The Expense Title you input is already exist!", "warning");
        }else{
            this.addExpenses();
            this.appendExpenses(); 
            this.displayTotalExpenseAmnt();
            this.displayComputedBalance();
            this.clearFields();
            this.errorMsg("Expense added successfully!", "success");
        }
}

budgetApp.getExpenses = function(){
    for(let i=0; i < localStorage.length; i++){
            let key = localStorage.key(i)
            if(key !== "budget"){
                 this.expenses[localStorage.key(i)] = localStorage.getItem(key);
            }
    }
}

budgetApp.appendExpenses =function(){ 
    this.getExpenses();
    let expColumns = document.querySelectorAll(".exp-col, .action-col");
    let para1 = document.createElement("p");
    let para2 = document.createElement("p");
    para1.setAttribute("class", this.expTitleInput.value.toUpperCase());
    para2.setAttribute("class", this.expTitleInput.value.toUpperCase());
    let action = ` <div class="action ${this.expTitleInput.value.toUpperCase()}">
        <i class="fa fa-edit text-warning" data-key="${this.expTitleInput.value.toUpperCase()}"></i>    
        <i class="fa fa-trash text-danger" data-key="${this.expTitleInput.value.toUpperCase()}"></i>    
        </div>`;

   
        para1.innerHTML = this.expTitleInput.value.toUpperCase();  
        para2.innerHTML = this.expAmountInput.value.toUpperCase();
        expColumns[0].appendChild(para1);
        expColumns[1].appendChild(para2);   
   
    expColumns[2].innerHTML += action;
} 

budgetApp.removeItem = function(elem){
    if(elem.classList[1] === "fa-trash"){
      let elemToRemove = document.querySelectorAll("." + elem.dataset.key); 
       elemToRemove.forEach((el) => {
            el.remove();
       });
         
       localStorage.removeItem(elem.dataset.key); 
       this.errorMsg("Record deleted successfully!", "success"); 
       delete this.expenses[elem.dataset.key];
       this.displayTotalExpenseAmnt();
       this.displayComputedBalance();
    }
} 

budgetApp.computeTotalExpenses = function(){
    let expensesAmount = []; 
    let i = 0;
    for (const key in this.expenses) {
        expensesAmount[i] = this.expenses[key];
        i++; 
    }
    
    // reducer return total Amount of expenses
    let totalExp = expensesAmount.reduce(function(total, value){
        return parseFloat(total, 10) + parseFloat(value, 10);
    }, 0)

    return totalExp;
}

budgetApp.computeBalance = function(){
    const totalBudget = localStorage.getItem("budget");
    const totalExpenses = this.computeTotalExpenses();
    const result = totalBudget - totalExpenses;
    return result;
}



budgetApp.displayExpensesOnLoad =function(){
    this.getExpenses();
    let expColumns = document.querySelectorAll(".exp-col, .action-col");
    for(let x in this.expenses){
        let para1 = document.createElement("p");
        let para2 = document.createElement("p");
        para1.setAttribute("class", x);
        para2.setAttribute("class", x);
         let action = ` <div class="action ${x}">
            <i class="fa fa-edit text-warning" data-key="${x}"></i>    
            <i class="fa fa-trash text-danger" data-key="${x}"></i>     
            </div>`;
        para1.innerHTML = x;  
        para2.innerHTML = this.expenses[x];
        expColumns[0].appendChild(para1);
        expColumns[1].appendChild(para2);
        expColumns[2].innerHTML += action;
    }
}

budgetApp.displayComputedBalance = function(){
    const computedBal = this.computeBalance();
    const balElem = document.getElementById("myBalance");

    if(computedBal < 0){
        balElem.innerHTML = "Insufficient budget: PHP " + computedBal;
    }else{
        balElem.innerHTML = "PHP " + computedBal;  
    }

      
}

budgetApp.displayTotalExpenseAmnt = function(){
    document.getElementById("myExpenses").innerHTML = "PHP " + this.computeTotalExpenses();
}

function init(){
    document.getElementById("addBudget").addEventListener('click', () =>  budgetApp.addBudget());
    document.getElementById("addExpense").addEventListener('click', () => budgetApp.checkExpenseExistence());
    document.querySelector(".action-col").addEventListener('click', (e) => { 
        budgetApp.removeItem(e.target);
    });

    budgetApp.displayExpensesOnLoad(); 
    budgetApp.displayBudget();
    budgetApp.displayTotalExpenseAmnt(); 
    budgetApp.displayComputedBalance();  
}

window.addEventListener("DOMContentLoaded", init);



