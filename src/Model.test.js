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
        expect(output).toMatchObject({status:"ok"});
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
        expect(output).toMatchObject({status:"ok"});
    });
});

describe('Validación formulario insumos', ()=>{
    let model;

    beforeAll(()=>{
        model = new CamperoModel();        
    });

    test('Area de trabajo no indicada', ()=>{
        const output = model.getSupplies();
        expect(output).toMatchObject({status:"error", message:model.error_messages[14]});
    });

    test('Nombre de lote no indicado', ()=>{
        model.work_area = 50;
        const output = model.getSupplies();
        expect(output).toMatchObject({status:"error", message:model.error_messages[15]});
    });

    test('Nombre de producto no indicado', ()=>{
        model.field_name = "Lote 1";
        const output = model.getSupplies();
        expect(output).toMatchObject({status:"error", message:model.error_messages[16]});
    });

    test('Formulario correcto', ()=>{
        model.products = [{name: "Urea granulada", density: 50}];
        const output = model.getSupplies();
        expect(output).toMatchObject({status:"ok"});
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
        expect(output).toMatchObject({status: "ok", dose: 50, diffp: 0, diffkg: 0});
    });

    test('Directo sesgado', ()=>{        
        Object.assign(model, {
            dose: 50,
            work_width: 18,
            distance: 50,
            recolected: 5.5
        });
        const output = model.getRealDose();
        expect(output.status).toBe("ok");
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
        expect(output).toMatchObject({status: "ok", dose: 50, diffp: 0, diffkg: 0});
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
        expect(output.status).toBe("ok");
        expect(output.dose).toBeCloseTo(40);
        expect(output.diffp).toBeCloseTo(-20);
        expect(output.diffkg).toBeCloseTo(-10);
    });
});

describe('Cálculo de perfil de fertilización', ()=>{
    let model;

    // Tipo de comparacion por atributo: exacto o cercano (para float)
    const exact_comp = {
        status: true,
        profile: true,
        dose: false,
        avg: false,
        dst: false,
        cv: false
    };

    const check_all = (expected, output) => {
        // Compara atributos de objeto por valor exacto o aproximado
        for(let attr in expected)
            if(exact_comp[attr])
                expect(output[attr]).toBe(expected[attr]);
            else 
                expect(output[attr]).toBeCloseTo(expected[attr]);
    };

    beforeEach(()=>{
        model = new CamperoModel();
    });

    test('10 muestras, ida y vuelta', ()=>{
        Object.assign(model, {
            work_pattern: 'linear',
            tray_area: 0.4,
            tray_distance: 2,
            tray_number: 10,
            pass_number: 2,
            work_width: 15,
            tray_data: []
        });
        const output = model.getProfile();
        const expected = {
            status: "ok", 
            profile: [],
            dose: 0, 
            avg: 0, 
            dst: 0, 
            cv: 0
        };
        check_all(expected, output);
    });

    test('10 muestras, circular', ()=>{
        Object.assign(model, {
            work_pattern: 'circular',
            tray_area: 0.4,
            tray_distance: 2,
            tray_number: 10,
            pass_number: 2,
            work_width: 15,
            tray_data: []
        });
        const output = model.getProfile();
        const expected = {
            status: "ok", 
            profile: [],
            dose: 0, 
            avg: 0, 
            dst: 0, 
            cv: 0
        };
        check_all(expected, output);
    });

    test('20 muestras, ida y vuelta', ()=>{
        Object.assign(model, {
            work_pattern: 'linear',
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 20,
            pass_number: 2,
            work_width: 15,
            tray_data: []
        });
        const output = model.getProfile();
        const expected = {
            status: "ok", 
            profile: [],
            dose: 0, 
            avg: 0, 
            dst: 0, 
            cv: 0
        };
        check_all(expected, output);
    });

    test('20 muestras, circular', ()=>{
        Object.assign(model, {
            work_pattern: 'circular',
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 20,
            pass_number: 2,
            work_width: 15,
            tray_data: []
        });
        const output = model.getProfile();
        const expected = {
            status: "ok", 
            profile: [],
            dose: 0, 
            avg: 0, 
            dst: 0, 
            cv: 0
        };
        check_all(expected, output);
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
        expect(output.status).toBe("ok");
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
        expect(output.status).toBe("ok");
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
                    name: "fertilizante 3",
                    density: 15
                },
                {
                    name: "fertilizante 3",
                    density: 12
                }
            ]
        });
        const output = model.getSupplies();
        expect(output.status).toBe("ok");
        expect(output.quantities).toStrictEqual([600, 200, 350, 150, 120]);
    });
});