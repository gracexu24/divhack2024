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
            let Friends = 0, News = 0, Videos = 0;

            if (isChecked1) {
                Friends += 1;
            }
            if (isChecked2) {
                News += 1;
            }
            if (isChecked3) {
                Videos += 1;
            }
        }

        async function sendDataToSheet(Friends, News, Videos) {
            const url = ''; // Replace with your web app URL
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ Friends, News, Videos })
            });
            
            const result = await response.json();
            console.log(result); // Log the response from Google Sheets
          }
          
        