# Campero fertilizadoras

Descargar codigo fuente y correr version live
```bash
$ git clone https://github.com/matiasmicheletto/camperofertilizadoras
$ cd camperofertilizadoras
$ npm install
$ npm start
```

Ejecutar módulo de pruebas:
```bash
$ npm run test
```

Compilar aplicación web
```bash
$ npm run build
```

Compilar apk (android)
```bash
$ npm run build && npx cap sync
$ npx cap open android
$ adb logcat chromium:I
```


### Backlog

  - Seccion control:  
    - [x] Selección de variable de muestreo.  
    - [x] Calculo de la velocidad de avance.  
    - [x] Control de dosificación.  
    - [x] Calculo de resultados de medicion.  
    - [x] Inputs control de distribución.  
    - [x] Graficar muestreo de bandejas.  
    - [ ] Detectar tipo de perfil medido (?).  
    - [ ] Sugerir correcciones sobre el perfil medido.  
    - [x] Computar perfil aplicacion en funcion del ancho de labor.  
    - [x] Agregar datos al reporte actual.  
  - Sección insumos:  
    - [x] Calcular insumos en fc. de la superficie de trabajo.  
    - [x] Agregar insumos al reporte actual.  
  - Sección reportes:  
    - [x] Implementar modelo de reportes (basado en campero siembra).  
    - [x] Agregar datos a reportes (mostrar en sidepanel).  
    - [x] Listar reportes guardados.  
    - [x] Abrir reportes.  
    - [x] Editar/borrar reportes.  
    - [x] Exportar reportes a pdf.  


#### Android
  - Instalar AndroidStudio.  
  - Compilar app con Capacitor.  
  - Guardar datos en almacenamiento persistente.  
  - Exportar contenido para compartir.  

#### Refactoring  
  - Combinar los selectores en un solo componente: PresentationSelector, MethodSelector, PatternSelector, ElapsedSelector 
  - Actualizar módulos de pruebas (api y model).
