# Campero fertilizadoras

Descargar codigo fuente e instalar dependencias
```bash
$ git clone https://github.com/matiasmicheletto/camperofertilizadoras
$ cd camperofertilizadoras
$ npm install
```

Correr versión web para debug
```bash
$ npm start
```

Compilar versión web optimizada
```bash
$ npm run build
```

Ejecutar módulo de pruebas
```bash
$ npm run test
```

Compilar apk (android)
```bash
$ npm run build && npx cap sync
$ npx cap open android
$ adb logcat chromium:I
```

Lo anterior puede requerir variables de entorno:
```bash
export CAPACITOR_ANDROID_STUDIO_PATH="/home/$USER/Programas/android-studio/bin/studio.sh"
export PATH=~/.npm-global/bin:$PATH  
```


Compilar release apk (android)
```bash
cd android && 
./gradlew assembleRelease && 
cd app/build/outputs/apk/release &&
jarsigner -keystore $KEYSTORE_PATH -storepass $KEYSTORE_PASS app-release-unsigned.apk $KEYSTORE_ALIAS && 
zipalign 4 app-release-unsigned.apk app-release.apk
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


#### FIX
  - Modo ayuda paso a paso:
    - Agregar atributo "top" o "bottom" en cada step para la flecha del popover.  
    - No se cargan los datos de bandejas (muestra todo en 0). 
    - Corregir formulario supplies (usar un set para cada input) porque no muestra valores correctamente.  


#### Refactoring  
  - Combinar los selectores en un solo componente: PresentationSelector, MethodSelector, PatternSelector, ElapsedSelector 
  - Actualizar módulos de pruebas (api y model).
