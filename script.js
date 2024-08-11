// script.js

let totalCost = 0;

document.querySelectorAll('.calculate-cost').forEach(button => {
    button.addEventListener('click', function() {
        const ingredient = this.closest('.ingredient').dataset.ingredient;
        createDialog(ingredient);
    });
});

function createDialog(ingredient) {
    const dialogContainer = document.getElementById('dialogs-container');
    const dialog = document.createElement('div');
    dialog.classList.add('dialog');
    
    dialog.innerHTML = `
        <div class="dialog-content">
            <h2>Calculate Cost for ${ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}</h2>
            
            <div class="input-row">
                <label for="initial-cost-${ingredient}">Initial Cost:</label>
                <input type="number" id="initial-cost-${ingredient}" name="initial-cost" min="0" step="0.01" placeholder="Enter cost">
            </div>
            <div class="input-row">
                <label for="initial-unit-${ingredient}">Unit of Measure:</label>
                <select id="initial-unit-${ingredient}">
                    <option value="pt">Pint (pt)</option>
                    <option value="qt">Quart (qt)</option>
                    <option value="gal">Gallon (gal)</option>
                </select>
            </div>
            
            <div class="input-row">
                <label for="quantity-${ingredient}">Quantity:</label>
                <input type="number" id="quantity-${ingredient}" name="quantity" min="0" placeholder="Enter quantity">
                <label for="unit-${ingredient}">Unit:</label>
                <select id="unit-${ingredient}">
                    <option value="tsp">Teaspoon (tsp)</option>
                    <option value="tbsp">Tablespoon (tbsp)</option>
                    <option value="cup">Cup</option>
                    <option value="pt">Pint (pt)</option>
                    <option value="qt">Quart (qt)</option>
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
        const initialUnit = dialog.querySelector(`#initial-unit-${ingredient}`).value;
        const quantity = parseFloat(dialog.querySelector(`#quantity-${ingredient}`).value);
        const unit = dialog.querySelector(`#unit-${ingredient}`).value;

        const cost = calculateCost(quantity, unit, initialCost, initialUnit);
        dialog.querySelector('.cost-result').innerText = `Cost: $${cost.toFixed(2)}`;
        updateTotalCost(cost);
    });

    dialog.querySelector('.close-dialog').addEventListener('click', function() {
        dialog.remove();
    });

    dialogContainer.appendChild(dialog);
}

function calculateCost(quantity, unit, initialCost, initialUnit) {
    const conversionFactors = {
        "tsp": 1 / 768,  // Teaspoons in a gallon
        "tbsp": 1 / 256, // Tablespoons in a gallon
        "cup": 1 / 16,   // Cups in a gallon
        "pt": 1 / 8,     // Pints in a gallon
        "qt": 1 / 4,     // Quarts in a gallon
        "gal": 1         // Gallon
    };

    // Convert the quantity to the equivalent in gallons
    const quantityInGallons = quantity * conversionFactors[unit];

    // Convert the initial cost to cost per gallon
    const costPerGallon = initialCost / conversionFactors[initialUnit];

    // Calculate the total cost
    const totalCost = quantityInGallons * costPerGallon;

    return totalCost;
}

function updateTotalCost(cost) {
    totalCost += cost;
    document.getElementById('total').innerText = totalCost.toFixed(2);
}
