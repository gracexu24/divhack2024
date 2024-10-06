        // Variables to store the state of the checkboxes
        let isChecked1 = false;
        let isChecked2 = false;
        let isChecked3 = false;

        function handleCheckboxChange(checkbox) {
            // Update the variable based on checkbox state
            if (checkbox.id === 'item1') {
                isChecked1 = checkbox.checked;
            } else if (checkbox.id === 'item2') {
                isChecked2 = checkbox.checked;
            } else if (checkbox.id === 'item3') {
                isChecked3 = checkbox.checked;
            }
            // Update counts based on checkbox states
            updateCounts();
        }

        function updateCounts() {
            let x = 0, y = 0, z = 0;

            if (isChecked1) {
                x += 1;
            }
            if (isChecked2) {
                y += 1;
            }
            if (isChecked3) {
                z += 1;
            }
        }
        console.log(`Count x: ${x}, Count y: ${y}, Count z: ${z}`);