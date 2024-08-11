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
            <label for="quantity-${ingredient}">Quantity:</label>
            <input type="number" id="quantity-${ingredient}" name="quantity" min="0" value="0">
            <button class="calculate-button">Calculate</button>
            <button class="close-dialog">Close</button>
            <div class="cost-result"></div>
        </div>
    `;
    
    dialog.querySelector('.calculate-button').addEventListener('click', function() {
        const quantity = dialog.querySelector(`#quantity-${ingredient}`).value;
        const cost = calculateCost(quantity);
        dialog.querySelector('.cost-result').innerText = `Cost: $${cost.toFixed(2)}`;
        updateTotalCost(cost);
    });

    dialog.querySelector('.close-dialog').addEventListener('click', function() {
        dialog.remove();
    });

    dialogContainer.appendChild(dialog);
}

function calculateCost(quantity) {
    const pricePerUnit = 2; // Example price per unit
    return quantity * pricePerUnit;
}

function updateTotalCost(cost) {
    totalCost += cost;
    document.getElementById('total').innerText = totalCost.toFixed(2);
}
