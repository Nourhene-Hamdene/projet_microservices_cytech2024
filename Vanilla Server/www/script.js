document.getElementById('guessForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêcher la soumission du formulaire
    
    const guessedWord = document.getElementById('guessInput').value.toLowerCase();
    const targetWord = localStorage.getItem('targetWord');

    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = ''; // Effacer le résultat précédent

    if (guessedWord === targetWord) {
        // Si le mot donné correspond exactement au mot du jour, afficher "BRAVO"
        const bravoSpan = document.createElement('span');
        bravoSpan.textContent = 'BRAVO';
        bravoSpan.style.color = 'blue'; // Couleur de texte bleue pour "BRAVO"

        console.log('BRAVO span created:', bravoSpan); // Débogage
        console.log('Result container:', resultContainer); // Débogage

        resultContainer.appendChild(bravoSpan); // Ajout de l'élément "BRAVO" à resultContainer

        // Effacer le champ de saisie lorsque le mot est correct
        document.getElementById('guessInput').value = '';
    } else {
        // Sinon, parcourir chaque lettre et appliquer les styles Motus
        for (let i = 0; i < guessedWord.length; i++) {
            const guessedLetter = guessedWord[i];
            const targetLetter = targetWord[i];

            const letterSpan = document.createElement('span');
            letterSpan.textContent = guessedLetter;

            if (guessedLetter === targetLetter) {
                letterSpan.style.backgroundColor = 'green';
            } else if (targetWord.includes(guessedLetter)) {
                letterSpan.style.backgroundColor = 'orange';
            }

            resultContainer.appendChild(letterSpan);
        }

        // Effacer le champ de saisie après chaque soumission de formulaire
        document.getElementById('guessInput').value = '';
    }

    // Ajouter la tentative de l'utilisateur au tableau des tentatives
    attempts.push(guessedWord + '<br>');

    // Afficher les tentatives dans une forme tabulaire
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