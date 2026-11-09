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
- Enlaces a Google Maps / Waze / Citymapper para comprobar el tráfico en vivo.

## Servicios (todos gratis y sin claves)
| Uso | Servicio |
|---|---|
| Rutas coche/andando/bici | OSRM (routing.openstreetmap.de, router.project-osrm.org) |
| Buscador de direcciones | Photon (Komoot) + Nominatim de respaldo |
| Parkings cercanos | Overpass API (OpenStreetMap) |

El tráfico y el transporte público se **estiman** con patrones típicos de Madrid (no hay API gratuita de tráfico en tiempo real). Los datos se guardan solo en el dispositivo (localStorage); usa *Ajustes → Copia de seguridad* para pasarlos a otro.

## Estructura
`index.html` (toda la app) · `manifest.json` + `sw.js` (instalable y offline) · iconos.
