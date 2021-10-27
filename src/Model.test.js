import CamperoModel from "./Model";

describe('Validación de formulario de dosificación', () => {    
    let model;

    beforeAll(()=>{
        model = new CamperoModel();
    });
    
    test('Dosis no especificada', ()=>{
        const output = model.getRealDose();
        expect(output).toMatchObject({status:"error", message:model.error_messages[1]});
    });

    test('Ancho de labor no especificado', ()=>{
        model.dose = 50;
        const output = model.getRealDose();
        expect(output).toMatchObject({status:"error", message:model.error_messages[2]});
    });

    test('Distancia no indicada', ()=>{
        model.work_width = 20;
        const output = model.getRealDose();
        expect(output).toMatchObject({status:"error", message:model.error_messages[3]});
    });

    test('Tiempo no indicado', ()=>{
        model.method = "indirect";
        const output = model.getRealDose();
        expect(output).toMatchObject({status:"error", message:model.error_messages[4]});
    });

    test('Velocidad de trabajo no indicada', ()=>{
        model.time = 30;
        const output = model.getRealDose();
        expect(output).toMatchObject({status:"error", message:model.error_messages[5]});
    });

    test('Peso recolectado no ingresado', ()=>{
        model.work_velocity = 15;
        const output = model.getRealDose();
        expect(output).toMatchObject({status:"error", message:model.error_messages[6]});
    });

    test('Formulario correcto', ()=>{
        model.recolected = 12;
        const output = model.getRealDose();
        expect(output).toMatchObject({status:"success"});
    });
});

describe('Validación de formulario de perfil', ()=>{
    let model;

    beforeAll(()=>{
        model = new CamperoModel();        
    });
    
    test('Area de bandeja no especificada', ()=>{
        const output = model.getProfile(15, "linear");
        expect(output).toMatchObject({status:"error", message:model.error_messages[7]});
    });

    test('Distancia entre bandejas no especificada', ()=>{
        model.tray_area = 0.4;
        const output = model.getProfile(15, "linear");
        expect(output).toMatchObject({status:"error", message:model.error_messages[8]});
    });

    test('Cantidad de bandejas no especificada', ()=>{
        model.tray_distance = 1;
        const output = model.getProfile(15, "linear");
        expect(output).toMatchObject({status:"error", message:model.error_messages[9]});
    });

    test('Cantidad de pasadas no especificada', ()=>{
        model.tray_number = 12;
        const output = model.getProfile(15, "linear");
        expect(output).toMatchObject({status:"error", message:model.error_messages[10]});
    });

    test('Ancho de labor no indicado', ()=>{
        model.pass_number = 2;
        const output = model.getProfile();
        expect(output).toMatchObject({status:"error", message:model.error_messages[11]});
    });

    test('Patrón de trabajo incorrecto', ()=>{        
        model.work_width = 18;
        model.work_pattern = "";
        const output = model.getProfile();
        expect(output).toMatchObject({status:"error", message:model.error_messages[12]});
    });

    test('Error en valores de peso recolectado', ()=>{       
        model.work_pattern = "linear"        
        const output = model.getProfile();
        expect(output).toMatchObject({status:"error", message:model.error_messages[13]});
    });

    test('Formulario correcto', ()=>{        
        model.tray_data = [1,2,3,5,5,6,5,4,3,3,2,1];
        const output = model.getProfile(15, "linear");
        expect(output).toMatchObject({status:"success"});
    });
});

describe('Validación formulario insumos', ()=>{
    let model;

    beforeAll(()=>{
        model = new CamperoModel();        
    });

    test('Nombre de lote no indicado', ()=>{
        const output = model.getSupplies();
        expect(output).toMatchObject({status:"error", message:model.error_messages[14]});
    });

    test('Area de trabajo no indicada', ()=>{
        model.field_name = "Lote 1";
        const output = model.getSupplies();
        expect(output).toMatchObject({status:"error", message:model.error_messages[15]});
    });

    test('Lista de productos vacia', ()=>{
        model.work_area = 50;
        const output = model.getSupplies();
        expect(output).toMatchObject({status:"error", message:model.error_messages[16]});
    });

    // Caso lista de productos sin nombre de producto
    test('Lista de productos sin nombre o densidad de producto', ()=>{
        model.products = [{
            name: "",
            density: 20
        }];
        const output = model.getSupplies();
        expect(output).toMatchObject({status:"error", message:model.error_messages[17]});
    });

    test('Formulario correcto', ()=>{
        model.products = [{name: "Urea granulada", density: 50}];
        const output = model.getSupplies();
        expect(output).toMatchObject({status:"success"});
    });
});

describe('Cálculo de dosificación', ()=>{
    let model;

    beforeEach(()=>{
        model = new CamperoModel();
    });

    test('Directo exacto', ()=>{        
        Object.assign(model, {
            dose: 50,
            work_width: 20,
            distance: 50,
            recolected: 5
        });
        const output = model.getRealDose();
        expect(output).toMatchObject({status: "success", dose: 50, diffp: 0, diffkg: 0});
    });

    test('Directo sesgado', ()=>{        
        Object.assign(model, {
            dose: 50,
            work_width: 18,
            distance: 50,
            recolected: 5.5
        });
        const output = model.getRealDose();
        expect(output.status).toBe("success");
        expect(output.dose).toBeCloseTo(61.11);
        expect(output.diffp).toBeCloseTo(22.22);
        expect(output.diffkg).toBeCloseTo(11.11);
    });

    test('Indirecto exacto', ()=>{        
        Object.assign(model, {
            method: "indirect",
            dose: 50,
            work_width: 20,
            time: 30,
            work_velocity: 12,
            recolected: 10
        });
        const output = model.getRealDose();
        expect(output).toMatchObject({status: "success", dose: 50, diffp: 0, diffkg: 0});
    });

    test('Indirecto sesgado', ()=>{        
        Object.assign(model, {
            method: "indirect",
            dose: 50,
            work_width: 20,
            time: 30,
            work_velocity: 15,
            recolected: 10
        });
        const output = model.getRealDose();
        expect(output.status).toBe("success");
        expect(output.dose).toBeCloseTo(40);
        expect(output.diffp).toBeCloseTo(-20);
        expect(output.diffkg).toBeCloseTo(-10);
    });
});

describe('Cálculo de perfil de fertilización', ()=>{
    let model;

    beforeEach(()=>{
        model = new CamperoModel();
    });

    // Tipo de comparacion por atributo: exacto o cercano (para float)
    const comp_type = {
        status: 0, // toBe
        profile: 2, // toStrictEqual
        dose: 1, // toBeCloseTo
        avg: 1, // toBeCloseTo
        dst: 1, // toBeCloseTo
        cv: 1 // toBeCloseTo
    };

    const check_all = (expected) => {
        // Compara atributos de objeto por valor exacto o aproximado
        const output = model.getProfile();        
        for(let attr in expected)
            switch(comp_type[attr]){
                case 0:
                    expect(output[attr]).toBe(expected[attr]);
                    break;
                case 1:
                    expect(output[attr]).toBeCloseTo(expected[attr]);
                    break;
                case 2:
                    expect(output[attr]).toStrictEqual(expected[attr]);
                    break;
            }
    };

    test('10 muestras, ida y vuelta, s bajo', ()=>{        
        Object.assign(model, {
            tray_area: 0.4,
            tray_distance: 2,
            tray_number: 10,
            pass_number: 2,
            tray_data: [1,2,3,5,7,7,5,4,2,0],
            work_pattern: "linear",
            work_width: 14
        });
        check_all({
            status: "success", 
            profile: [4,4,4,5,7,7,5,4,4,4],
            dose: 60, 
            avg: 4.8, 
            dst: 1.23, 
            cv: 25.61
        });
    });

    test('10 muestras, circular, s bajo', ()=>{
        Object.assign(model, {            
            tray_area: 0.4,
            tray_distance: 2,
            tray_number: 10,
            pass_number: 2,
            tray_data: [1,2,3,5,7,7,5,4,2,0],
            work_pattern: "circular",
            work_width: 14
        });
        check_all({
            status: "success",
            profile: [5,4,3,5,7,7,5,5,4,3],
            dose: 60,
            avg: 4.8,
            dst: 1.40,
            cv: 29.13
        });
    });
    
    test('10 muestras, ida y vuelta, s alto', ()=>{
        Object.assign(model, {            
            tray_area: 0.4,
            tray_distance: 2,
            tray_number: 10,
            pass_number: 2,
            tray_data: [1,2,3,5,7,7,5,4,2,0],
            work_pattern: "linear",
            work_width: 8
        });
        check_all({
            status: "success",
            profile: [10,9,8,8,9,10,9,9,10,9],
            dose: 113.75,
            avg: 9.1,
            dst: 0.74,
            cv: 8.11
        });
    });
    
    test('10 muestras, circular, s alto', ()=>{                
        Object.assign(model, {            
            tray_area: 0.4,
            tray_distance: 2,
            tray_number: 10,
            pass_number: 2,
            tray_data: [1,2,3,5,7,7,5,4,2,0],
            work_pattern: "circular",
            work_width: 8
        });
        check_all({
            status: "success",
            profile: [10,9,8,9,10,9,8,9,10,9],
            dose: 113.75,
            avg: 9.1,
            dst: 0.74,
            cv: 8.11
        });
    });

    test('15 muestras, ida y vuelta, s bajo', ()=>{                        
        Object.assign(model, {
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 15,
            pass_number: 2,
            tray_data: [1,2,2,4,6,6,7,9,7,6,5,5,3,2,0],
            work_pattern: "linear",
            work_width: 12
        });
        check_all({
            status: "success",
            profile: [3,4,3,4,6,6,7,9,7,6,5,5,3,4,3],
            dose: 62.5,
            avg: 5.0,
            dst: 1.81,
            cv: 36.25
        });
    });

    test('15 muestras, circular, s bajo', ()=>{        
        Object.assign(model, {
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 15,
            pass_number: 2,
            tray_data: [1,2,2,4,6,6,7,9,7,6,5,5,3,2,0],
            work_pattern: "circular",
            work_width: 12
        });
        check_all({
            status: "success",
            profile: [4,4,2,4,6,6,7,9,7,6,5,5,4,4,2],
            dose: 62.5,
            avg: 5.0,
            dst: 1.89,
            cv: 37.8
        });
    });

    test('15 muestras, ida y vuelta, s alto', ()=>{        
        Object.assign(model, {
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 15,
            pass_number: 2,
            tray_data: [1,2,2,4,6,6,7,9,7,6,5,5,3,2,0],
            work_pattern: "linear",
            work_width: 6
        });        
        check_all({
            status: "success",
            profile: [11,13,9,10,12,10,9,13,11,11,10,11,11,13,9],
            dose: 135.83,
            avg: 10.87,
            dst: 1.41,
            cv: 12.95
        });
    });

    test('15 muestras, circular, s alto', ()=>{        
        Object.assign(model, {
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 15,
            pass_number: 2,
            tray_data: [1,2,2,4,6,6,7,9,7,6,5,5,3,2,0],
            work_pattern: "circular",
            work_width: 6
        });
        check_all({
            status: "success",
            profile: [11,13,9,10,11,11,11,13,9,10,11,11,11,13,9],
            dose: 135.83,
            avg: 10.87,
            dst: 1.36,
            cv: 12.48
        });
    });

    test('18 muestras, ida y vuelta, s bajo', ()=>{                
        Object.assign(model, {            
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 18,
            pass_number: 2,
            tray_data: [0,2,3,3,5,6,7,7,9,8,8,7,5,5,4,3,2,2],
            work_pattern: "linear",
            work_width: 13
        });        
        check_all({
            status: "success", 
            profile: [5,5,6,5,5,6,7,7,9,8,8,7,5,7,6,6,6,7],
            dose: 79.86, 
            avg: 6.39, 
            dst: 1.20, 
            cv: 18.70
        });
    });

    test('18 muestras, circular, s bajo', ()=>{        
        Object.assign(model, {            
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 18,
            pass_number: 2,
            tray_data: [0,2,3,3,5,6,7,7,9,8,8,7,5,5,4,3,2,2],
            work_pattern: "circular",
            work_width: 13
        });
        check_all({
            status: "success",
            profile: [5,6,6,5,7,6,7,7,9,8,8,7,5,5,6,6,5,7],
            dose: 79.86,
            avg: 6.39,
            dst: 1.20,
            cv: 18.70
        });
    });

    test('18 muestras, ida y vuelta, s alto', ()=>{        
        Object.assign(model, {            
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 18,
            pass_number: 2,
            tray_data: [0,2,3,3,5,6,7,7,9,8,8,7,5,5,4,3,2,2],
            work_pattern: "linear",
            work_width: 8
        });
        check_all({
            status: "success",
            profile: [10,13,10,10,11,11,10,10,13,10,11,11,10,10,11,11,10,13],
            dose: 135.42,
            avg: 10.83,
            dst: 1.1,
            cv: 10.14
        });
    });

    test('18 muestras, circular, s alto', ()=>{        
        Object.assign(model, {            
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 18,
            pass_number: 2,
            tray_data: [0,2,3,3,5,6,7,7,9,8,8,7,5,5,4,3,2,2],
            work_pattern: "circular",
            work_width: 8
        });
        check_all({
            status: "success",
            profile: [11,12,11,10,10,11,11,10,11,12,11,10,10,11,11,10,11,12],
            dose: 135.42,
            avg: 10.83,
            dst: 0.71,
            cv: 6.53
        });
    });
});

describe('Cálculo de insumos', ()=>{
    let model;

    beforeEach(()=>{
        model = new CamperoModel();
    });

    test('1 producto', ()=>{
        Object.assign(model, {
            work_area: 54,
            field_name: "Lote 1",
            products: [
                {
                    name: "fertilizante",
                    density: 55
                }
            ]
        });
        const output = model.getSupplies();
        expect(output.status).toBe("success");
        expect(output.quantities).toStrictEqual([2970]);
    });

    test('2 productos', ()=>{
        Object.assign(model, {
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
        });
        const output = model.getSupplies();
        expect(output.status).toBe("success");
        expect(output.quantities).toStrictEqual([6000, 2400]);
    });

    test('5 productos', ()=>{
        Object.assign(model, {
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
        });
        const output = model.getSupplies();
        expect(output.status).toBe("success");
        expect(output.quantities).toStrictEqual([600, 200, 350, 150, 120]);
    });
});