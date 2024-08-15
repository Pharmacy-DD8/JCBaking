let totalCost = 0;
let ingredientCosts = {}; // Object to store the cost of each ingredient

document.querySelectorAll('.calculate-cost').forEach(button => {
    button.addEventListener('click', function() {
        const ingredient = this.closest('.ingredient').dataset.ingredient;
        
        // Skip Oil and Corn Syrup for now
        if (ingredient === 'Oil' || ingredient === 'Corn Syrup') {
            return;
        }

        createDialog(ingredient);
    });
});

function createDialog(ingredient) {
    const dialogContainer = document.getElementById('dialogs-container');
    
    // Remove any existing dialog for the same ingredient
    document.querySelectorAll('.dialog').forEach(dialog => {
        if (dialog.dataset.ingredient === ingredient) {
            dialog.remove();
        }
    });

    const dialog = document.createElement('div');
    dialog.classList.add('dialog');
    dialog.dataset.ingredient = ingredient;

    dialog.innerHTML = `
        <div class="dialog-content">
            <h2>Calculate Cost for ${ingredient}</h2>
            
            <div class="input-row">
                <label for="initial-cost-${ingredient}">Initial Cost (per Lb):</label>
                <input type="number" id="initial-cost-${ingredient}" name="initial-cost" min="0" step="0.01" placeholder="Enter cost per Lb" required>
            </div>
            
            <div class="input-row">
                <label for="quantity-${ingredient}">Qty Used:</label>
                <input type="number" id="quantity-${ingredient}" name="quantity" min="0" step="0.01" placeholder="Enter quantity" required>
                <label for="unit-${ingredient}">Unit:</label>
                <select id="unit-${ingredient}">
                    <option value="lb">Pound (lb)</option>
                    <option value="g">Gram (g)</option>
                </select>
            </div>
            
            <div class="button-row">
                <button class="calculate-button">Calculate</button>
                <button class="close-dialog">Close</button>
            </div>
            
            <div class="cost-result"></div>
        </div>
    `;

    dialog.querySelector('.calculate-button').addEventListener('click', function() {
        const initialCost = parseFloat(dialog.querySelector(`#initial-cost-${ingredient}`).value);
        const quantity = parseFloat(dialog.querySelector(`#quantity-${ingredient}`).value);
        const unit = dialog.querySelector(`#unit-${ingredient}`).value;

        const cost = calculateCost(quantity, unit, initialCost);

        // Update the total cost by removing the previous cost of this ingredient, if any
        if (ingredientCosts[ingredient]) {
            totalCost -= ingredientCosts[ingredient];
        }

        ingredientCosts[ingredient] = cost; // Store the new cost for this ingredient
        totalCost += cost; // Add the new cost to the total

        dialog.querySelector('.cost-result').innerText = `Cost: $${cost.toFixed(2)}`;
        updateTotalCost();
    });

    dialog.querySelector('.close-dialog').addEventListener('click', function() {
        // Subtract the cost of the dialog when it's closed
        if (ingredientCosts[ingredient]) {
            totalCost -= ingredientCosts[ingredient];
            delete ingredientCosts[ingredient]; // Remove the ingredient from the cost tracking
        }
        updateTotalCost();
        dialog.remove();
    });

    dialogContainer.prepend(dialog); // Add new dialogs above the existing ones
}

function calculateCost(quantity, unit, initialCost) {
    let cost = 0;
    if (unit === 'lb') {
        cost = quantity * initialCost;
    } else if (unit === 'g') {
        cost = (quantity / 453.6) * initialCost; // Convert grams to pounds and calculate
    }
    return cost;
}

function updateTotalCost() {
    document.getElementById('total').innerText = totalCost.toFixed(2);
}
