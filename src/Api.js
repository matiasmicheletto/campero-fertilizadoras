// Ecuaciones CAMPERO Fertilizadoras

const isString = value => (typeof value === 'string' || value instanceof String) && value !== "";
const isPositiveInteger = value => Number.isInteger(value) && value > 0;
const isFloat = value => Number.isFinite(value);
const isPositiveFloat = value => Number.isFinite(value) && value > 0;

const DEBUG = false;

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
    sweepForProfile: {
        tray_distance: v => isPositiveFloat(v),
        tray_data: v => v?.length > 0 && v.every(x => isFloat(x))
    },
    computeDistributionProfile: {
        tray_distance: v => isPositiveFloat(v),        
        tray_data: v => v?.length > 0 && v.every(x => isFloat(x)),
        work_width: v => isPositiveFloat(v),
        work_pattern: v => isString(v) && (v === "circular" || v === "linear")
    },
    computeSuppliesList: {
        field_name: v => isString(v),
        work_area: v => isPositiveFloat(v),
        products: v => v?.length > 0 && v.every(x => isPositiveFloat(x.density) && isString(x.name) && isFloat(x.presentation))
    }
};

const validate = (schema, object) => Object.keys(schema).filter(key => !schema[key](object[key])).map(key => key);

const computeDoseDirect = params => {    
    const wrong_keys = validate(schemas.computeDoseDirect, params);
    if(wrong_keys.length > 0) return {status: "error", wrong_keys};
    const { recolected, distance, work_width, expected_dose } = params;    
    const dose = recolected/distance/work_width*10000;
    const diffkg = dose-expected_dose;
    const diffp = diffkg/expected_dose*100;
    return { status: "success", dose, diffkg, diffp };
};

const computeDoseIndirect = params => {
    if(DEBUG) console.log(params);
    const wrong_keys = validate(schemas.computeDoseIndirect, params);
    if(wrong_keys.length > 0) return {status: "error", wrong_keys};
    const { recolected, work_velocity, time, work_width, expected_dose } = params;
    const distance = work_velocity*10/36*time;    
    return computeDoseDirect({ recolected, distance, work_width, expected_dose });
};

const computeDose = params => {
    if(DEBUG) console.log(params);
    if(params.method === "direct")
        return computeDoseDirect(params);
    else if(params.method === "indirect")
        return computeDoseIndirect(params);
    else
        return {status: "error", wrong_keys: ["method"]};
}

const computeDensityFromRecolected = params => {
    if(DEBUG) console.log(params);
    const wrong_keys = validate(schemas.computeDensityFromRecolected, params);
    if(wrong_keys.length > 0) return {status: "error", wrong_keys};
    const {recolected, pass_number, tray_area} = params;
    const density = recolected/pass_number/tray_area/10;
    return {status: "success", density};
};

const sweepForProfile = params => {
    if(DEBUG) console.log(params);
    const wrong_keys = validate(schemas.sweepForProfile, params);
    if(wrong_keys.length > 0) return {status: "error", wrong_keys};
    const {tray_data, tray_distance} = params;    
    const res = {
        linear: [],
        circular: []
    };
    const ww_min = 1;
    const ww_max = tray_data.length*tray_distance;
    const ww_step = tray_distance;
    for(let work_width = ww_min; work_width < ww_max; work_width+=ww_step) {
        const linear_res = computeDistributionProfile({
            tray_data,
            tray_distance,
            work_width,
            work_pattern: "linear"
        });
        res.linear.push({
            work_width,
            profile: linear_res.profile,
            avg: linear_res.avg,
            cv: linear_res.cv,
            dst: linear_res.dst
        });
        const circular_res = computeDistributionProfile({
            tray_data,
            tray_distance,
            work_width,
            work_pattern: "circular"
        });
        res.circular.push({
            work_width,
            profile: circular_res.profile,
            avg: circular_res.avg,
            cv: circular_res.cv,
            dst: circular_res.dst
        });
    }
    return {
        status: "success", 
        linear: res.linear,
        circular: res.circular,
        ww_range: {
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
    const {tray_data, tray_distance, work_width, work_pattern} = params;
    const tray_number = tray_data.length;
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
    //return {status: "success", profile, avg, dst, cv};
    return {profile, avg, dst, cv};
};

const computeSuppliesList = params => {
    if(DEBUG) console.log(params);
    const wrong_keys = validate(schemas.computeSuppliesList, params);
    if(wrong_keys.length > 0) return {status: "error", wrong_keys};
    const {products, work_area} = params;
    const quantities = [];
    for(let p in products)
        if(products[p].presentation === 0)
            quantities.push(products[p].density*work_area);
        else
            quantities.push(products[p].density*work_area/products[p].presentation); 
    return {status: "success", quantities};
};

const exported = {
    computeDose,
    computeDensityFromRecolected,
    computeDistributionProfile,
    sweepForProfile,
    computeSuppliesList
};

export default exported;