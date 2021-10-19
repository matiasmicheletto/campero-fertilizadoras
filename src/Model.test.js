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
        model.product = "Urea";
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
    test('10 muestras, lineal', ()=>{

    });

    test('10 muestras, circular', ()=>{

    });

    test('20 muestras, lineal', ()=>{

    });

    test('20 muestras, circular', ()=>{

    });
});

describe('Cálculo de insumos', ()=>{
    test('1 producto', ()=>{

    });

    test('2 productos', ()=>{

    });
});