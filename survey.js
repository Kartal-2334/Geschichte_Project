let responses = [];

function updateStatistics() {
    const totalResponses = responses.length;
    document.getElementById('totalResponses').textContent = totalResponses;

    if (totalResponses > 0) {
        // Calculate average age
        const totalAge = responses.reduce((sum, response) => sum + response.age, 0);
        const avgAge = (totalAge / totalResponses).toFixed(1);
        document.getElementById('averageAge').textContent = avgAge;

        // Calculate average integration
        const integrationValues = {
            'Sehr gut': 5,
            'Gut': 4,
            'Mittelmäßig': 3,
            'Schlecht': 2,
            'Sehr schlecht': 1
        };
        const totalIntegration = responses.reduce((sum, response) => 
            sum + integrationValues[response.integration], 0);
        const avgIntegration = (totalIntegration / totalResponses).toFixed(1);
        document.getElementById('averageIntegration').textContent = avgIntegration;

        // Calculate average languages per person
        const totalLanguages = responses.reduce((sum, response) => 
            sum + response.languages.length, 0);
        const avgLanguages = (totalLanguages / totalResponses).toFixed(1);
        document.getElementById('avgLanguages').textContent = avgLanguages;
    }
}

function handleSubmit(event) {
    event.preventDefault();
    
    const formData = {
        age: parseInt(document.getElementById('age').value),
        origin: document.getElementById('origin').value,
        integration: document.getElementById('integration').value,
        languages: Array.from(document.querySelectorAll('input[name="languages"]:checked')).map(cb => cb.value),
        challenges: document.getElementById('challenges').value,
        suggestions: document.getElementById('suggestions').value
    };

    responses.push(formData);
    
    // Update charts
    updateCharts();
    
    // Update statistics
    updateStatistics();
    
    // Display responses
    displayResponses();
    
    // Show results section
    document.getElementById('surveyResults').style.display = 'block';
    document.getElementById('surveyStats').style.display = 'block';
    
    // Reset form
    event.target.reset();
}

function displayResponses() {
    const container = document.getElementById('responsesContainer');
    container.innerHTML = '';

    responses.forEach((response, index) => {
        const responseCard = document.createElement('div');
        responseCard.className = 'response-card';
        responseCard.innerHTML = `
            <div class="response-header">
                <h5>Antwort #${index + 1}</h5>
            </div>
            <div class="response-details">
                <p><strong>Alter:</strong> ${response.age}</p>
                <p><strong>Herkunft:</strong> ${response.origin}</p>
                <p><strong>Integration:</strong> ${response.integration}</p>
                <p><strong>Sprachen:</strong> ${response.languages.join(', ')}</p>
                ${response.challenges ? `<p><strong>Herausforderungen:</strong> ${response.challenges}</p>` : ''}
                ${response.suggestions ? `<p><strong>Vorschläge:</strong> ${response.suggestions}</p>` : ''}
            </div>
        `;
        container.appendChild(responseCard);
    });
}

function updateCharts() {
    const chartColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        '#8AC249', '#EA526F', '#23B5D3', '#279AF1', '#7E52A0', '#F7B801'
    ];

    // Origin Chart
    const originData = {
        labels: [...new Set(responses.map(r => r.origin))],
        datasets: [{
            data: [...new Set(responses.map(r => r.origin))].map(
                origin => responses.filter(r => r.origin === origin).length
            ),
            backgroundColor: chartColors
        }]
    };

    new Chart(document.getElementById('originChart'), {
        type: 'pie',
        data: originData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Verteilung nach Herkunftsländern'
                }
            }
        }
    });

    // Integration Chart
    const integrationData = {
        labels: ['Sehr gut', 'Gut', 'Mittelmäßig', 'Schlecht', 'Sehr schlecht'],
        datasets: [{
            data: [
                responses.filter(r => r.integration === 'Sehr gut').length,
                responses.filter(r => r.integration === 'Gut').length,
                responses.filter(r => r.integration === 'Mittelmäßig').length,
                responses.filter(r => r.integration === 'Schlecht').length,
                responses.filter(r => r.integration === 'Sehr schlecht').length
            ],
            backgroundColor: chartColors
        }]
    };

    new Chart(document.getElementById('integrationChart'), {
        type: 'pie',
        data: integrationData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Integration in der Schule'
                }
            }
        }
    });

    // Languages Chart
    const languagesData = {
        labels: ['Deutsch', 'Englisch', 'Türkisch', 'Arabisch', 'Russisch', 'Andere'],
        datasets: [{
            data: [
                responses.filter(r => r.languages.includes('Deutsch')).length,
                responses.filter(r => r.languages.includes('Englisch')).length,
                responses.filter(r => r.languages.includes('Türkisch')).length,
                responses.filter(r => r.languages.includes('Arabisch')).length,
                responses.filter(r => r.languages.includes('Russisch')).length,
                responses.filter(r => r.languages.includes('Andere')).length
            ],
            backgroundColor: chartColors
        }]
    };

    new Chart(document.getElementById('languagesChart'), {
        type: 'pie',
        data: languagesData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Verteilung der Sprachen'
                }
            }
        }
    });

    // Age Distribution Chart
    const ageData = {
        labels: ['10-12', '13-15', '16-18', '19-21', '22-25'],
        datasets: [{
            data: [
                responses.filter(r => r.age >= 10 && r.age <= 12).length,
                responses.filter(r => r.age >= 13 && r.age <= 15).length,
                responses.filter(r => r.age >= 16 && r.age <= 18).length,
                responses.filter(r => r.age >= 19 && r.age <= 21).length,
                responses.filter(r => r.age >= 22 && r.age <= 25).length
            ],
            backgroundColor: chartColors
        }]
    };

    new Chart(document.getElementById('ageChart'), {
        type: 'pie',
        data: ageData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Altersverteilung der Teilnehmer'
                }
            }
        }
    });

    // Update upper diagrams
    updateUpperDiagrams();
}

function updateUpperDiagrams() {
    // Migration Chart
    const migrationData = {
        labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [{
            label: 'Migration nach Deutschland',
            data: [890000, 670000, 186000, 166000, 327000, 221000, 191000, 244000, 329000],
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            fill: true
        }]
    };

    new Chart(document.getElementById('migrationChart'), {
        type: 'line',
        data: migrationData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Migration nach Deutschland'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Anzahl der Migranten'
                    }
                }
            }
        }
    });

    // Integration Chart
    const integrationData = {
        labels: ['Erwerbstätig', 'In Ausbildung', 'Arbeitssuchend', 'Nicht erwerbstätig'],
        datasets: [{
            data: [65, 15, 12, 8],
            backgroundColor: ['#2ecc71', '#3498db', '#e74c3c', '#95a5a6']
        }]
    };

    new Chart(document.getElementById('integrationChart'), {
        type: 'pie',
        data: integrationData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Integration & Arbeitsmarkt'
                }
            }
        }
    });
} 