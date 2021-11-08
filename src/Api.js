// Ecuaciones CAMPERO Fertilizadoras

const isString = value => (typeof value === 'string' || value instanceof String) && value !== "";
const isPositiveInteger = value => Number.isInteger(value) && value > 0;
const isFloat = value => Number.isFinite(value);
const isPositiveFloat = value => Number.isFinite(value) && value > 0;

const schemas = { 
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
    computeDistributionProfile: {
        tray_data: v => v.every(x => isFloat(x)),
        tray_number: v => isPositiveInteger(v),
        tray_distance: v => isPositiveFloat(v),
        work_width: v => isPositiveFloat(v),
        work_pattern: v => isString(v) && (v === "circular" || v === "linear")
    },
    computeSuppliesList: {
        products: v => v.length > 0 && v.every(x => isPositiveFloat(x.density) && isString(x.name)),            
        work_area: v => isPositiveFloat(v)
    }
};

const validate = (schema, object) => Object.keys(schema).filter(key => !schema[key](object[key])).map(key => key);

const computeDoseDirect = params => {    
    const wrong_keys = validate(schemas.computeDoseDirect, params);
    if(wrong_keys.length > 0) return {status: "error", wrong_keys};
    const { recolected, distance, work_width, expected_dose } = params;    
    const dose = recolected/distance/work_width*10000;
    const diffkg = dose-expected_dose;
    const diffp = diffkg/dose*100;
    return { status: "success", dose, diffkg, diffp };
};

const computeDoseIndirect = params => {
    console.log(params);
    const wrong_keys = validate(schemas.computeDoseIndirect, params);
    if(wrong_keys.length > 0) return {status: "error", wrong_keys};
    const { recolected, work_velocity, time, work_width, expected_dose } = params;
    const distance = work_velocity*10/36*time;    
    return computeDoseDirect({ recolected, distance, work_width, expected_dose });
};

const computeDose = params => {
    console.log(params);
    if(params.method === "direct")
        return computeDoseDirect(params);
    else if(params.method === "indirect")
        return computeDoseIndirect(params);
    else
        return {status: "error", wrong_keys: ["method"]};
}

const computeDensityFromRecolected = params => {
    console.log(params);
    const wrong_keys = validate(schemas.computeDensityFromRecolected, params);
    if(wrong_keys.length > 0) return {status: "error", wrong_keys};
    const {recolected, pass_number, tray_area} = params;
    const density = recolected/pass_number/tray_area/10;
    return {status: "success", density};
};

const computeDistributionProfile = params => {
    console.log(params);
    const wrong_keys = validate(schemas.computeDistributionProfile, params);
    if(wrong_keys.length > 0) return {status: "error", wrong_keys};    
    const {tray_data, tray_number, tray_distance, work_width, work_pattern} = params;
    const profile = [...tray_data];
    const tw = tray_distance * tray_number; 
    const get_s = r => Math.floor((tw - r * work_width) / tray_distance);
    let r = 1;
    let s = get_s(r);   
    while(s > 0) {                        
        const side = work_pattern === "circular" ? "left" : r%2===0 ? "left" : "right";
        for(let i = 0; i < s; i++){
            if(side === "left"){
                profile[i] += tray_data[tray_number - s + i];
                profile[tray_number - 1 - i] += tray_data[s - i - 1];                    
            }else{
                profile[i] += tray_data[s - i - 1];
                profile[tray_number - 1 - i] += tray_data[tray_number - s + i];
            }
        }
        r++;
        s = get_s(r);
    }
    const sum = profile.reduce((a, b) => a + b, 0);
    const avg = sum / profile.length;
    const sqdiff = profile.map(x => Math.pow(x - avg, 2));
    const dst = Math.sqrt(sqdiff.reduce((a, b) => a + b, 0) / (profile.length-1));    
    const cv = avg === 0 ? 0 : dst/avg*100;
    return {status: "success", profile, avg, dst, cv};
};

const computeSuppliesList = params => {
    console.log(params);
    const wrong_keys = validate(schemas.computeSuppliesList, params);
    if(wrong_keys.length > 0) return {status: "error", wrong_keys};
    const {products, work_area} = params;
    const quantities = [];
    for(let p in products)
        quantities.push(products[p].density*work_area);
    return {status: "success", quantities};
};

export default {
    computeDose,
    computeDensityFromRecolected,
    computeDistributionProfile,
    computeSuppliesList
};