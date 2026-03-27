-- Esquema inicial para Dashboard de Centro de Adicciones

-- 1. Definición de Roles
CREATE TYPE user_role AS ENUM ('admin', 'medico', 'psicologo', 'operativo');

-- 2. Tabla de Perfiles (Personal)
CREATE TABLE perfiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  nombre TEXT NOT NULL,
  rol user_role NOT NULL DEFAULT 'operativo',
  email TEXT UNIQUE NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabla de Camas
CREATE TABLE camas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT NOT NULL,
  habitacion TEXT NOT NULL,
  ocupada BOOLEAN DEFAULT false,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Tabla de Pacientes (Actualizada)
CREATE TABLE pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo TEXT NOT NULL,
  curp TEXT UNIQUE NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  contacto_emergencia TEXT NOT NULL,
  procedencia TEXT NOT NULL,
  
  -- Perfil de Consumo
  sustancia_principal TEXT NOT NULL,
  edad_inicio INTEGER NOT NULL,
  es_reingreso BOOLEAN DEFAULT false,
  
  -- Logística
  cama_id UUID REFERENCES camas(id),
  tipo_ingreso TEXT NOT NULL CHECK (tipo_ingreso IN ('voluntario', 'involuntario')),
  estatus TEXT NOT NULL DEFAULT 'activo' CHECK (estatus IN ('activo', 'egresado', 'baja')),
  
  fecha_ingreso TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Tabla de Notas de Evolución
CREATE TABLE notas_evolucion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE NOT NULL,
  autor_id UUID REFERENCES perfiles(id) NOT NULL,
  contenido TEXT NOT NULL,
  fecha_nota TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas_evolucion ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de Seguridad (RLS) para notas_evolucion
-- Solo psicólogos y admins pueden leer las notas de evolución
CREATE POLICY "Lectura restringida de notas de evolución"
ON notas_evolucion
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM perfiles
    WHERE perfiles.id = auth.uid()
    AND (perfiles.rol = 'admin' OR perfiles.rol = 'psicologo')
  )
);

-- Los autores pueden insertar sus propias notas
CREATE POLICY "Autores pueden insertar notas"
ON notas_evolucion
FOR INSERT
WITH CHECK (
  auth.uid() = autor_id
);
