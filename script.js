document.addEventListener("DOMContentLoaded", () => {

    const boutonsAchat = document.querySelectorAll('.achat');
    const panierItems = document.getElementById('panier-items');
    const totalElement = document.getElementById('total');
    const btnCommander = document.getElementById('btn-commander');

    let panier = []; // tableau de produits

    // Ajouter au panier
    boutonsAchat.forEach(btn => {
        btn.addEventListener('click', () => {
            const nom = btn.dataset.name;
            const prix = parseFloat(btn.dataset.price);

            ajouterAuPanier(nom, prix);
            afficherPanier();
        });
    });

    function ajouterAuPanier(nom, prix) {
        const item = panier.find(p => p.nom === nom);

        if (item) {
            item.quantite++;
        } else {
            panier.push({
                nom,
                prix,
                quantite: 1
            });
        }
    }

    function afficherPanier() {
        panierItems.innerHTML = "";
        let total = 0;

        panier.forEach((item, index) => {
            total += item.prix * item.quantite;

            const li = document.createElement('li');
            li.classList.add('item-panier');

            li.innerHTML = `
                ${item.nom} — ${item.prix}€  
                <div class="qte-controls">
                    <button class="moins">-</button>
                    <span>${item.quantite}</span>
                    <button class="plus">+</button>
                </div>
                <button class="remove">✖</button>
            `;

            // +
            li.querySelector('.plus').addEventListener('click', () => {
                item.quantite++;
                afficherPanier();
            });

            // -
            li.querySelector('.moins').addEventListener('click', () => {
                if (item.quantite > 1) {
                    item.quantite--;
                } else {
                    panier.splice(index, 1);
                }
                afficherPanier();
            });

            // supprimer
            li.querySelector('.remove').addEventListener('click', () => {
                panier.splice(index, 1);
                afficherPanier();
            });

            panierItems.appendChild(li);
        });

        totalElement.textContent = total.toFixed(2);
    }

    // BOUTON COMMANDER
    btnCommander.addEventListener('click', () => {

        const contenuCommande = panier.map(item => {
            return `${item.nom} x ${item.quantite} = ${item.prix * item.quantite}€`;
        }).join("\n");

        const message = encodeURIComponent(
            "Nouvelle commande :\n\n" +
            contenuCommande +
            `\n\nTotal : ${totalElement.textContent}€`
        );

        // TON LIEN PAYPAL (avec https:// obligatoire)
        const lienPaypal = "https://paypal.me/StoreHelios";

        // Si EmailJS n'est pas configuré → redirection seule
        try {
            emailjs.send("service_id", "template_id", { message });
        } catch (e) {
            console.warn("EmailJS non configuré, redirection seule.");
        }

        // Redirection
        window.location.href = lienPaypal;
    });

});
