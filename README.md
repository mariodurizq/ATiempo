# ATiempo · ¿A qué hora salgo?

Web app (PWA) que te dice **a qué hora despertarte, empezar a prepararte y salir** para llegar a tiempo al trabajo, a una reserva o a cualquier plan. Inspirada en el concepto “sleep in when there's less traffic”.

👉 **https://mariodurizq.github.io/atiempo/**

## Qué hace
- **Rutinas (automatizaciones):** “Estar en el trabajo a las 9:00, L-V”. Calcula la hora de despertar de cada día con el tráfico típico de ese día y hora, y te muestra cuántos **minutos extra de sueño** ganas respecto al peor tráfico.
- **Planes y reservas:** pones dirección y hora; calcula desde **tu ubicación** (GPS) o desde casa cuánto tardas y **cuánto se suele tardar en aparcar** allí.
- **Aparcamiento:** estimación por zona (Centro/ZBE, interior M-30 con SER, exterior, periferia) y hora (noches de viernes/sábado, laborables…), opción “tengo plaza”, y búsqueda de **parkings públicos cercanos** (< 800 m).
- **Tiempo de preparación por defecto** (y personalizable por rutina/plan), margen al llegar y minutos para despertarte antes de prepararte.
- **Timeline** Dormir → Prepararte → Trayecto (coloreado por tráfico) → Aparcar → Llegada, y widget “X min a destino · Sal a las HH:MM”.
- **Avisos** en el navegador y **exportación a calendario (.ics)** con alarmas (despertar, prepararte, salir) que suenan aunque la web esté cerrada.
- **Garaje:** te pregunta cuánto tardas de casa a tu garaje y lo suma (bloque “Al garaje” → “Arrancas a las…”).
- **Planes con más gente:** invita por WhatsApp con un enlace. Cada persona pone sus tiempos (desde dónde sale, cómo va, cuánto tarda en prepararse) y recibe sus propios avisos. Todos ven “Quién viene” (preparándose / en camino / ha llegado) y se avisa cuando alguien **sale de casa** (botón “Salgo ya” o automático con la ubicación mientras ATiempo esté abierto). Para tener push con la web cerrada, cada uno puede suscribirse al tema del plan en la app gratuita **ntfy**.
- **Alarmas en el reloj del móvil:** eliges para qué hora (despertar / prepararte / salir), cuántas alarmas y cuántos minutos antes y después. Android: enlaces que crean la alarma en el Reloj. iPhone: atajo “ATiempo Alarmas” (instrucciones dentro de la app) que las crea todas de golpe.
- **Festivos de Madrid 2026–2027** (capital o solo Comunidad): las rutinas no cuentan esos días. Alarmas de rutina que se repiten L-V (atajo “ATiempo Alarmas LV”) y automatización nocturna “ATiempo Festivos” que lee `festivos.txt` y apaga las alarmas si mañana es festivo.
- **Aprende de tus viajes reales:** botones “Salgo ya” / “He llegado” (o GPS con la web abierta). Con 2+ viajes a un sitio a una hora parecida, corrige el tiempo previsto con la mediana real.
- **Lluvia:** Open-Meteo (gratis). Si se espera lluvia a tu hora de salida, suma minutos y lo indica.
- **Alarmas automáticas en iPhone:** la web envía al atajo “ATiempo Guardar” un horario de 14 días (sin festivos) que se guarda en el iPhone; una automatización nocturna crea las alarmas de mañana.
- Enlaces a Google Maps / Waze / Citymapper para comprobar el tráfico en vivo.

## Servicios (todos gratis y sin claves)
| Uso | Servicio |
|---|---|
| Rutas coche/andando/bici | OSRM (routing.openstreetmap.de, router.project-osrm.org) |
| Buscador de direcciones | Photon (Komoot) + Nominatim de respaldo |
| Parkings cercanos | Overpass API (OpenStreetMap) |
| Lluvia | Open-Meteo |
| Avisos entre personas | ntfy.sh (tema aleatorio por plan, sin cuentas) |

El tráfico y el transporte público se **estiman** con patrones típicos de Madrid (no hay API gratuita de tráfico en tiempo real). Los datos se guardan solo en el dispositivo (localStorage); usa *Ajustes → Copia de seguridad* para pasarlos a otro.

## Estructura
`index.html` (toda la app) · `manifest.json` + `sw.js` (instalable y offline) · iconos.
