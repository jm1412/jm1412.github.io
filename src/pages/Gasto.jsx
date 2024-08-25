import React, { useState } from "react";
import styles from "./Gasto.module.css";

function GetExpensesFromServer() {
  // Get expense details from server.
  // Sent from django already broken down to minimize work from js.

  // Sample data only.
  const categories = {
    Housing: 0,
    Transportation: 5.75,
    Food: 40,
    Health: 30,
    Personal: 10,
    Entertainment: 5,
    Shopping: 35,
    Savings: 100,
    Debt: 30,
    Miscellaneous: 0,
  };

  // Sample expense breakdown from django
  const detailedBreakdown = {
    Housing: ["Rent: $0", "Utilities: $0"],
    Transportation: ["Bus: $2.00", "Gas: $3.75"],
    Food: ["Groceries: $30", "Dining Out: $10"],
    Health: ["Doctor: $20", "Medication: $10"],
    Personal: ["Gym: $10"],
    Entertainment: ["Movies: $5"],
    Shopping: ["Clothes: $20", "Gadgets: $15"],
    Savings: ["Emergency Fund: $50", "Investments: $50"],
    Debt: ["Credit Card: $20", "Loan: $10"],
    Miscellaneous: [],
  };

  const subCategories = {
    Housing: ["Rent", "Utilities"],
    Transportation: ["Bus", "Gas"],
    Food: ["Groceries", "Dining Out"],
    Health: ["Doctor", "Medication"],
    Personal: ["Gym", "Salon"],
    Entertainment: ["Movies", "Concerts"],
    Shopping: ["Clothes", "Gadgets"],
    Savings: ["Emergency Fund", "Investments"],
    Debt: ["Credit Card", "Loan"],
    Miscellaneous: ["Miscellaneous Expenses"],
  };

  const transactions_today = [
    {
      telegram_id: 6478073188,
      amount_spent: 5.0,
      date_spent: "2024-08-21",
      created_on: "2024-08-21",
      date_spent_timezone: "Europe/London",
      expense_comment: "Test",
      category: "Rent",
    },
    {
      telegram_id: 6478073188,
      amount_spent: 6.0,
      date_spent: "2024-08-21",
      created_on: "2024-08-21",
      date_spent_timezone: "Europe/London",
      expense_comment: "Test",
      category: "Rent",
    },
  ];

  return { categories, detailedBreakdown, subCategories, transactions_today };
}

function Gasto() {
  const { categories, detailedBreakdown, subCategories, transactions_today } =
    GetExpensesFromServer();
  const entries = Object.entries(categories);

  function GetExpenseEntries(entries, start, end) {
    /*
    Gets expense entries and returns them in a card
    */
    return entries.slice(start, end).map(([category, total]) => (
      <div
        className="col-sm"
        id={styles.expenseDiv}
        key={`expense-div-${category}`}
      >
        <article
          className={styles.expenseEntry}
          key={`expense-entry-${category}`}
          onClick={() => ExpandExpenseCategory(category)}
        >
          <span>{category}</span> : <span>{total}</span>
        </article>
      </div>
    ));
  }

  function ExpenseTransactionsToday() {
    /*
    Makes list of today's expense transactions for quick view.
    Will be used at home page to show user of all their expenses transactions today.
    */
    const itemsPerRow = 2;
    const rows = [];

    return (
      <>
        <p>Test</p>
      </>
    );
  }

  function ExpenseSummaryToday() {
    /* 
    Makes the list of expenses for display in UserView
    Uses GetExpenseEntries to make the cards
    */
    const itemsPerRow = 2; // Columns per row
    const rows = [];
    for (let i = 0; i < entries.length; i += itemsPerRow) {
      rows.push(
        <div className="row" key={`row-${i}`}>
          {GetExpenseEntries(entries, i, i + itemsPerRow)}
        </div>
      );
    }
    return (
      <>
        <h2>Today's Summary</h2>
        {rows}
      </>
    );
  }

  const ExpandExpenseCategory = (category) => {
    /* When user clicks on expense card, shows breakdown of that expense
    Uses setUserView to what user views
    */
    const details = detailedBreakdown[category] || ["No details available"];
    setUserView(
      <div className={styles.detailedView}>
        <h4>{category} Breakdown</h4>
        <ul>
          {details.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <button onClick={() => setUserView(<HomePage />)}>Back</button>
      </div>
    );
  };

  const CreateButton = ({ label, onClickHandler, className }) => {
    return (
      <button className={className} onClick={onClickHandler}>
        {label}
      </button>
    );
  };

  const BackButton = () => {
    return (
      <CreateButton
        label="Back"
        onClickHandler={() => setUserView(<HomePage />)}
        className={styles.button}
      />
    );
  };

  const AddExpenseButton = () => {
    return (
      <CreateButton
        label="Add Expense"
        onClickHandler={InitiateAddExpense}
        className={styles.button}
      />
    );
  };

  const ViewExpenseButton = () => {
    return (
      <CreateButton
        label="View Expenses"
        onClickHandler={() => setUserView(<HomePage />)}
        className={styles.button}
      />
    );
  };

  const HomePage = () => {
    return (
      <>
        <ExpenseSummaryToday />
        {/* <ExpenseTransactionsToday /> */}
        <Buttons>
          <ViewExpenseButton />
          <AddExpenseButton />
        </Buttons>
      </>
    );
  };

  const Buttons = ({ children }) => {
    return <div className={`${styles.buttons} grid`}>{children}</div>;
  };

  function InitiateAddExpense() {
    // Show add expense form.

    const AddExpenseForm = () => {
      const [selectedCategory, setSelectedCategory] = useState(""); // State to track the selected main category

      const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value); // Update selected category when user selects a main category
      };

      return (
        <>
          <article>
            <form>
              <fieldset>
                <label>
                  Amount
                  <input name="expense_amount" placeholder="0" />
                </label>
                <select
                  name="main-category"
                  aria-label="Category"
                  required
                  onChange={handleCategoryChange}
                  value={selectedCategory}
                >
                  <option selected disabled value="">
                    Select Category
                  </option>
                  {Object.keys(subCategories).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {selectedCategory && (
                  <select
                    name="sub-category"
                    aria-label="Sub-Category"
                    required
                  >
                    <option selected disabled value="">
                      Select Sub-Category
                    </option>
                    {subCategories[selectedCategory].map((subCategory) => (
                      <option key={subCategory} value={subCategory}>
                        {subCategory}
                      </option>
                    ))}
                  </select>
                )}
              </fieldset>
              <input type="submit" value="Submit" />
            </form>
          </article>
        </>
      );
    };

    setUserView(
      <>
        <h2>Add Expense</h2>
        <AddExpenseForm />
        <Buttons>
          <BackButton />
        </Buttons>
      </>
    );
  }

  const [userView, setUserView] = useState(<HomePage />);

  return (
    <>
      <div className={`${styles.expenseContainer} container`}>{userView}</div>
    </>
  );
}

export default Gasto;
