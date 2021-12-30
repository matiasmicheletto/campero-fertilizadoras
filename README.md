# Campero fertilizadoras

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

#### Fixes
  - Agregar ancho de labor ajustado a reportes.  
  - Quitar ancho de labor en seccion de resultados de perfil.  
  - Usar dosis y ancho de labor -> previsto, efectivo y ajustado.  
  - En insumos, quitar "completa(s)" y "fraccion". Usar sólo cargas equilibradas.    
  - Expresar cargas en números enteros (redondear).  


#### Android
  - Instalar AndroidStudio.  
  - Compilar app con Capacitor.  
  - Guardar datos en almacenamiento persistente.  
  - Exportar contenido para compartir.  

#### Refactoring  
  - Combinar los selectores en un solo componente: PresentationSelector, MethodSelector, PatternSelector, ElapsedSelector 
  - Actualizar módulos de pruebas (api y model).
