var budgetApp = {
    budgetInput: document.getElementById("budget"),
    expTitleInput:  document.getElementById("expenseTitle"),
    expAmoutInput:  document.getElementById("expenseAmount"),
    //type string: success | danger | warning
    errorMsg: function(msg, type = "muted") {
        let errMsg = document.getElementById("errorMsg");
        let alert = errMsg.firstChild;
        alert.removeAttribute("class");
        alert.setAttribute("class","alert alert-" + type);
        alert.innerText = msg;
    },
    clearFields: function() {
        this.budgetInput.value = 0;
        this.expTitleInput.value = "";
        this.expAmoutInput.value = 0;
    },
    expenses: {} 
}

budgetApp.addBudget = function(){
    localStorage.setItem("budget", this.budgetInput.value);
    this.clearFields();
    this.errorMsg("Your budget updated successfully!", "success");
}

budgetApp.addExpenses = function(){
    localStorage.setItem(this.expTitleInput.value.toUpperCase(), this.expAmoutInput.value.toUpperCase());
}

budgetApp.checkExpenseExistence = function(){
        if (this.expenses.hasOwnProperty(this.expTitleInput.value.toUpperCase())) {
            this.errorMsg("The Expense Title you input is already exist!", "warning");
        }else{
            this.addExpenses();
            this.appendExpenses(); 
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
     let action = ` <div class="action">
        <i class="fa fa-edit text-warning"></i>    
        <i class="fa fa-trash text-danger"></i>    
        </div>`;

    for(let x in this.expenses){
        para1.innerHTML = x;  
        para2.innerHTML = this.expenses[x];
        expColumns[0].appendChild(para1);
        expColumns[1].appendChild(para2);
    }
    expColumns[2].innerHTML += action;
}


budgetApp.displayExpensesOnLoad =function(){
    this.getExpenses();
    let expColumns = document.querySelectorAll(".exp-col, .action-col");
    for(let x in this.expenses){
        let para1 = document.createElement("p");
        let para2 = document.createElement("p");
         let action = ` <div class="action">
            <i class="fa fa-edit text-warning"></i>    
            <i class="fa fa-trash text-danger"></i>    
            </div>`;
        para1.innerHTML = x;  
        para2.innerHTML = this.expenses[x];
        expColumns[0].appendChild(para1);
        expColumns[1].appendChild(para2);
        expColumns[2].innerHTML += action;
    }
}

function init(){
    document.getElementById("addBudget").addEventListener('click', () => budgetApp.addBudget());
    document.getElementById("addExpense").addEventListener('click', () => {
        budgetApp.checkExpenseExistence();
    });

    budgetApp.displayExpensesOnLoad();   
}

window.addEventListener("DOMContentLoaded", init);



