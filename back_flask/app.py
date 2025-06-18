from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import psycopg2
from flask import Flask
from psycopg2.extras import RealDictCursor
from ultralytics import YOLO
import cv2
import numpy as np


app = Flask(__name__)
CORS(app)
conn = psycopg2.connect(dbname="recetas_db", user="postgres", password="123456")
model = YOLO("../models/best.pt")

@app.route('/recetas1', methods=['GET'])
def get_recetas():
    try:
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT id_receta, nombre, link_imagen FROM recetas")
        recetas = cursor.fetchall()
        cursor.close()
        return jsonify(recetas)  
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/images/recetas/<path:filename>')
def serve_image(filename):
    return send_from_directory('static/images/recetas', filename)

@app.route('/images/ingredientes/<path:filename>')
def serve_image_ingredientes(filename):
    return send_from_directory('static/images/ingredientes', filename)

@app.route('/ingredientes', methods=['GET'])
def get_ingredientes():
    try:
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT id_ingrediente, nombre, link_imagen FROM ingredientes")
        recetas = cursor.fetchall()
        cursor.close()
        return jsonify(recetas)  
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/recetas/<int:id>', methods=['GET'])
def get_receta_by_id(id):
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT id_receta, nombre, link_imagen, pasos, tiempo_preparacion
            FROM recetas
            WHERE id_receta = %s
        """, (id,))
        receta = cursor.fetchone()
        
        if not receta:
            return jsonify({"error": "Receta no encontrada"}), 404

        cursor.execute("""
            SELECT i.nombre
            FROM ingredientes i
            JOIN receta_ingredientes ri ON i.id_ingrediente = ri.id_ingrediente
            WHERE ri.id_receta = %s
        """, (id,))
        ingredientes = [row['nombre'] for row in cursor.fetchall()]
        
        cursor.close()
        
        receta['ingredientes'] = ingredientes
        return jsonify(receta)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/recetas_por_ingredientes', methods=['POST'])
def get_recetas_por_ingredientes():
    try:
        ingredientes = request.json.get('ingredientes', [])
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT r.id_receta, r.nombre, r.link_imagen,
            ARRAY_AGG(i.nombre) AS ingredientes_requeridos,
            COUNT(*) AS total_ingredientes,
            SUM(CASE WHEN i.nombre = ANY(%s) THEN 1 ELSE 0 END) AS ingredientes_disponibles
            FROM recetas r
            JOIN receta_ingredientes ri ON r.id_receta = ri.id_receta
            JOIN ingredientes i ON ri.id_ingrediente = i.id_ingrediente
            GROUP BY r.id_receta, r.nombre, r.link_imagen
        """, (ingredientes,))
        recetas = cursor.fetchall()
        cursor.close()
        
        for receta in recetas:
            if receta['ingredientes_disponibles'] == receta['total_ingredientes']:
                receta['estado'] = 'disponible'
            elif receta['total_ingredientes'] - receta['ingredientes_disponibles'] <= 2:
                receta['estado'] = 'casi_disponible'
            else:
                receta['estado'] = 'no_disponible'
        return jsonify(recetas)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/video_feed", methods=["POST"])
def video_feed():
    if "frame" not in request.files:
        return jsonify({"error": "No frame received"}), 400
    
    file = request.files["frame"]
    nparr = np.frombuffer(file.read(), np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = model(frame)
    detected_ingredients = []
    for result in results:
        boxes = result.boxes
        for box in boxes:
            if box.conf[0] > 0.8:
                x, y, w, h = map(int, box.xywh[0])
                x = x - w // 2
                y = y - h // 2
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                label = f"{model.names[int(box.cls[0])]}: {box.conf[0]:.2f}"
                ingredient = model.names[int(box.cls[0])]
                ingredient = ingredient.replace("_", " ")
                ingredient = {"huevos":"huevo", "patatas":"papa"}.get(ingredient, ingredient)
                capitalized_ingredient = ingredient[0].upper() + ingredient[1:].lower()
                label = f"{capitalized_ingredient}: {box.conf[0]:.2f}"
                detected_ingredients.append({
                        "name": capitalized_ingredient,
                        "confidence": float(box.conf[0])
                    })
                cv2.putText(frame, label, (x, y-10), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    
    _, buffer = cv2.imencode('.jpg', frame)
    response = jsonify({
        "image": buffer.tobytes().hex(),
        "ingredients": detected_ingredients
    })
    return response
    

if __name__ == '__main__':
    app.run(debug=True)