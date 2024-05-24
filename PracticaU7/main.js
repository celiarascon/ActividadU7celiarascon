

// Referencia a Cloud Firestore
const db = firebase.firestore();

// Evento de envío del formulario
const form = document.getElementById('city-form');
const citiesList = document.getElementById('ciudades-agregadas');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    //Obtener los valores del formulario
    const ciudadInput = document.getElementById('ciudad');
    const paisInput = document.getElementById('pais');
    const mesSelect = document.getElementById('mes');

    const ciudad = ciudadInput.value;
    const pais = paisInput.value;
    const mes = mesSelect.value;

    //Añadir la ciudad a Firebase
    await db.collection("ciudades").add({
        ciudad,
        pais,
        mes,
        visitada: false
    });

    ciudadInput.value = '';
    paisInput.value = '';
    mesSelect.value = 'selecciona';
});


function renderCities(doc) {
    const ciudad = doc.data().ciudad;
    const pais = doc.data().pais;
    const mes = doc.data().mes;

    const li = document.createElement('li');
    li.textContent = `${ciudad}, ${pais}, Mes: ${mes}`;

    // Botón para marcar como visitada
    const visitadaButton = document.createElement('button');
    visitadaButton.textContent = 'Marcar como visitada';
    visitadaButton.addEventListener('click', async () => {
        await db.collection("ciudades").doc(doc.id).update({
            visitada: true
        });
    });

    // Botón para eliminar la ciudad
    const eliminarButton = document.createElement('button');
    eliminarButton.textContent = 'Eliminar';
    eliminarButton.addEventListener('click', async () => {
        await db.collection("ciudades").doc(doc.id).delete();
    });

    li.appendChild(visitadaButton);
    li.appendChild(eliminarButton);

    citiesList.appendChild(li);
}

db.collection("ciudades").onSnapshot((snapshot) => {
    citiesList.innerHTML = '';
    snapshot.forEach((doc) => {
        renderCities(doc);
    });
});
