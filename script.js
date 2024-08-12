let totalCost = 0;
let currentDialogCost = 0;

document.querySelectorAll('.calculate-cost').forEach(button => {
    button.addEventListener('click', function() {
        const ingredient = this.closest('.ingredient').dataset.ingredient;
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

    // Determine if the ingredient requires special handling
    const isSpecialIngredient = ingredient === 'Oil' || ingredient === 'Corn Syrup';
    const costLabel = isSpecialIngredient ? 'per Oz' : 'per Lb'; // Capitalized 'Lb' without $ sign
    const unitOptions = isSpecialIngredient
        ? `<option value="oz">Ounce (oz)</option>
           <option value="tsp">Teaspoon (tsp)</option>
           <option value="tbsp">Tablespoon (tbsp)</option>`
        : `<option value="lb">Pound (lb)</option>
           <option value="g">Gram (g)</option>`;

    dialog.innerHTML = `
        <div class="dialog-content">
            <h2>Calculate Cost for ${ingredient}</h2>
            
            <div class="input-row">
                <label for="initial-cost-${ingredient}">Initial Cost (${costLabel}):</label>
                <input type="number" id="initial-cost-${ingredient}" name="initial-cost" min="0" step="0.01" placeholder="Enter cost" required>
            </div>
            
            <div class="input-row">
                <label for="quantity-${ingredient}">Qty Used:</label>
                <input type="number" id="quantity-${ingredient}" name="quantity" min="0" step="0.01" placeholder="Enter quantity" required>
                <label for="unit-${ingredient}">Unit:</label>
                <select id="unit-${ingredient}">
                    ${unitOptions}
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

        const cost = calculateCost(quantity, unit, initialCost, isSpecialIngredient);
        dialog.querySelector('.cost-result').innerText = `Cost: $${cost.toFixed(2)}`;
        
        // Update total cost and store the current dialog cost
        if (currentDialogCost > 0) {
            updateTotalCost(-currentDialogCost); // Subtract previous cost if it exists
        }
        currentDialogCost = cost; // Store current cost
        updateTotalCost(cost);
    });

    dialog.querySelector('.close-dialog').addEventListener('click', function() {
        // Subtract the cost of the dialog when it's closed
        updateTotalCost(-currentDialogCost);
        currentDialogCost = 0; // Reset the current dialog cost
        dialog.remove();
    });

    dialogContainer.prepend(dialog); // Add new dialogs above the existing ones
}

function calculateCost(quantity, unit, initialCost, isSpecialIngredient) {
    // Conversion factors
    const conversionFactors = {
        "tsp": 1 / 768,  // Teaspoons in a gallon
        "tbsp": 1 / 256, // Tablespoons in a gallon
        "cup": 1 / 16,   // Cups in a gallon
        "pt": 1 / 8,     // Pints in a gallon
        "qt": 1 / 4,     // Quarts in a gallon
        "gal": 1,        // Gallon
        "oz": 1,         // Ounce
        "lb": 1,         // Pound
        "g": 0.00220462  // Grams to Pounds
    };

    let quantityInBaseUnit;

    if (isSpecialIngredient) {
        // For special ingredients like oil and corn syrup
        quantityInBaseUnit = quantity * conversionFactors[unit]; // Convert to base unit
    } else {
        // For non-special ingredients like sugar
        quantityInBaseUnit = unit === 'g'
            ? quantity * conversionFactors[unit] // Convert grams to pounds
            : quantity; // Quantity in pounds
    }

    // Calculate the total cost
    const totalCost = quantityInBaseUnit * initialCost;

    return totalCost;
}

function updateTotalCost(cost) {
    totalCost += cost;
    document.getElementById('total').innerText = totalCost.toFixed(2);
}
