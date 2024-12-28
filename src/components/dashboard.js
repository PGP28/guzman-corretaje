import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Dashboard = ({ onLogout }) => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);
  const [communes, setCommunes] = useState([]);

  // Datos de regiones, ciudades y comunas
  const data = {
    "Región de Arica y Parinacota": {
      Arica: [
        "Arica",
        "Azapa",
        "Valle de Lluta",
        "San Miguel de Azapa",
        "Las Llosyas",
        "Sobraya"
      ],
      Putre: [
        "Putre",
        "Socoroma",
        "Tignamar",
        "Belén",
        "Zapahuira",
        "Murmutane",
        "Chapiquiña",
        "Parinacota"
      ],
      "General Lagos": [
        "Visviri",
        "Chujlluta",
        "Guallatire",
        "Chiclla",
        "Villa Industrial"
      ],
      Camarones: [
        "Camarones",
        "Codpa",
        "Esquiña",
        "Guañacagua",
        "Timonel",
        "Cuya"
      ],
    },
    "Región de Tarapacá": {
      Iquique: [
        "Cavancha",
        "Playa Brava",
        "Centro",
        "El Morro",
        "Playa Huayquique",
        "Zona Franca (Zofri)",
        "Alto Molle"
      ],
      "Alto Hospicio": [
        "Santa Rosa",
        "El Boro",
        "La Pampa",
        "Sector La Negra",
        "Centro Alto Hospicio"
      ],
      PozoAlmonte: [
        "La Tirana",
        "Matilla",
        "Pozo Almonte Centro",
        "La Huayca",
        "Victoria",
        "Pintados"
      ],
      Huara: [
        "Pisagua",
        "Huara",
        "Tarapacá",
        "Chusmiza",
        "Colchane Viejo",
        "Cariquima"
      ],
      Pica: [
        "Pica",
        "Colchane",
        "Lirima",
        "Mamiña",
        "Cancosa",
        "Chacarillas"
      ],
    },

    "Región de Antofagasta": {
      Antofagasta: [
        "Norte Grande",
        "Centro",
        "Playa Blanca",
        "La Portada",
        "Coloso",
        "Bonilla",
        "Parque Inglés",
        "Sector Sur",
        "Playa El Trocadero"
      ],
      Calama: [
        "Chuquicamata",
        "Centro Calama",
        "Aguas Blancas",
        "Lasana",
        "San Pedro de Atacama",
        "Toconao",
        "Chiu Chiu",
        "Ojo de Apache"
      ],
      Tocopilla: [
        "Tocopilla Norte",
        "Barrio Industrial",
        "Playa Tocopilla",
        "Caleta Buena",
        "Barrio Sur",
        "El Poblado",
        "Chanavayita"
      ],
      Mejillones: [
        "Mejillones Centro",
        "Bahía Blanca",
        "Caleta Michilla",
        "Rinconada",
        "Sector Industrial Mejillones",
        "Angamos"
      ],
      Ollagüe: [
        "Ollagüe",
        "Estación Central",
        "Cerro Águila",
        "El Loa",
        "Ascotán",
        "Estación Ollagüe"
      ],
      Taltal: [
        "Taltal Centro",
        "Paposo",
        "Cerro Blanco",
        "La Puntilla",
        "Barrio Industrial Taltal",
        "Caleta Hueso Parado"
      ],
      SierraGorda: [
        "Sierra Gorda",
        "Baquedano",
        "Estación Sierra Gorda",
        "Minería Norte"
      ]
    },

    "Región de Atacama": {
      Copiapó: [
        "Paipote",
        "Tierra Amarilla",
        "Centro",
        "Villa Copiapó",
        "San Fernando",
        "Chamonate",
        "San Pedro",
        "Cerro Blanco",
        "Puerto Viejo"
      ],
      Caldera: [
        "Bahía Inglesa",
        "Puerto Caldera",
        "Playa Loreto",
        "Playa La Virgen",
        "El Morro",
        "Caleta Obispito",
        "Barranquilla",
        "Puerto Viejo"
      ],
      Vallenar: [
        "Totoral",
        "La Calera",
        "Alto del Carmen",
        "Huasco Bajo",
        "Huasco Alto",
        "Freirina",
        "Chañar Blanco",
        "El Tránsito"
      ],
      Chañaral: [
        "Pan de Azúcar",
        "Cobre",
        "Caleta Pan de Azúcar",
        "El Salado",
        "Inca de Oro",
        "Barquito",
        "Chañaral Centro",
        "Las Breas"
      ],
      Huasco: [
        "Huasco Bajo",
        "Huasco Alto",
        "Carrizal Bajo",
        "Caleta Los Toyos",
        "Freirina",
        "El Pino",
        "Los Olivos"
      ],
      DiegoAlmagro: [
        "El Salvador",
        "Diego de Almagro",
        "Potrerillos",
        "Inca de Oro",
        "Estación Diego de Almagro",
        "Sierra Gorda",
        "Los Colorados"
      ]
    },

    "Región de Coquimbo": {
      "La Serena": [
        "Cerro Grande",
        "La Antena",
        "El Milagro",
        "San Joaquín",
        "Avenida del Mar",
        "Las Compañías",
        "Cuatro Esquinas",
        "La Florida",
        "El Romero",
        "Pampa Baja"
      ],
      Coquimbo: [
        "Tierras Blancas",
        "Sindempart",
        "Guanaqueros",
        "Tongoy",
        "La Herradura",
        "Peñuelas",
        "Coquimbo Centro",
        "Barrio Inglés",
        "Puerto Aldea"
      ],
      Ovalle: [
        "Centro Ovalle",
        "Monte Patria",
        "Barrancas",
        "Río Hurtado",
        "Punitaqui",
        "Carachilla",
        "Huamalata",
        "Chalinga",
        "Sotaquí"
      ],
      Illapel: [
        "Illapel Centro",
        "Huanhualí",
        "Los Perales",
        "Cerrillos",
        "Las Cañas",
        "El Palqui",
        "Socavón"
      ],
      Canela: [
        "Canela Baja",
        "Canela Alta",
        "Huentelauquén Norte",
        "Huentelauquén Sur",
        "Puerto Oscuro",
        "El Totoral",
        "Los Pozos"
      ],
      LosVilos: [
        "Centro Los Vilos",
        "Pichidangui",
        "Quereo",
        "Caimanes",
        "Tilama",
        "Chigualoco",
        "Los Cóndores"
      ],
      Combarbalá: [
        "Combarbalá Centro",
        "El Huacho",
        "Cogotí",
        "San Marcos",
        "Valle Hermoso",
        "La Ligua",
        "El Soruco"
      ],
      MontePatria: [
        "Monte Patria Centro",
        "El Palqui",
        "Carén",
        "Tulahuén",
        "Río Grande",
        "Chañaral Alto",
        "Pedregal"
      ]
    },

    "Región de Valparaíso": {
      Valparaíso: [
        "Cerro Alegre",
        "Cerro Concepción",
        "Playa Ancha",
        "Cerro Barón",
        "Cerro Bellavista",
        "Cerro Florida",
        "Cerro Polanco",
        "Cerro Placeres",
        "El Almendral",
        "Curauma",
        "Laguna Verde"
      ],
      "Viña del Mar": [
        "Reñaca",
        "Achupallas",
        "Miraflores",
        "Jardín del Mar",
        "Agua Santa",
        "Chorrillos",
        "Santa Inés",
        "Recreo",
        "Centro Viña",
        "Las Salinas",
        "El Olivar"
      ],
      Quilpué: [
        "El Belloto",
        "Centro Quilpué",
        "Los Pinos",
        "Villa Olímpica",
        "Retiro",
        "Colinas de Oro",
        "Las Rosas"
      ],
      Concón: [
        "Concón Alto",
        "Bosques de Montemar",
        "La Isla",
        "Las Gaviotas",
        "Playa Amarilla",
        "Roca Oceánica",
        "Caleta Higuerillas"
      ],
      "San Antonio": [
        "Llolleo",
        "Cartagena",
        "El Tabo",
        "Algarrobo",
        "El Quisco",
        "San Antonio Centro",
        "Barrancas",
        "Bocatoma"
      ],
      "Los Andes": [
        "Centro Los Andes",
        "San Esteban",
        "Rinconada",
        "Calle Larga",
        "El Sauce",
        "El Monte"
      ],
      "San Felipe": [
        "San Felipe Centro",
        "Panquehue",
        "Putaendo",
        "Santa María",
        "Llay Llay",
        "Curimón",
        "El Almendral"
      ],
      Limache: [
        "Limache Centro",
        "Limache Viejo",
        "San Francisco de Limache",
        "Villa Limache"
      ],
      Olmué: [
        "Olmué Centro",
        "Quebrada Alvarado",
        "La Dormida",
        "Pelumpén"
      ],
      "La Ligua": [
        "La Ligua Centro",
        "Valle Hermoso",
        "Placilla",
        "Longotoma",
        "Los Molles",
        "Pichicuy"
      ],
      Petorca: [
        "Petorca Centro",
        "Chincolco",
        "Hierro Viejo",
        "Cabildo",
        "Zapallar",
        "Papudo"
      ],
    },

    "Región Metropolitana de Santiago": {
      Santiago: [
        "Providencia",
        "Ñuñoa",
        "Las Condes",
        "Vitacura",
        "Lo Barnechea",
        "Pudahuel",
        "Recoleta",
        "La Florida",
        "Macul",
        "San Joaquín",
        "La Granja",
        "El Bosque",
        "San Ramón",
        "Pedro Aguirre Cerda",
        "Lo Espejo",
        "San Miguel",
        "Independencia",
        "Cerro Navia",
        "Lo Prado",
        "Estación Central",
        "Renca"
      ],
      "Puente Alto": [
        "Santa Julia",
        "Bajos de Mena",
        "Mall Tobalaba",
        "Las Vizcachas",
        "El Peral",
        "Estación Bajos de Mena",
        "Pirque"
      ],
      "San Bernardo": [
        "Centro San Bernardo",
        "Calera de Tango",
        "La Portada",
        "Nos",
        "Lo Herrera",
        "Villa Maestranza",
        "Chena"
      ],
      Maipú: [
        "El Abrazo",
        "Ciudad Satélite",
        "Portal del Sol",
        "Villa El Rosal",
        "Villa Los Héroes",
        "Tres Poniente",
        "El Conquistador"
      ],
      Quilicura: [
        "Lo Campino",
        "Vespucio Norte",
        "Santa Luisa",
        "San Ignacio",
        "Valle Lo Campino",
        "Parque Central Quilicura"
      ],
      "La Florida": [
        "Trinidad",
        "Santa Amalia",
        "Los Quillayes",
        "Vicuña Mackenna",
        "Villa O'Higgins",
        "El Bosque"
      ],
      Peñalolén: [
        "Lo Hermida",
        "Las Torres",
        "Villa El Valle",
        "San Luis",
        "El Principal"
      ],
      "La Reina": [
        "Villa La Reina",
        "Plaza Egaña",
        "El Castillo",
        "El Peral"
      ],
      "Las Condes": [
        "Manquehue",
        "El Golf",
        "Apoquindo",
        "Los Dominicos",
        "Santa María de Manquehue"
      ],
      Vitacura: [
        "Lo Curro",
        "Santa María de Manquehue",
        "Jardín del Este",
        "Escrivá de Balaguer"
      ],
      "Lo Barnechea": [
        "La Dehesa",
        "Valle Escondido",
        "Los Trapenses",
        "El Arrayán",
        "Farellones"
      ],
      "Estación Central": [
        "Villa Portales",
        "Barrio Universitario",
        "Lo Errázuriz",
        "San Alberto Hurtado"
      ],
      Renca: [
        "Huamachuco",
        "Parque Industrial",
        "Santa Rosa de Chena",
        "Las Palmeras",
        "Lo Velásquez"
      ],
      "Cerro Navia": [
        "Barrio Industrial",
        "Villa Santa Fe",
        "Los Jardines",
        "El Espino"
      ],
      "Lo Prado": [
        "Blanqueado",
        "Villa Brasil",
        "San Pablo"
      ],
      "Pudahuel": [
        "Ciudad de Los Valles",
        "Barrancas",
        "Ciudad de Los Jardines",
        "Villa El Noviciado",
        "Aeropuerto"
      ]
    },

    "Región del Libertador General Bernardo O'Higgins": {
      Rancagua: [
        "El Teniente",
        "Machalí",
        "Villa Triana",
        "Punta del Sol",
        "Baquedano",
        "Sector Oriente",
        "Sector Centro",
        "Graneros",
        "El Olivar"
      ],
      SanFernando: [
        "San Fernando Centro",
        "Los Lingues",
        "San José de Los Lingues",
        "Angostura",
        "Roma",
        "Puente Negro",
        "Santa Inés",
        "Polonia"
      ],
      Pichilemu: [
        "Punta de Lobos",
        "Cahuil",
        "Infiernillo",
        "La Caletilla",
        "Los Navegantes",
        "Barrio Comercio",
        "Cardonal de Panilonco",
        "Paula"
      ],
      SantaCruz: [
        "Santa Cruz Centro",
        "Isla de Yáquil",
        "Apalta",
        "Paniahue",
        "La Lajuela",
        "El Guindo",
        "El Huique"
      ],
      SanVicente: [
        "San Vicente de Tagua Tagua",
        "El Tambo",
        "Zúñiga",
        "Tunca",
        "La Puntilla",
        "Puquillay"
      ],
      Chimbarongo: [
        "Chimbarongo Centro",
        "San Enrique",
        "Santa Amelia",
        "El Romeral",
        "Codegua",
        "Quinta"
      ],
      Peralillo: [
        "Peralillo Centro",
        "Población Santa Blanca",
        "Los Cardos",
        "Población Central"
      ],
      Rengo: [
        "Rengo Centro",
        "Rosario",
        "Lo de Lobos",
        "El Naranjal",
        "Esmeralda",
        "Popeta",
        "Malloa"
      ],
      Pichidegua: [
        "Pichidegua Centro",
        "La Torina",
        "Patagua Cerro",
        "Zúñiga",
        "La Islita"
      ],
      Requínoa: [
        "Requínoa Centro",
        "Los Lirios",
        "Villa María",
        "El Abra"
      ],
      Peumo: [
        "Peumo Centro",
        "Codao",
        "Las Cabras",
        "Lo de Cuevas"
      ]
    },

    "Región del Maule": {
      Talca: [
        "Centro Talca",
        "La Florida",
        "Barrio Oriente",
        "Las Américas",
        "San Clemente",
        "Pencahue",
        "Maule",
        "Santa Rosa",
        "Villa Cultural"
      ],
      Curicó: [
        "Santa Fe",
        "Sarmiento",
        "Rauquén",
        "Zapallar",
        "Los Niches",
        "Alicahue",
        "Teno",
        "Romeral"
      ],
      Linares: [
        "Yerbas Buenas",
        "San Javier",
        "Longaví",
        "Colbún",
        "Parral",
        "Retiro",
        "Villa Alegre",
        "Esperanza Central"
      ],
      Constitución: [
        "Barrio Industrial",
        "Las Cañas",
        "Piedra del Lobo",
        "Santa Olga",
        "Los Aromos",
        "Putú",
        "Carrizalillo"
      ],
      Cauquenes: [
        "Centro Cauquenes",
        "Quella",
        "Sauzal",
        "Pelluhue",
        "Chanco",
        "Santa Sofía",
        "Tres Esquinas"
      ],
      Molina: [
        "Molina Centro",
        "Lontué",
        "Río Claro",
        "Itahue",
        "Los Maquis",
        "Tres Esquinas"
      ],
      SanClemente: [
        "San Clemente Centro",
        "Vilches",
        "Paso Nevado",
        "La Obra",
        "El Colorado",
        "Armerillo"
      ],
      Parral: [
        "Parral Centro",
        "Bullileo",
        "Catillo",
        "Los Olivos",
        "Villa Rosa",
        "San Alberto"
      ],
      Colbún: [
        "Colbún Centro",
        "Panimávida",
        "Rari",
        "Los Boldos",
        "El Melado",
        "El Toqui"
      ],
      Retiro: [
        "Retiro Centro",
        "Copihue",
        "Las Camelias",
        "Santa Adela",
        "El Tablón"
      ]
    },

    "Región de Ñuble": {
      Chillán: [
        "Centro Chillán",
        "Las Termas",
        "Barrio Ultraestación",
        "Villa Los Héroes",
        "Los Volcanes",
        "Quinchamalí",
        "Chillán Viejo",
        "Las Mariposas",
        "Santa Elvira"
      ],
      Quirihue: [
        "Centro Quirihue",
        "Valle del Itata",
        "Cerro Negro",
        "Ranquil",
        "Guarilihue",
        "Santa Juana",
        "San José"
      ],
      SanCarlos: [
        "Centro San Carlos",
        "Torres del Ñuble",
        "San Gregorio",
        "Puente Ñuble",
        "Cachapoal",
        "Santa Rosa",
        "El Sauce"
      ],
      Bulnes: [
        "Bulnes Centro",
        "Tres Esquinas",
        "Santa Clara",
        "Colonia Tres Ríos",
        "El Carmen",
        "Las Vegas"
      ],
      Coelemu: [
        "Coelemu Centro",
        "Guarilihue Bajo",
        "Las Mercedes",
        "Purema",
        "Ranguelmo"
      ],
      Cobquecura: [
        "Cobquecura Centro",
        "Buchupureo",
        "Taucú",
        "Colmuyao",
        "Pullay",
        "Mure"
      ],
      Yungay: [
        "Yungay Centro",
        "Campanario",
        "San Miguel de Itata",
        "Los Laureles",
        "Huepil"
      ],
      ElCarmen: [
        "El Carmen Centro",
        "Santa Irene",
        "Los Almendros",
        "San Nicolás",
        "Monte Verde"
      ],
      Quillón: [
        "Quillón Centro",
        "Nueva Aldea",
        "Cerro Negro",
        "Liucura",
        "Coyanco"
      ],
      Ninhue: [
        "Ninhue Centro",
        "Cerro Alto",
        "San José",
        "Los Tilos",
        "San Vicente"
      ],
      Portezuelo: [
        "Portezuelo Centro",
        "El Molino",
        "La Cantera",
        "Las Cruces",
        "San Ramón"
      ],
      Ránquil: [
        "Ránquil Centro",
        "Ñipas",
        "Parralito",
        "Cruce Cachapoal",
        "Trupán"
      ]
    },

    "Región del Biobío": {
      Concepción: [
        "Talcahuano",
        "Hualpén",
        "Penco",
        "Barrio Universitario",
        "Barrio Norte",
        "Laguna Redonda",
        "Andalué",
        "Palomares",
        "San Pedro de la Paz",
        "Lomas de San Sebastián",
        "Chiguayante",
        "Hualqui",
        "Santa Juana"
      ],
      Coronel: [
        "Lota",
        "Arauco",
        "Schwager",
        "Coronel Centro",
        "Villa Mora",
        "Patagual",
        "Playa Blanca",
        "Mina El Chiflón"
      ],
      "Los Ángeles": [
        "Centro Los Ángeles",
        "Paillihue",
        "Villa Génesis",
        "Camino a María Dolores",
        "Parque Lauquén",
        "Millantú",
        "Santa Fe",
        "El Peral"
      ],
      Talcahuano: [
        "Centro Talcahuano",
        "Las Higueras",
        "Brisas del Sol",
        "El Arenal",
        "Caleta Tumbes",
        "Cerro David Fuentes",
        "Punta de Parra"
      ],
      Penco: [
        "Penco Centro",
        "Lirquén",
        "Caleta Lirquén",
        "Barrio Puerto",
        "Playa Negra",
        "Cruz del Sur"
      ],
      Lota: [
        "Lota Alto",
        "Lota Bajo",
        "Chivilingo",
        "Playa Colcura",
        "Fundición El Humo",
        "Sector La Vega"
      ],
      Arauco: [
        "Arauco Centro",
        "Carampangue",
        "Laraquete",
        "Ramadillas",
        "Tubul",
        "Mehuín",
        "Yani"
      ],
      Curanilahue: [
        "Curanilahue Centro",
        "Pataguas",
        "Sector Industrial",
        "La Colcha",
        "Escuadrón"
      ],
      Laja: [
        "Laja Centro",
        "Las Playas",
        "Pangue",
        "Villa Laja",
        "Puente Perales",
        "San Rosendo"
      ],
      Mulchén: [
        "Mulchén Centro",
        "Santa Adriana",
        "Los Sauces",
        "Coihue",
        "Collipulli",
        "Bureo"
      ],
      Nacimiento: [
        "Nacimiento Centro",
        "Villa Los Naranjos",
        "El Carmen",
        "Sector Las Viñas",
        "Santa Luisa"
      ],
      SantaBárbara: [
        "Santa Bárbara Centro",
        "Quilaco",
        "Río Biobío",
        "Villucura",
        "Los Boldos"
      ],
      Cabrero: [
        "Cabrero Centro",
        "Monte Águila",
        "Charrúa",
        "Cerro Colorado",
        "Membrillar"
      ]
    },

    "Región de La Araucanía": {
      Temuco: [
        "Padre Las Casas",
        "Labranza",
        "Cautín",
        "Santa Rosa",
        "Amanecer",
        "Santa Elena",
        "Los Pablos",
        "Villa Cautín",
        "San Antonio",
        "Nuevo Amanecer"
      ],
      Villarrica: [
        "Centro Villarrica",
        "Ñancul",
        "Conquil",
        "Lican Ray",
        "Putúe",
        "Voipir",
        "Chucauco"
      ],
      Pucón: [
        "Centro Pucón",
        "Caburgua",
        "Curarrehue",
        "Llafenco",
        "El Claro",
        "Quelhue",
        "Paillaco"
      ],
      Angol: [
        "Angol Centro",
        "Huequén",
        "El Rosario",
        "Vegas Blancas",
        "Las Acequias",
        "El Retiro"
      ],
      Collipulli: [
        "Collipulli Centro",
        "Mininco",
        "Esperanza",
        "Villa Cordillera",
        "Loncomahuida",
        "Santa Mónica"
      ],
      Lautaro: [
        "Lautaro Centro",
        "Pillanlelbún",
        "Vilcún",
        "Villa Alegre",
        "Quepe",
        "Rapa"
      ],
      NuevaImperial: [
        "Nueva Imperial Centro",
        "Carahue",
        "Trovolhue",
        "Nehuentúe",
        "Puerto Saavedra",
        "Queule"
      ],
      Victoria: [
        "Victoria Centro",
        "Selva Oscura",
        "Pailahueque",
        "Ercilla",
        "Curaco",
        "Chacaico"
      ],
      Curarrehue: [
        "Curarrehue Centro",
        "Reigolil",
        "Carén",
        "Palguín Bajo",
        "Pichares",
        "Ñancul"
      ],
      Loncoche: [
        "Loncoche Centro",
        "La Paz",
        "Molco",
        "Huitag",
        "Paya",
        "Pupunahue"
      ],
      Gorbea: [
        "Gorbea Centro",
        "Quitratúe",
        "Lastarria",
        "Pitrufquén",
        "Toltén",
        "Queule"
      ],
      Toltén: [
        "Toltén Centro",
        "Nueva Toltén",
        "Queule",
        "Caleta La Barra",
        "Los Boldos",
        "Las Trancas"
      ]
    },

    "Región de Los Ríos": {
      Valdivia: [
        "Isla Teja",
        "Niebla",
        "Las Ánimas",
        "Collico",
        "Corral",
        "Curiñanco",
        "Punucapa",
        "Los Molinos",
        "Torobayo",
        "Calle Calle",
        "Pichoy"
      ],
      LaUnión: [
        "Centro La Unión",
        "Río Bueno",
        "Puerto Nuevo",
        "Traiguén",
        "Rapaco",
        "Pilmaiquén",
        "Llancacura",
        "San Javier"
      ],
      Panguipulli: [
        "Panguipulli Centro",
        "Coñaripe",
        "Liquiñe",
        "Choshuenco",
        "Neltume",
        "Puerto Fuy",
        "Pullinque"
      ],
      Lanco: [
        "Lanco Centro",
        "Malalhue",
        "Panguinilahue",
        "Purulón",
        "Antilhue",
        "Alicura"
      ],
      Mariquina: [
        "San José de la Mariquina",
        "Mehuín",
        "Queule",
        "Tringlo",
        "Mississippi",
        "Chan Chan"
      ],
      Futrono: [
        "Futrono Centro",
        "Llifén",
        "Curriñe",
        "Nontuelá",
        "Hueinahue",
        "Puerto Las Rosas",
        "Quimán"
      ],
      LagoRanco: [
        "Lago Ranco Centro",
        "Ignao",
        "Riñinahue",
        "Calcurrupe",
        "Pitriuco",
        "Puerto Lapi"
      ],
      Máfil: [
        "Máfil Centro",
        "San Pedro de Alcántara",
        "Rucaco",
        "Las Vertientes",
        "Pidey",
        "Antilhue"
      ],
      LosLagos: [
        "Los Lagos Centro",
        "Antilhue",
        "Riñihue",
        "Tralcán",
        "Purey",
        "Quinchilca"
      ],
      Corral: [
        "Corral Centro",
        "Amargos",
        "Chaihuín",
        "San Carlos",
        "Punucapa",
        "Caleta El Piojo"
      ]
    },

    "Región de Los Lagos": {
      "Puerto Montt": [
        "Angelmó",
        "Alerce",
        "Chinquihue",
        "Pelluco",
        "Chamiza",
        "La Vara",
        "Lagunitas",
        "Población Antonio Varas",
        "Cardonal",
        "Río Chico"
      ],
      Osorno: [
        "Rahue",
        "Ovejería",
        "Francke",
        "Pilauco",
        "Las Quemas",
        "Chuyaca",
        "Pampa Alegre",
        "Río Bueno",
        "San Pablo"
      ],
      Castro: [
        "Ten Ten",
        "Nercon",
        "Gamboa",
        "Rilán",
        "Punta de Diamante",
        "Quilquico",
        "San Pedro",
        "Yutuy"
      ],
      Ancud: [
        "Ancud Centro",
        "Chacao",
        "Pupelde",
        "Lechagua",
        "Puntra",
        "Pilluco",
        "Mutrico",
        "Guapilacuy",
        "Quetalmahue"
      ],
      Quellón: [
        "Quellón Centro",
        "San Antonio",
        "Yaldad",
        "Candelaria",
        "Curanué",
        "Coinco",
        "Chiguao",
        "Huinay",
        "Puerto Carmen"
      ],
      Dalcahue: [
        "Dalcahue Centro",
        "Tenaún",
        "Quetalco",
        "San Juan",
        "Curaco de Vélez",
        "Puchaurán",
        "Astillero"
      ],
      PuertoVaras: [
        "Puerto Varas Centro",
        "Ensenada",
        "Ralún",
        "Petrohué",
        "Nueva Braunau",
        "Volcán Calbuco",
        "Llanquihue",
        "Alerce Norte"
      ],
      Frutillar: [
        "Frutillar Bajo",
        "Frutillar Alto",
        "Los Bajos",
        "Cochamó",
        "Puyehue",
        "Las Cascadas"
      ],
      Calbuco: [
        "Calbuco Centro",
        "Pargua",
        "Isla Tabón",
        "Isla Huar",
        "Isla Queullín",
        "San Rafael",
        "Chayahue",
        "Peñasmó"
      ],
      Chaitén: [
        "Chaitén Centro",
        "Santa Bárbara",
        "Futaleufú",
        "Palena",
        "Puerto Cárdenas",
        "Puerto Ramírez",
        "Ayacara",
        "Río Blanco"
      ],
      Llanquihue: [
        "Llanquihue Centro",
        "Totoral",
        "Los Pellines",
        "Colonia Río Sur",
        "Las Cruces",
        "Los Riscos",
        "Loncotoro"
      ]
    },

    "Región de Aysén del General Carlos Ibáñez del Campo": {
      Coyhaique: [
        "Centro Coyhaique",
        "El Blanco",
        "Villa Ortega",
        "Balmaceda",
        "Ñirehuao",
        "Valle Simpson",
        "Lago Frío",
        "Laguna Foitzick",
        "Campo Grande"
      ],
      PuertoAysén: [
        "Centro Puerto Aysén",
        "Isla Huichas",
        "Río Los Palos",
        "Puerto Chacabuco",
        "Villa Mañihuales",
        "Bahía Acantilada",
        "Pangal",
        "Caleta Andrade"
      ],
      ChileChico: [
        "Centro Chile Chico",
        "Los Antiguos",
        "Mallín Grande",
        "Bahía Jara",
        "Puerto Guadal",
        "Puerto Bertrand",
        "Fachinal",
        "Laguna Verde"
      ],
      Cochrane: [
        "Cochrane Centro",
        "Valle Chacabuco",
        "Lago Cochrane",
        "Caleta Tortel",
        "Paso Roballos",
        "El Salto",
        "Río Baker"
      ],
      Cisnes: [
        "Puerto Cisnes",
        "Puyuhuapi",
        "La Junta",
        "Puerto Gala",
        "Puerto Gaviota",
        "Melimoyu",
        "Río Palena"
      ],
      LagoVerde: [
        "Lago Verde Centro",
        "Villa Amengual",
        "Villa La Tapera",
        "Río Claro",
        "Villa General Marchant"
      ],
      RíoIbáñez: [
        "Puerto Río Ibáñez",
        "Bahía Murta",
        "Villa Cerro Castillo",
        "Puerto Sánchez",
        "El Engaño",
        "Puerto Cristal"
      ],
      Tortel: [
        "Caleta Tortel",
        "Río Bravo",
        "Fiordo Mitchell",
        "Isla Merino Jarpa",
        "Río Pascua"
      ]
    },

    "Región de Magallanes y de la Antártica Chilena": {
      PuntaArenas: [
        "Centro Punta Arenas",
        "Barrio Prat",
        "Zona Franca",
        "Barrio Croata",
        "Barrio Sur",
        "Villa Las Nieves",
        "Pampa Alegre",
        "Sector Río de los Ciervos",
        "Lomas del Río",
        "San Juan"
      ],
      PuertoNatales: [
        "Centro Puerto Natales",
        "Dorotea",
        "Puerto Bories",
        "Villa Cerro Castillo",
        "Sector Huertos Familiares",
        "Canal Señoret",
        "Punta Prat"
      ],
      Porvenir: [
        "Porvenir Centro",
        "Barrio Industrial",
        "Bahía Chilota",
        "Pampa Guanaco",
        "Sector La Vega",
        "Caleta María",
        "Fagnano"
      ],
      PuertoWilliams: [
        "Puerto Williams Centro",
        "Villa Ukika",
        "Puerto Toro",
        "Bahía Róbalo",
        "Caleta Eugenia",
        "Isla Navarino",
        "Dientes de Navarino"
      ],
      Timaukel: [
        "Timaukel Centro",
        "Cameron",
        "Caleta Josefina",
        "Pampa Guanaco",
        "Puerto Arturo"
      ],
      TorresdelPaine: [
        "Torres del Paine Centro",
        "Villa Cerro Guido",
        "Laguna Amarga",
        "Lago Grey",
        "Sector Serrano",
        "Pehoé",
        "Rio Serrano"
      ],
      CaboDeHornos: [
        "Cabo de Hornos",
        "Bahía Nassau",
        "Caleta Martial",
        "Puerto Toro",
        "Isla Hornos",
        "Caleta Tres Puentes"
      ],
      Antártica: [
        "Base Presidente Frei",
        "Base Arturo Prat",
        "Base Escudero",
        "Villa Las Estrellas",
        "Bahía Fildes",
        "Punta Arenosa",
        "Base O'Higgins"
      ]
    }

  };


  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setCities(Object.keys(data[region] || {}));
    setSelectedCity("");
    setCommunes([]);
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setCommunes(data[selectedRegion][city] || []);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-3">Subir Información de Propiedad</h2>
          <p className="text-center text-muted mb-4">
            Introduzca los detalles de la propiedad para su evaluación.
          </p>
          <Form className="shadow p-4 rounded">
            {/* Nombre de la propiedad */}
            <Form.Group controlId="formNombre" className="mb-3">
              <Form.Label>Nombre de la Propiedad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. Departamento en Las Condes"
                required
              />
            </Form.Group>

            {/* Ubicación */}
            <Form.Group controlId="formUbicacion" className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. Av. Cristóbal Colón 3206, Las Condes"
                required
              />
            </Form.Group>

            {/* Precio */}
            <Form.Group controlId="formPrecio" className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control type="text" placeholder="Ej. 39,50" required />
              <Form.Check
                inline
                label="CLP"
                name="priceCurrency"
                type="radio"
                id="priceCLP"
              />
              <Form.Check
                inline
                label="UF"
                name="priceCurrency"
                type="radio"
                id="priceUF"
              />
            </Form.Group>

            {/* Categoría */}
            <Form.Group controlId="formCategoria" className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select required>
                <option>Seleccione una categoría</option>
                <option>Arriendo de Departamentos</option>
                <option>Arriendo de Casas</option>
                <option>Venta de Casas</option>
                <option>Venta de Terrenos</option>
              </Form.Select>
            </Form.Group>

            {/* Región */}
            <Form.Group controlId="formRegion" className="mb-3">
              <Form.Label>Región</Form.Label>
              <Form.Select
                onChange={handleRegionChange}
                value={selectedRegion}
                required
              >
                <option>Seleccione una región</option>
                {Object.keys(data).map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Ciudad */}
            <Form.Group controlId="formCiudad" className="mb-3">
              <Form.Label>Ciudad</Form.Label>
              <Form.Select
                onChange={handleCityChange}
                value={selectedCity}
                disabled={!selectedRegion}
                required
              >
                <option>Seleccione una ciudad</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Comuna */}
            <Form.Group controlId="formComuna" className="mb-3">
              <Form.Label>Comuna</Form.Label>
              <Form.Select disabled={!selectedCity} required>
                <option>Seleccione una comuna</option>
                {communes.map((commune) => (
                  <option key={commune} value={commune}>
                    {commune}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Inputs numéricos */}
            {[
              "Dormitorios",
              "Baños",
              "Metros Cuadrados",
              "Gastos Comunes",
              "Estacionamientos",
              "Bodega",
              "Superficie útil",
              "Superficie total",
            ].map((label) => (
              <Form.Group
                controlId={`form${label}`}
                className="mb-3"
                key={label}
              >
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={`Ingrese ${label}`}
                  required
                />
              </Form.Group>
            ))}

            {/* Fecha de entrega */}
            <Form.Group controlId="formFechaEntrega" className="mb-3">
              <Form.Label>Fecha de Entrega</Form.Label>
              <Form.Control type="date" required />
            </Form.Group>

            {/* Constructora */}
            <Form.Group controlId="formConstructora" className="mb-3">
              <Form.Label>Constructora</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre de la constructora"
                required
              />
            </Form.Group>

            {/* Descripción */}
            <Form.Group controlId="formDescripcion" className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ingrese una descripción detallada"
                required
              />
            </Form.Group>

            {/* Subir Imágenes */}
            <Form.Group controlId="formImagenes" className="mb-3">
              <Form.Label>Subir Imágenes</Form.Label>
              <Form.Control
                type="file"
                multiple
                required
              />
            </Form.Group>

            {/* Botón de enviar */}
            <div className="text-center mb-3">
              <Button variant="success" type="submit" className="rounded-pill">
                Enviar
              </Button>
            </div>

            {/* Botón de cerrar sesión */}
            <div className="text-center">
              <Button
                variant="danger"
                onClick={onLogout}
                className="rounded-pill"
              >
                Cerrar Sesión
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
