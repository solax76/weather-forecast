Crea una applicazione web single page utilizzando React con Vite, utilizzando i componenti React-Bootstrap.
Lo scopo è creare una applicazione per le previsioni meteo tramite le API open meteo. 
La pagina principale deve avere una top bar con:
1) una combo box per selezionare il modello meteo da utilizzare; Il modello meteo da utilzzare può essere uno tra i seguenti: ECMWF (default), NOAA, DWD ICON. La selezione del modello deve essere salvata nei dati locali del browser e ricaricata alla prossima visualizzazione.
2) una text box per ricercare un posto nel mondo; La text box di ricerca deve permettere di inserire il nome di un luogo e restituire al modello le coordinate Lat e Long del luogo selezionato per caricare i dati meteo tramite le api openmeteo.
3) un tasto per utilizzare la posizione corrente del dispositivo in uso. Se premuto, la pagina utilizzerà la posizione del dispositivo che sta visualizzando la pagina per caricare i dati meteo tramite le api openmeteo.

Una volta selezionato un luogo o la posizione corrente, l'applicazione deve scaricare i dati openmeteo della posizione scelta e visualizzare le previsioni meteo di 7 giorni come un'immagine del tempo previsto.
