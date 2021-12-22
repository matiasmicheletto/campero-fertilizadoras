// Ecuaciones CAMPERO Fertilizadoras

const DEBUG = false;

const isString = value => (typeof value === 'string' || value instanceof String) && value !== "";
const isPositiveInteger = value => Number.isInteger(value) && value > 0;
const isFloat = value => Number.isFinite(value);
const isPositiveFloat = value => Number.isFinite(value) && value > 0;

const schemas = { // Esquema de validación de inputs
    computeDoseDirect:{        
        expected_dose: v => isPositiveFloat(v),
        work_width: v => isPositiveFloat(v),
        distance: v => isPositiveFloat(v),
        recolected: v => isPositiveFloat(v)
    },
    computeDoseIndirect: {
        time: v =>  isPositiveFloat(v),
        work_velocity: v => isPositiveFloat(v)
    },
    computeDensityFromRecolected: {
        tray_area: v => isPositiveFloat(v),
        recolected: v => isPositiveFloat(v),
        pass_number: v => isPositiveInteger(v)
    },
    sweepForProfile: {
        tray_distance: v => isPositiveFloat(v),
        tray_data: v => v?.length > 0 && v.every(x => isFloat(x)),
        pass_number: v => isPositiveInteger(v)
    },
    computeDistributionProfile: {
        tray_distance: v => isPositiveFloat(v),        
        tray_data: v => v?.length > 0 && v.every(x => isFloat(x)),
        work_width: v => isPositiveFloat(v),
        work_pattern: v => isString(v) && (v === "circular" || v === "linear"),
        pass_number: v => isPositiveInteger(v)
    },
    computeSuppliesList: {
        field_name: v => isString(v),
        work_area: v => isPositiveFloat(v),
        products: v => v?.length > 0 && v.every(x => isPositiveFloat(x.density) && isString(x.name) && isFloat(x.presentation))
    }
};

const validate = (schema, object) => Object.keys(schema)
    .filter(key => object ? !schema[key](object[key]) : false)
    .map(key => key);


/// Metodos exportados

const computeDoseDirect = params => { 
    // Dosis a partir de distancia    
    const wrong_keys = validate(schemas.computeDoseDirect, params);
    if(wrong_keys.length > 0) return {status: "error", wrong_keys};
    const { recolected, distance, work_width, expected_dose } = params;    
    const dose = recolected/distance/work_width*10000;
    const diffkg = dose-expected_dose;
    const diffp = diffkg/expected_dose*100;
    return { status: "success", dose, diffkg, diffp };
};

const computeDoseIndirect = params => { 
    // Dosis a partir de tiempo y velocidad de avance
    if(DEBUG) console.log(params);
    const wrong_keys = validate(schemas.computeDoseIndirect, params);
    if(wrong_keys.length > 0) return {status: "error", wrong_keys};
    const { recolected, work_velocity, time, work_width, expected_dose } = params;
    const distance = work_velocity*time*10/36;
    return computeDoseDirect({ recolected, distance, work_width, expected_dose });
};

const computeDose = params => { 
    // Selector de metodo
    if(DEBUG) console.log(params);
    if(params.method === "direct")
        return computeDoseDirect(params);
    else if(params.method === "indirect")
        return computeDoseIndirect(params);
    else
        return {status: "error", wrong_keys: ["method"]};
};

const computeDensityFromRecolected = params => { 
    // Densidad a partir de lo recolectado en bandeja
    if(DEBUG) console.log(params);
    const wrong_keys = validate(schemas.computeDensityFromRecolected, params);
    if(wrong_keys.length > 0) return {status: "error", wrong_keys};
    const {recolected, pass_number, tray_area} = params;
    const density = recolected/pass_number/tray_area*10;
    return {status: "success", density};
};

const sweepForProfile = (params, optionals) => { 
    // Barrido para obtener perfil de distribución variando ancho de labor y patron
    if(DEBUG) console.log(params);
    
    const wrong_keys = validate(schemas.sweepForProfile, params);
    if(wrong_keys.length > 0) return {status: "error", wrong_keys};
    const {tray_data, tray_distance} = params;    
    
    // El barrido de ancho de labor, se realiza sobre el sgte rango
    const ww_min = tray_distance;
    const ww_max = tray_data.length*tray_distance;
    const ww_step = tray_distance;

    // El resultado se retorna discriminando para cada patron de trabajo
    const res = {linear: [],circular: []}; 
    // Realizar barrido variando el ancho de labor
    for(let work_width = ww_min; work_width <= ww_max; work_width += ww_step) {
        // Si se pasaron los argumentos opcionales, calcular como cambia la dosis en función del ancho de labor
        const dose_res = computeDose({...optionals, work_width});
        const fitted_dose = dose_res.status === "success" ? dose_res.dose : null;
        res.linear.push({
            ...computeDistributionProfile({...params, work_width, work_pattern: "linear"}), 
            work_width,
            fitted_dose,
        });
        res.circular.push({
            ...computeDistributionProfile({...params, work_width, work_pattern: "circular"}), 
            work_width,
            fitted_dose,
        });
    }

    return {
        ...res, // linear, circular
        status: "success", 
        ww_range: { // Rango de trabajo
            min:ww_min, 
            max:ww_max, 
            steps:ww_step
        }
    };
};

const computeDistributionProfile = params => {
    //if(DEBUG) console.log(params);
    //const wrong_keys = validate(schemas.computeDistributionProfile, params);
    //if(wrong_keys.length > 0) return {status: "error", wrong_keys};    
    const {tray_data, tray_distance, pass_number, work_width, work_pattern} = params;
    const tray_number = tray_data.length;
    //const profile = [...tray_data];
    const profile = tray_data.map(x => x/pass_number); // Perfil resultante
    const tw = tray_distance * tray_number; // Ancho maximo (hasta donde llegan las bandejas)

    // Solapamiento
    let r = 1; // Numero de pasada hacia los laterales
    const get_s = r => Math.floor((tw - r * work_width) / tray_distance);
    let s = get_s(r);   
    while(s > 0) { // Mientras haya solapamiento                       
        // Si es patron circular, siempre se solapa en el mismo sentido
        // si el patron es ida y vuelta, se suma una vez de cada lado
        const side = work_pattern === "circular" ? "left" : r%2===0 ? "left" : "right";
        if(side === "left"){
            for(let i = 0; i < s; i++) {
                profile[i] += tray_data[tray_number - s + i]/pass_number;
                profile[tray_number - 1 - i] += tray_data[s - i - 1]/pass_number;                    
            }
        }else{
            for(let i = 0; i < s; i++) {
                profile[i] += tray_data[s - i - 1]/pass_number;
                profile[tray_number - 1 - i] += tray_data[tray_number - s + i]/pass_number;
            } 
        }       
        r++; // Siguiente pasada
        s = get_s(r); // Solapamiento en la siguiente pasada
    }
    // Calcular promedio y desvios
    const sum = profile.reduce((a, b) => a + b, 0);
    const avg = sum / profile.length;
    const sqdiff = profile.map(x => Math.pow(x - avg, 2));
    const dst = Math.sqrt(sqdiff.reduce((a, b) => a + b, 0) / (profile.length-1));    
    const cv = avg === 0 ? 0 : dst/avg*100;
    //return {status: "success", profile, avg, dst, cv};
    return {profile, avg, dst, cv};
};

const computeSuppliesList = params => {
    // Lista de insumos a partir de densidad y superficie
    if(DEBUG) console.log(params);
    const wrong_keys = validate(schemas.computeSuppliesList, params);
    if(wrong_keys.length > 0) return {status: "error", wrong_keys};
    
    const {products, work_area, capacity} = params;

    const quantities = [];
    for(let p in products)
        if(products[p].presentation === 0)
            quantities.push(products[p].density*work_area);
        else
            quantities.push(products[p].density*work_area/products[p].presentation);
    
    // Calculo de cargas
    // Peso total de productos
    const total_weight = quantities.reduce((a, b) => a + b, 0); 
    // Numero total de cargas (en decimal)
    const load_number = capacity ? total_weight/capacity : 0; 
    // Numero de cargas completas
    const complete_loads = Math.floor(load_number); 
    // Parte decimal de la carga
    const fraction_weight = capacity ? (load_number - complete_loads)*capacity : 0; 
    // Peso de cargas equilibradas
    const eq_load_weight = total_weight/Math.ceil(load_number);
    // Resumen a retornar
    const loads_data = capacity ? {load_number, complete_loads, fraction_weight, eq_load_weight} : null;

    return {status: "success", quantities, loads_data};
};

const exported = {
    computeDose,
    computeDensityFromRecolected,
    computeDistributionProfile,
    sweepForProfile,
    computeSuppliesList
};

export default exported;