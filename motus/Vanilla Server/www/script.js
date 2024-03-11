// Récupérer le mot du jour depuis votre serveur
fetch('/word')
  .then(response => response.text())
  .then(word => {
    localStorage.setItem('targetWord', word); // Sauvegarder le mot du jour localement
    document.getElementById('targetWord').textContent = word; // Afficher le mot du jour dans l'interface utilisateur
  })
  .catch(error => console.error('Error fetching word:', error));

// Écoutez l'événement de soumission du formulaire de devinette
document.getElementById('guessForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêcher la soumission du formulaire

    // Récupérez le mot deviné par l'utilisateur et convertissez-le en minuscules
    const guessedWord = document.getElementById('guessInput').value.toLowerCase();

    // Récupérez le mot cible du jour depuis le stockage local
    const targetWord = localStorage.getItem('targetWord');

    // Récupérez la référence de l'élément conteneur de résultat
    const resultContainer = document.getElementById('result');

    // Effacez le contenu précédent du conteneur de résultat
    resultContainer.innerHTML = '';

    if (guessedWord === targetWord) {
        // Si le mot deviné correspond exactement au mot cible du jour, affichez "BRAVO"
        const bravoSpan = document.createElement('span');
        bravoSpan.textContent = 'BRAVO';
        bravoSpan.style.color = 'blue'; // Couleur de texte bleue pour "BRAVO"

        // Ajoutez l'élément "BRAVO" au conteneur de résultat
        resultContainer.appendChild(bravoSpan);

        // Effacez le champ de saisie lorsque le mot est correct
        document.getElementById('guessInput').value = '';
    } else {
        // Parcourez chaque lettre devinée et appliquez les styles Motus
        for (let i = 0; i < guessedWord.length; i++) {
            const guessedLetter = guessedWord[i];
            const targetLetter = targetWord[i];

            const letterSpan = document.createElement('span');
            letterSpan.textContent = guessedLetter;

            if (guessedLetter === targetLetter) {
                letterSpan.style.backgroundColor = 'green'; // Lettre correcte, fond vert
            } else if (targetWord.includes(guessedLetter)) {
                letterSpan.style.backgroundColor = 'orange'; // Lettre incorrecte mais présente, fond orange
            }

            // Ajoutez l'élément de lettre au conteneur de résultat
            resultContainer.appendChild(letterSpan);
        }

        // Effacez le champ de saisie après chaque soumission du formulaire
        document.getElementById('guessInput').value = '';
    }

    // Ajoutez la tentative de l'utilisateur au tableau des tentatives
    attempts.push(guessedWord + '<br>');

    // Affichez les tentatives dans une forme tabulaire
    displayAttempts();
});

// Sélectionnez tous les boutons du clavier
const keys = document.querySelectorAll('.key');

// Ajoutez un gestionnaire d'événements à chaque bouton
keys.forEach(key => {
    key.addEventListener('click', function() {
        // Récupérez la lettre du bouton
        const letter = this.textContent;

        // Ajoutez la lettre au champ de saisie
        const input = document.getElementById('guessInput');
        input.value += letter;
    });
});
