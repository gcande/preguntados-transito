-- Script SQL para crear la tabla de preguntas en Supabase
-- Ve a tu proyecto en Supabase Dashboard > SQL Editor y ejecuta este script

-- Crear la tabla de preguntas
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar acceso público a las preguntas (sin autenticación)
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir lectura pública
CREATE POLICY "Allow public read access to questions" 
ON questions FOR SELECT 
USING (true);

-- Politicas para CRUD desde la app (usuarios autenticados)
-- Nota: si luego quieres seguridad por rol admin real, reemplaza estas politicas
-- por validaciones sobre claims/roles en auth.jwt().
CREATE POLICY "Allow authenticated insert questions"
ON questions FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update questions"
ON questions FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete questions"
ON questions FOR DELETE
TO authenticated
USING (true);

-- ===========================
-- Modulo de Usuarios (CRUD)
-- ===========================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cedula TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'jugador' CHECK (role IN ('admin', 'jugador')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE app_users ADD COLUMN IF NOT EXISTS cedula TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS app_users_cedula_key ON app_users (cedula);

CREATE OR REPLACE FUNCTION set_app_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_app_users_updated_at ON app_users;
CREATE TRIGGER trg_set_app_users_updated_at
BEFORE UPDATE ON app_users
FOR EACH ROW
EXECUTE FUNCTION set_app_users_updated_at();

ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read app_users"
ON app_users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated insert app_users"
ON app_users FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update app_users"
ON app_users FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete app_users"
ON app_users FOR DELETE
TO authenticated
USING (true);

-- Insertar las 60 preguntas
INSERT INTO questions (category, question, options, correct_answer) VALUES
-- Señales de Tránsito
('Señales de Tránsito', '¿Qué indica una señal de tránsito de color rojo y forma circular?', '["Una advertencia", "Una información", "Una orden o prohibición", "Un servicio"]', 'Una orden o prohibición'),
('Señales de Tránsito', '¿Cuál es el propósito de las señales preventivas (amarillas)?', '["Prohibir una acción", "Advertir sobre un peligro o condición de la vía", "Indicar distancias", "Dar órdenes"]', 'Advertir sobre un peligro o condición de la vía'),
('Señales de Tránsito', 'La señal de ''PARE'' tiene forma:', '["Circular", "Triangular", "Octagonal", "Cuadrada"]', 'Octagonal'),
('Señales de Tránsito', '¿Qué significan las señales de color azul?', '["Restricción", "Prevención", "Información de servicios y destinos", "Obras en la vía"]', 'Información de servicios y destinos'),
('Señales de Tránsito', '¿Qué indica la señal de ''Ceda el Paso''?', '["Detenerse totalmente", "Disminuir la velocidad y dar prelación a otros vehículos", "Aumentar la velocidad", "No entrar a la vía"]', 'Disminuir la velocidad y dar prelación a otros vehículos'),
('Señales de Tránsito', 'La doble línea黄色 continua en el centro de la vía significa:', '["Se puede adelantar", "Prohibido adelantar en ambos sentidos", "Se permite el parqueo", "Solo vehículos pesados"]', 'Prohibido adelantar en ambos sentidos'),
('Señales de Tránsito', '¿Qué color tienen las señales de tránsito transitorias (obras)?', '["Amarillo", "Azul", "Naranja", "Verde"]', 'Naranja'),
('Señales de Tránsito', 'Una flecha blanca sobre fondo azul indica:', '["Sentido obligatorio de circulación", "Vía cerrada", "Peligro", "Giro prohibido"]', 'Sentido obligatorio de circulación'),
('Señales de Tránsito', 'Las líneas blancas transversales antes de una intersección indican:', '["Zona de parqueo", "Línea de detención frente a un semáforo o señal de pare", "Carril de bicicletas", "Peatones cruzando"]', 'Línea de detención frente a un semáforo o señal de pare'),
('Señales de Tránsito', '¿Qué indica una señal triangular con borde rojo y fondo blanco?', '["Información", "Prevención", "Reglamentación", "Prioridad"]', 'Prioridad'),
('Señales de Tránsito', 'La señal que prohíbe el giro a la izquierda es de tipo:', '["Preventiva", "Informativa", "Reglamentaria", "Transitoria"]', 'Reglamentaria'),
('Señales de Tránsito', '¿Qué significa una línea blanca discontinua en la vía?', '["Prohibido adelantar", "Se permite adelantar con precaución", "Solo para transporte público", "Vía en mal estado"]', 'Se permite adelantar con precaución'),
('Señales de Tránsito', 'La señal ''SR-30'' con el número 60 indica:', '["Velocidad mínima 60 km/h", "Velocidad máxima permitida 60 km/h", "Distancia a la próxima ciudad", "Peso máximo permitido"]', 'Velocidad máxima permitida 60 km/h'),
('Señales de Tránsito', '¿Qué indica la señal de una cruz de San Andrés?', '["Cruce de peatones", "Cruce a nivel con vía férrea", "Hospital cerca", "Iglesia cerca"]', 'Cruce a nivel con vía férrea'),
('Señales de Tránsito', 'Las señales turísticas en Colombia suelen ser de color:', '["Verde", "Marrón/Café", "Azul", "Amarillo"]', 'Marrón/Café'),

-- Normas de Tránsito
('Normas de Tránsito', 'En una intersección sin señalización, ¿quién tiene la prelación?', '["El vehículo que va más rápido", "El vehículo que se encuentra a la derecha", "El vehículo más grande", "El que va por la vía más ancha"]', 'El vehículo que se encuentra a la derecha'),
('Normas de Tránsito', '¿Cuál es la velocidad máxima permitida en zonas escolares en Colombia?', '["20 km/h", "30 km/h", "40 km/h", "50 km/h"]', '30 km/h'),
('Normas de Tránsito', '¿Con cuánta anticipación se debe activar la luz de giro (direccional)?', '["Justo al girar", "Mínimo 30 metros antes en zona urbana", "10 metros antes", "5 metros antes"]', 'Mínimo 30 metros antes en zona urbana'),
('Normas de Tránsito', 'En carretera, ¿por qué carril se debe transitar normalmente?', '["Por el carril izquierdo", "Por el carril derecho", "Por el centro", "Por el que esté más vacío"]', 'Por el carril derecho'),
('Normas de Tránsito', '¿Qué debe hacer un conductor al ver una ambulancia con sirena encendida?', '["Aumentar la velocidad", "Seguir normal", "Ceder el paso orillándose a la derecha", "Frenar en seco"]', 'Ceder el paso orillándose a la derecha'),
('Normas de Tránsito', '¿A qué distancia mínima se debe estacionar de una hidrante?', '["1 metro", "5 metros", "10 metros", "3 metros"]', '5 metros'),
('Normas de Tránsito', '¿Está permitido el adelantamiento en curvas?', '["Sí, si no viene nadie", "No, está prohibido", "Solo para motos", "Solo de día"]', 'No, está prohibido'),
('Normas de Tránsito', '¿Cuál es el nivel máximo de alcohol permitido para conductores principiantes?', '["0.2 mg/l", "0.5 mg/l", "0.0 mg/l (Tolerancia Cero)", "1.0 mg/l"]', '0.0 mg/l (Tolerancia Cero)'),
('Normas de Tránsito', '¿Quién tiene la prelación en una glorieta?', '["El que va a entrar", "El que circula dentro de ella", "El vehículo más pesado", "El que va por la derecha"]', 'El que circula dentro de ella'),
('Normas de Tránsito', '¿Cuál es el uso correcto de las luces altas en carretera?', '["Siempre encendidas", "Solo cuando no hay vehículos en sentido contrario", "Solo en túneles", "Nunca se deben usar"]', 'Solo cuando no hay vehículos en sentido contrario'),
('Normas de Tránsito', '¿Qué distancia de seguridad se debe mantener con el vehículo de adelante a 60 km/h?', '["5 metros", "10 metros", "25 metros", "50 metros"]', '25 metros'),
('Normas de Tránsito', '¿Los peatones tienen prelación sobre los vehículos?', '["Solo en los puentes", "Sí, siempre que estén en zonas demarcadas o intersecciones", "No, nunca", "Solo si es un adulto mayor"]', 'Sí, siempre que estén en zonas demarcadas o intersecciones'),
('Normas de Tránsito', '¿Se puede transitar en reversa en una vía pública?', '["Sí, en cualquier caso", "No, excepto para parquear o en emergencias cortas", "Sí, si es una calle sola", "No, está prohibido totalmente"]', 'No, excepto para parquear o en emergencias cortas'),
('Normas de Tránsito', '¿Qué indica la luz黄色 del semáforo?', '["Acelerar para pasar", "Detenerse, advierte el cambio a rojo", "Seguir con precaución", "Girar a la derecha"]', 'Detenerse, advierte el cambio a rojo'),
('Normas de Tránsito', '¿Es obligatorio el uso del cinturón de seguridad?', '["Solo en los puestos delanteros", "Solo en carretera", "En todos los puestos del vehículo que lo posean", "Es opcional"]', 'En todos los puestos del vehículo que lo posean'),

-- Infracciones y Sanciones
('Infracciones y Sanciones', '¿Cuál es la sanción por conducir en estado de embriaguez grado 1 por primera vez?', '["Multa y suspensión de licencia por 3 años", "Solo una advertencia", "Cárcel inmediata", "No pasa nada"]', 'Multa y suspensión de licencia por 3 años'),
('Infracciones y Sanciones', 'Pasarse un semáforo en rojo es una infracción de tipo:', '["D (30 SMLDV)", "C (15 SMLDV)", "A (4 SMLDV)", "B (8 SMLDV)"]', 'D (30 SMLDV)'),
('Infracciones y Sanciones', '¿Qué sucede si no se tiene el SOAT vigente?', '["Solo una multa", "Multa e inmovilización del vehículo", "Llamado de atención", "Nada, si no hay accidente"]', 'Multa e inmovilización del vehículo'),
('Infracciones y Sanciones', '¿Cuántos días hábiles tiene un ciudadano para impugnar un comparendo?', '["2 días", "5 días", "11 días", "30 días"]', '11 días'),
('Infracciones y Sanciones', 'Conducir un vehículo sin haber obtenido la licencia de conducción genera:', '["Multa e inmovilización", "Solo multa", "Curso pedagógico", "Suspensión del vehículo"]', 'Multa e inmovilización'),
('Infracciones y Sanciones', 'No realizar la revisión técnico-mecánica en el plazo legal conlleva a:', '["Multa de 5 SMLDV", "Inmovilización del vehículo y multa de 15 SMLDV", "Advertencia verbal", "Puntos en la licencia"]', 'Inmovilización del vehículo y multa de 15 SMLDV'),
('Infracciones y Sanciones', '¿Qué porcentaje de descuento se obtiene si se paga el comparendo en los primeros 5 días hábiles y se hace el curso?', '["25%", "50%", "75%", "10%"]', '50%'),
('Infracciones y Sanciones', 'La licencia de conducción se puede cancelar definitivamente si:', '["Se pierde una vez el examen", "Se reincide en estado de embriaguez", "No se usa el cinturón", "Se parquea mal"]', 'Se reincide en estado de embriaguez'),
('Infracciones y Sanciones', 'Conducir en sentido contrario al estipulado para la vía es una infracción de grado:', '["A", "B", "C", "D"]', 'D'),
('Infracciones y Sanciones', '¿Qué documento NO es necesario portar físicamente según las últimas normativas?', '["La cédula", "Licencia de conducción y SOAT", "El recibo del agua", "Ninguno, todos son físicos"]', 'Licencia de conducción y SOAT'),
('Infracciones y Sanciones', 'Llevar un niño menor de 10 años en el asiento delantero genera:', '["Advertencia", "Multa", "Inmovilización", "Pérdida de la patria potestad"]', 'Multa'),
('Infracciones y Sanciones', 'El uso de dispositivos móviles mientras se conduce sin manos libres genera una multa de:', '["5 SMLDV", "15 SMLDV", "30 SMLDV", "4 SMLDV"]', '15 SMLDV'),
('Infracciones y Sanciones', 'La inmovilización de un vehículo significa:', '["Traslado a los patios", "Bloqueo de las ruedas con cepo", "Quitarle las llaves", "Prohibirle la venta"]', 'Traslado a los patios'),
('Infracciones y Sanciones', 'Si un conductor se niega a realizar la prueba de alcoholemia, la consecuencia es:', '["Se le deja ir", "Multa máxima, suspensión de licencia por 10 años e inmovilización", "Solo una advertencia escrita", "Se le lleva a la casa"]', 'Multa máxima, suspensión de licencia por 10 años e inmovilización'),
('Infracciones y Sanciones', '¿Cuál es la vigencia de la licencia de conducción para servicio particular (personas menores de 60 años)?', '["2 años", "5 años", "10 años", "De por vida"]', '10 años'),

-- Mecánica y Seguridad
('Mecánica y Seguridad', '¿Qué elemento NO hace parte del equipo de carretera obligatorio?', '["Extintor", "Botiquín", "Gato hidráulico", "Equipo de sonido profesional"]', 'Equipo de sonido profesional'),
('Mecánica y Seguridad', '¿Cuál es la función del líquido de frenos?', '["Enfriar el motor", "Transmitir la presión del pedal a las ruedas", "Limpiar los discos", "Lubricar la caja"]', 'Transmitir la presión del pedal a las ruedas'),
('Mecánica y Seguridad', '¿Cuándo se debe revisar la presión de las llantas?', '["Cada año", "Cuando estén calientes", "Cuando estén frías", "Solo si se ven desinfladas"]', 'Cuando estén frías'),
('Mecánica y Seguridad', '¿Qué indica el testigo de color rojo en el tablero con forma de aceitera?', '["Falta de combustible", "Baja presión de aceite del motor", "Puerta abierta", "Luz alta encendida"]', 'Baja presión de aceite del motor'),
('Mecánica y Seguridad', 'El sistema ABS tiene como función:', '["Aumentar la velocidad", "Evitar que las ruedas se bloqueen en un frenado de emergencia", "Suavizar la suspensión", "Girar mejor en curvas"]', 'Evitar que las ruedas se bloqueen en un frenado de emergencia'),
('Mecánica y Seguridad', '¿Cuál es la profundidad mínima permitida para el labrado de las llantas?', '["0.5 mm", "1.6 mm", "5.0 mm", "3.0 mm"]', '1.6 mm'),
('Mecánica y Seguridad', '¿Qué se debe hacer si el motor se recalienta?', '["Echarle agua fría inmediatamente", "Apagar el motor y esperar a que enfríe antes de revisar", "Seguir conduciendo rápido para que le dé aire", "Quitar la tapa del radiador de una vez"]', 'Apagar el motor y esperar a que enfríe antes de revisar'),
('Mecánica y Seguridad', 'El ''Airbag'' es un elemento de seguridad:', '["Activa", "Pasiva", "Preventiva", "Mecánica"]', 'Pasiva'),
('Mecánica y Seguridad', '¿Cada cuánto se recomienda cambiar el aceite del motor (promedio)?', '["Cada 20.000 km", "Cada 5.000 a 10.000 km según el fabricante", "Cada 2 años", "Nunca, solo se rellena"]', 'Cada 5.000 a 10.000 km según el fabricante'),
('Mecánica y Seguridad', '¿Qué significa el color ámbar/naranja en los testigos del tablero?', '["Peligro inminente, detenerse", "Precaución o mal funcionamiento que requiere revisión pronto", "Información general (luces)", "Todo está perfecto"]', 'Precaución o mal funcionamiento que requiere revisión pronto'),
('Mecánica y Seguridad', 'La batería del vehículo sirve para:', '["Darle fuerza a las llantas", "Proporcionar energía para el arranque y sistemas eléctricos", "Enfriar el radiador", "Limpiar el parabrisas"]', 'Proporcionar energía para el arranque y sistemas eléctricos'),
('Mecánica y Seguridad', '¿Cuál es la función del radiador?', '["Calentar el interior", "Disipar el calor del líquido refrigerante", "Guardar el aceite", "Filtrar el aire"]', 'Disipar el calor del líquido refrigerante'),
('Mecánica y Seguridad', 'Para qué sirven los espejos retrovisores:', '["Para verse la cara", "Para ampliar el campo visual hacia los lados y atrás", "Para evitar el sol", "Son decorativos"]', 'Para ampliar el campo visual hacia los lados y atrás'),
('Mecánica y Seguridad', '¿Qué es el hidroplaneo (aquaplaning)?', '["Un deporte náutico", "Pérdida de contacto de las llantas con el suelo por una capa de agua", "Lavar el carro con agua a presión", "Conducir bajo la lluvia"]', 'Pérdida de contacto de las llantas con el suelo por una capa de agua'),
('Mecánica y Seguridad', '¿Qué debe revisarse antes de iniciar un viaje largo?', '["Solo el radio", "Niveles de líquidos, llantas, luces y frenos", "Que el carro esté limpio", "Nada, si prende está bien"]', 'Niveles de líquidos, llantas, luces y frenos');
