# 🍳 RecRec

**RecRec** es una aplicación web prototipo para la recomendación de recetas según los ingredientes que tengas disponibles. Estos ingredientes son detectados mediante una cámara web y reconocidos gracias a algoritmos de visión por computadora (YOLOv8).

---

## 🌐 Demo en vivo

🚧 *Optimizando* — despliegue próximamente.

---

## 📸 Descripción general

Esta aplicación combina **frontend**, **backend**, **machine learning** y **gestión de base de datos** en un sistema full stack completo:

- El usuario escanea ingredientes usando su **cámara web**.
- El sistema detecta los ingredientes utilizando un modelo entrenado con **YOLOv8**.
- Según los ingredientes detectados, se recomiendan recetas compatibles.
- Interfaz **totalmente responsive**, adaptable a escritorio y móviles.

---

## 🛠️ Tecnologías utilizadas

### 🔷 Frontend
- React
- Tailwind CSS

### 🔶 Backend
- Flask (Python)
- APIs REST

### 🧠 Machine Learning
- YOLOv8 (Ultralytics)
- OpenCV (para captura de cámara)

### 🗄️ Base de datos
- PostgreSQL

---

## 🚀 Funcionalidades

- 📷 **Detección de ingredientes** vía cámara
- 🧠 **Recomendación inteligente** de recetas
- 📄 Páginas de recetas con instrucciones y lista de ingredientes
- 📱 Diseño responsive

---

## 📅 Próximas actualizaciones

- Búsqueda por nombre de receta
- Crear, editar y guardar recetas personalizadas
- Mejorar la precisión del reconocimiento
- Agregar login de usuario y personalización

---

## 📂 Estructura del proyecto

RecRec/
│
├── react_front/ # Frontend en React
│ └── ...
│
├── back_flask/ # Backend en Flask
│ ├── instance/ base de datos
│ └── ...
│
├── model/ # Pesos y scripts de detección con YOLOv8
│
├── README.md
└── requirements.txt

---

## 🧪 Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/Luksruiz10/RecRec
cd RecRec

# Backend
cd server
python -m venv venv
source venv/bin/activate  # o venv\Scripts\activate en Windows
pip install -r requirements.txt

# Frontend
cd ../client
npm install
npm run dev

---

🤝 Contribuciones
¡Se aceptan ideas, sugerencias o mejoras!