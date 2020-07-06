/*Variables globales a ser usadas*/
let data;
let modelo;
let xs, ys;
let rImg, gImg, bImg;
let labelP;
let lossP;

/*Lista de las etiquetas en el modelo*/
let listEtiqueta = [
    'Rojo',
    'Verde',
    'Azul',
    'Amarillo',
    'Rosado',
    'Gris',
    'Cafe',
    'Naranja',
    'Morado'
]

/*Aqui se carga en arcivo json con el resultado de los entrenamientos*/
function preload() {
    data = loadJSON('colorData.json');
}
/*------------------------------------------MANEJO DE DATOS-----------------------------------*/
/*Inicio del tratamiento de la data*/
function setup() {
    labelP = createP('label');
    lossP = createP('Perdida');

    /*Se llama a la funcion obtenerAvgRGB 
    para obtener el color promedio de la img*/
    var rgb = obtenerAvgRGB(document.getElementById('i'));

    /*Devuelve un arreglo rgb, se obtiene el valor de cada elemento
    del rgb (tres en este caso:r,g,b) y se asigna a las variables globales*/
    rImg = rgb.r;
    gImg = rgb.g;
    bImg = rgb.b;

    /*Prueba de lo anterior comentado*/
    console.log(rImg + "," + gImg + "," + bImg);

    let colores = [];
    let etiquetas = [];
    /*Foreach de cada elemnto de la data en Json*/
    for (let record of data.entries) {
        /*Se divide entre 255 para estandarizar valores (entre 0-1)*/
        let col = [record.r / 255, record.g / 255, record.b / 255];
        /*En el arreglo colores se introducen el valor de col estandarizado */
        colores.push(col);
        /*A cada etiqueta se le agrega un indice*/
        etiquetas.push(listEtiqueta.indexOf(record.label));
    }

    console.log();

    /*Entrada o imputs de los datos*/
    xs = tf.tensor2d(colores);
    let etiquetasTensor = tf.tensor1d(etiquetas, 'int32');

    /*Salida de las etiquetas o contra que se compara*/
    ys = tf.oneHot(etiquetasTensor, 9).cast('float32');
    etiquetasTensor.dispose();

    /*--------------------------CREACION DE CAPAS RED NEURONAL-----------------------------------*/

    /*Se crea el modelo de capas
    metodo de tensorflow para crearlo*/
    modelo = tf.sequential();

    /*Capas ocultas con funcion de activacion sigmoid*/
    const ocultas = tf.layers.dense({
        units: 16,
        inputShape: [3],
        activation: 'sigmoid'
    });

    /*Capa donde se almacenaran los resultados con la probabilidad
    de cada salida*/
    const output = tf.layers.dense({
        units: 9,
        /*softmax crea una distribucion estadistica*/
        activation: 'softmax'
    });

    /*Se añade al modelo las capas anteriomente creadas*/
    modelo.add(ocultas);
    modelo.add(output);

    /*-------------------------------APRENDIZAJE Y ENTRENAMIENTO----------------------------------*/
    const LEARNING_RATE = 0.25;
    const optimizer = tf.train.sgd(LEARNING_RATE);

    /* Se procede a compilar el modelo*/
    modelo.compile({
        optimizer: optimizer,
        /*Funcion que compara distribuciones estadisticas softmax*/
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });

    train();
}

/*Funcion asincrona de entrenamiento*/
async function train() {


    await modelo.fit(xs, ys, {
        shuffle: true,
        validationSplit: 0.1,
        /*Cantidad de iteraciones*/
        epochs: 100,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(epoch);
                lossP.html('Perdida: ' + logs.loss.toFixed(5));
            },
            onBatchEnd: async (batch, logs) => {
                await tf.nextFrame();
            },
            onTrainEnd: () => {
                console.log('finished')
            },
        },
    });
}


/*-------------------------------TRATAMIENTO DE IMAGEN (RGB)----------------------------------*/
function obtenerAvgRGB(imagen) {

    var blockSize = 5, // Visita cada 5 pixeles
        defaultRGB = {
            r: 0,
            g: 0,
            b: 0
        }, // Cuando no se sopporta derá negro el fondo
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {
            r: 0,
            g: 0,
            b: 0
        },
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imagen.naturalHeight || imagen.offsetHeight || imagen.height;
    width = canvas.width = imagen.naturalWidth || imagen.offsetWidth || imagen.width;

    context.drawImage(imagen, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch (e) {
        /* Si no se lee correctamente la img */
        alert('No se encontro el color');
        return defaultRGB;
    }

    length = data.data.length;

    // Se obtiene el promedio de los colores de los pixeles en la img

    while ((i += blockSize * 4) < length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
    }

    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;

}

function draw() {

    let r = rImg;
    let g = gImg;
    let b = bImg;
    background(r, g, b);
    strokeWeight(2);
    stroke(255);
    line(frameCount % width, 0, frameCount % width, height);


    tf.tidy(() => {
        const input = tf.tensor2d([
            [r, g, b]
        ]);
        let results = modelo.predict(input);
        let argMax = results.argMax(1);
        let index = argMax.dataSync()[0];
        let label = listEtiqueta[index];
        labelP.html(label);
    });
}