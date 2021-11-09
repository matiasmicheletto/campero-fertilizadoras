import api from './Api';

describe('Validación de formulario de dosificación', () => {    
    
    test('Formulario vacio', ()=>{
        const params = {};
        const res = api.computeDose(params);
        expect(res).toMatchObject({status:"error", wrong_keys:['method']});
    });

    test('Método de medición de distancia no indicado', ()=>{
        const params = { expected_dose: 50 };
        const res = api.computeDose(params);
        expect(res).toMatchObject({status:"error", wrong_keys:['method']});
    });

    test('Ancho de labor no especificado', ()=>{
        const params = { 
            method: "direct",
            expected_dose: 50 
        };
        const res = api.computeDose(params);
        expect(res).toMatchObject({status:"error", wrong_keys:['work_width', 'distance', 'recolected']});
    });

    test('Distancia no indicada', ()=>{
        const params = { 
            method: "direct",
            expected_dose: 50,
            work_width: 20
        };
        const res = api.computeDose(params);
        expect(res).toMatchObject({status:"error", wrong_keys:['distance', 'recolected']});
    });

    test('Tiempo no indicado', ()=>{
        const params = {
            method: "indirect",
            expected_dose: 50,
            work_width: 20,
            work_velocity: 20
        };
        const res = api.computeDose(params);
        expect(res).toMatchObject({status:"error", wrong_keys:['time']});
    });

    test('Velocidad de trabajo no indicada', ()=>{
        const params = {
            method: "indirect",
            expected_dose: 50,
            work_width: 20,
            time: 10
        };
        const res = api.computeDose(params);
        expect(res).toMatchObject({status:"error", wrong_keys:['work_velocity']});
    });

    test('Peso recolectado no ingresado', ()=>{
        const params = {
            method: "indirect",
            expected_dose: 50,
            work_width: 20,
            time: 10,
            work_velocity: 15
        };
        const res = api.computeDose(params);
        expect(res).toMatchObject({status:"error", wrong_keys:['recolected']});
    });

    test('Formulario correcto (directo)', ()=>{
        const params = {
            method: "direct",
            expected_dose: 50,
            work_width: 20,
            recolected: 12,
            distance: 50
        };
        const res = api.computeDose(params);
        expect(res).toMatchObject({status:"success"});
    });

    test('Formulario correcto (indirecto)', ()=>{
        const params = {
            method: "indirect",
            expected_dose: 50,
            work_width: 20,
            recolected: 12,
            work_velocity: 15,
            time: 10
        };
        const res = api.computeDose(params);
        expect(res).toMatchObject({status:"success"});
    });
});

describe('Validación de formulario de perfil', ()=>{
    
    test('Formulario vacio', ()=>{
        const params = {};
        const res = api.computeDistributionProfile(params);
        expect(res).toMatchObject({status:"error", wrong_keys:['tray_distance', 'tray_number', 'tray_data', 'tray_area', 'pass_number', 'work_width', 'work_pattern']});
    });

    test('Distancia entre bandejas no especificada', ()=>{
        const params = {
            tray_area: 0.4
        };
        const res = api.computeDistributionProfile(params);
        expect(res).toMatchObject({status:"error", wrong_keys:['tray_distance', 'tray_number', 'tray_data', 'pass_number', 'work_width', 'work_pattern']});
    });

    test('Cantidad de bandejas no especificada', ()=>{
        const params = {
            tray_area: 0.4,
            tray_distance: 1
        };        
        const res = api.computeDistributionProfile(params);
        expect(res).toMatchObject({status:"error", wrong_keys:['tray_number', 'tray_data', 'pass_number', 'work_width', 'work_pattern']});
    });

    test('Cantidad de pasadas no especificada', ()=>{        
        const params = {
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 12
        };
        const res = api.computeDistributionProfile(params);
        expect(res).toMatchObject({status:"error", wrong_keys:['tray_data', 'pass_number', 'work_width', 'work_pattern']});
    });

    test('Ancho de labor no indicado', ()=>{        
        const params = {
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 12,
            pass_number: 2
        };
        const res = api.computeDistributionProfile(params);
        expect(res).toMatchObject({status:"error", wrong_keys:['tray_data', 'work_width', 'work_pattern']});
    });

    test('Patrón de trabajo incorrecto', ()=>{                
        const params = {
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 12,
            pass_number: 2,
            work_width: 18,
            work_pattern: ""
        };
        const res = api.computeDistributionProfile(params);
        expect(res).toMatchObject({status:"error", wrong_keys:['tray_data', 'work_pattern']});
    });

    test('Error en valores de peso recolectado', ()=>{               
        const params = {
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 12,
            pass_number: 2,
            work_width: 18,
            work_pattern: "linear"
        };
        const res = api.computeDistributionProfile(params);
        expect(res).toMatchObject({status:"error", wrong_keys:['tray_data']});
    });

    test('Formulario correcto', ()=>{                
        const params = {
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 12,
            pass_number: 2,
            work_width: 18,
            work_pattern: "linear",
            tray_data: [1,2,3,5,5,6,5,4,3,3,2,1]
        };
        const res = api.computeDistributionProfile(params);
        expect(res).toMatchObject({status:"success"});
    });
});

describe('Validación formulario insumos', ()=>{
    
    test('Nombre de lote no indicado', ()=>{
        const res = api.computeSuppliesList({});
        expect(res).toMatchObject({status:"error", wrong_keys:['field_name', 'work_area', 'products']});
    });

    test('Area de trabajo no indicada', ()=>{
        const params = {field_name: "Lote 1"};
        const res = api.computeSuppliesList(params);
        expect(res).toMatchObject({status:"error", wrong_keys:['work_area', 'products']});
    });

    test('Lista de productos vacia', ()=>{
        const params = {field_name: "Lote 1", work_area: 50};
        const res = api.computeSuppliesList(params);
        expect(res).toMatchObject({status:"error", wrong_keys:['products']});
    });

    // Caso lista de productos sin nombre de producto
    test('Lista de productos sin nombre o densidad de producto', ()=>{
        const params = {
            field_name: "Lote 1",
            work_area: 50,
            products: [{
                name: "",
                density: 20
            }]
        };
        const res = api.computeSuppliesList(params);
        expect(res).toMatchObject({status:"error", wrong_keys:['products']});
    });

    test('Formulario correcto', ()=>{
        const params = {
            field_name: "Lote 1",
            work_area: 50,
            products: [
                {
                    name: "Urea granulada", 
                    density: 50
                },
                {
                    name: "Otro", 
                    density: 20
                }
            ]
        };        
        const res = api.computeSuppliesList(params);
        expect(res).toMatchObject({status:"success"});
    });
});

describe('Cálculo de dosificación', ()=>{

    test('Directo exacto', ()=>{        
        const params = {
            method: "direct",
            expected_dose: 50,
            work_width: 20,
            distance: 50,
            recolected: 5
        };
        const res = api.computeDose(params);        
        expect(res).toMatchObject({status: "success", dose: 50, diffp: 0, diffkg: 0});
    });

    test('Directo sesgado', ()=>{        
        const params = {
            method: "direct",
            expected_dose: 50,
            work_width: 18,
            distance: 50,
            recolected: 5.5
        };
        const res = api.computeDose(params);
        expect(res.status).toBe("success");
        expect(res.dose).toBeCloseTo(61.11);
        expect(res.diffp).toBeCloseTo(22.22);
        expect(res.diffkg).toBeCloseTo(11.11);
    });

    test('Indirecto exacto', ()=>{        
        const params = {
            method: "indirect",
            expected_dose: 50,
            work_width: 20,
            time: 30,
            work_velocity: 12,
            recolected: 10
        };
        const res = api.computeDose(params);
        expect(res).toMatchObject({status: "success", dose: 50, diffp: 0, diffkg: 0});
    });

    test('Indirecto sesgado', ()=>{        
        const params = {
            method: "indirect",
            expected_dose: 50,
            work_width: 20,
            time: 30,
            work_velocity: 15,
            recolected: 10
        };
        const res = api.computeDose(params);
        expect(res.status).toBe("success");
        expect(res.dose).toBeCloseTo(40);
        expect(res.diffp).toBeCloseTo(-20);
        expect(res.diffkg).toBeCloseTo(-10);
    });
});

describe('Cálculo de perfil de fertilización', ()=>{
    
    // Tipo de comparacion por atributo: exacto o cercano (para float)
    const comp_type = {
        status: 0, // toBe
        profile: 2, // toStrictEqual
        //dose: 1, // toBeCloseTo
        avg: 1, // toBeCloseTo
        dst: 1, // toBeCloseTo
        cv: 1 // toBeCloseTo
    };

    const check_all = (params, expected) => {
        // Compara atributos de objeto por valor exacto o aproximado        
        const res = api.computeDistributionProfile(params);
        for(let attr in expected)
            switch(comp_type[attr]){
                case 0:
                    expect(res[attr]).toBe(expected[attr]);
                    break;
                case 1:
                    expect(res[attr]).toBeCloseTo(expected[attr]);
                    break;
                case 2:
                    expect(res[attr]).toStrictEqual(expected[attr]);
                    break;
            }
    };

    test('10 muestras, ida y vuelta, s bajo', ()=>{        
        const params = {
            tray_area: 0.4,
            tray_distance: 2,
            tray_number: 10,
            pass_number: 2,
            tray_data: [1,2,3,5,7,7,5,4,2,0],
            work_pattern: "linear",
            work_width: 14
        };
        const expected = {
            status: "success", 
            profile: [4,4,4,5,7,7,5,4,4,4],
            //dose: 60, 
            avg: 4.8, 
            dst: 1.23, 
            cv: 25.61
        };
        check_all(params, expected);
    });

    test('10 muestras, circular, s bajo', ()=>{
        const params = {            
            tray_area: 0.4,
            tray_distance: 2,
            tray_number: 10,
            pass_number: 2,
            tray_data: [1,2,3,5,7,7,5,4,2,0],
            work_pattern: "circular",
            work_width: 14
        };
        const expected = {
            status: "success",
            profile: [5,4,3,5,7,7,5,5,4,3],
            //dose: 60,
            avg: 4.8,
            dst: 1.40,
            cv: 29.13
        };
        check_all(params, expected);
    });
    
    test('10 muestras, ida y vuelta, s alto', ()=>{
        const params = {            
            tray_area: 0.4,
            tray_distance: 2,
            tray_number: 10,
            pass_number: 2,
            tray_data: [1,2,3,5,7,7,5,4,2,0],
            work_pattern: "linear",
            work_width: 8
        };
        const expected = {
            status: "success",
            profile: [10,9,8,8,9,10,9,9,10,9],
            //dose: 113.75,
            avg: 9.1,
            dst: 0.74,
            cv: 8.11
        };
        check_all(params, expected);
    });
    
    test('10 muestras, circular, s alto', ()=>{                
        const params = {            
            tray_area: 0.4,
            tray_distance: 2,
            tray_number: 10,
            pass_number: 2,
            tray_data: [1,2,3,5,7,7,5,4,2,0],
            work_pattern: "circular",
            work_width: 8
        };
        const expected = {
            status: "success",
            profile: [10,9,8,9,10,9,8,9,10,9],
            //dose: 113.75,
            avg: 9.1,
            dst: 0.74,
            cv: 8.11
        };
        check_all(params, expected);
    });

    test('15 muestras, ida y vuelta, s bajo', ()=>{                        
        const params = {
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 15,
            pass_number: 2,
            tray_data: [1,2,2,4,6,6,7,9,7,6,5,5,3,2,0],
            work_pattern: "linear",
            work_width: 12
        };
        const expected = {
            status: "success",
            profile: [3,4,3,4,6,6,7,9,7,6,5,5,3,4,3],
            //dose: 62.5,
            avg: 5.0,
            dst: 1.81,
            cv: 36.25
        };
        check_all(params, expected);
    });

    test('15 muestras, circular, s bajo', ()=>{        
        const params = {
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 15,
            pass_number: 2,
            tray_data: [1,2,2,4,6,6,7,9,7,6,5,5,3,2,0],
            work_pattern: "circular",
            work_width: 12
        };
        const expected = {
            status: "success",
            profile: [4,4,2,4,6,6,7,9,7,6,5,5,4,4,2],
            //dose: 62.5,
            avg: 5.0,
            dst: 1.89,
            cv: 37.8
        };
        check_all(params, expected);
    });

    test('15 muestras, ida y vuelta, s alto', ()=>{        
        const params = {
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 15,
            pass_number: 2,
            tray_data: [1,2,2,4,6,6,7,9,7,6,5,5,3,2,0],
            work_pattern: "linear",
            work_width: 6
        };        
        const expected = {
            status: "success",
            profile: [11,13,9,10,12,10,9,13,11,11,10,11,11,13,9],
            //dose: 135.83,
            avg: 10.87,
            dst: 1.41,
            cv: 12.95
        };
        check_all(params, expected);
    });

    test('15 muestras, circular, s alto', ()=>{        
        const params = {
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 15,
            pass_number: 2,
            tray_data: [1,2,2,4,6,6,7,9,7,6,5,5,3,2,0],
            work_pattern: "circular",
            work_width: 6
        };
        const expected = {
            status: "success",
            profile: [11,13,9,10,11,11,11,13,9,10,11,11,11,13,9],
            //dose: 135.83,
            avg: 10.87,
            dst: 1.36,
            cv: 12.48
        };
        check_all(params, expected);
    });

    test('18 muestras, ida y vuelta, s bajo', ()=>{                
        const params = {            
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 18,
            pass_number: 2,
            tray_data: [0,2,3,3,5,6,7,7,9,8,8,7,5,5,4,3,2,2],
            work_pattern: "linear",
            work_width: 13
        };        
        const expected = {
            status: "success", 
            profile: [5,5,6,5,5,6,7,7,9,8,8,7,5,7,6,6,6,7],
            //dose: 79.86, 
            avg: 6.39, 
            dst: 1.20, 
            cv: 18.70
        };
        check_all(params, expected);
    });

    test('18 muestras, circular, s bajo', ()=>{        
        const params = {            
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 18,
            pass_number: 2,
            tray_data: [0,2,3,3,5,6,7,7,9,8,8,7,5,5,4,3,2,2],
            work_pattern: "circular",
            work_width: 13
        };
        const expected = {
            status: "success",
            profile: [5,6,6,5,7,6,7,7,9,8,8,7,5,5,6,6,5,7],
            //dose: 79.86,
            avg: 6.39,
            dst: 1.20,
            cv: 18.70
        };
        check_all(params, expected);
    });

    test('18 muestras, ida y vuelta, s alto', ()=>{        
        const params = {            
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 18,
            pass_number: 2,
            tray_data: [0,2,3,3,5,6,7,7,9,8,8,7,5,5,4,3,2,2],
            work_pattern: "linear",
            work_width: 8
        };
        const expected = {
            status: "success",
            profile: [10,13,10,10,11,11,10,10,13,10,11,11,10,10,11,11,10,13],
            //dose: 135.42,
            avg: 10.83,
            dst: 1.1,
            cv: 10.14
        };
        check_all(params, expected);
    });

    test('18 muestras, circular, s alto', ()=>{        
        const params = {
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 18,
            pass_number: 2,
            tray_data: [0,2,3,3,5,6,7,7,9,8,8,7,5,5,4,3,2,2],
            work_pattern: "circular",
            work_width: 8
        };
        const expected = {
            status: "success",
            profile: [11,12,11,10,10,11,11,10,11,12,11,10,10,11,11,10,11,12],
            //dose: 135.42,
            avg: 10.83,
            dst: 0.71,
            cv: 6.53
        };
        check_all(params, expected);
    });
});

describe('Cálculo de insumos', ()=>{

    test('1 producto', ()=>{
        const params = {
            work_area: 54,
            field_name: "Lote 1",
            products: [
                {
                    name: "fertilizante",
                    density: 55
                }
            ]
        };
        const res = api.computeSuppliesList(params);
        expect(res.status).toBe("success");
        expect(res.quantities).toStrictEqual([2970]);
    });

    test('2 productos', ()=>{
        const params = {
            work_area: 120,
            field_name: "Lote 2",
            products: [
                {
                    name: "fertilizante",
                    density: 50
                },
                {
                    name: "otro",
                    density: 20
                }
            ]
        };
        const res = api.computeSuppliesList(params);
        expect(res.status).toBe("success");
        expect(res.quantities).toStrictEqual([6000, 2400]);
    });

    test('5 productos', ()=>{
        const params = {
            work_area: 10,
            field_name: "Lote 3",
            products: [
                {
                    name: "fertilizante 1",
                    density: 60
                },
                {
                    name: "fertilizante 2",
                    density: 20
                },
                {
                    name: "fertilizante 3",
                    density: 35
                },
                {
                    name: "fertilizante 4",
                    density: 15
                },
                {
                    name: "fertilizante 5",
                    density: 12
                }
            ]
        };
        const res = api.computeSuppliesList(params);
        expect(res.status).toBe("success");
        expect(res.quantities).toStrictEqual([600, 200, 350, 150, 120]);
    });
});