class Imagen {
  constructor(ctx, canvasWidth, canvasHeight, file) {
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.image = this.setNewImage(file);
  }

  setNewImage(file) {
    if (file != null && file.type.startsWith("image/")) {//si es un archivo de tipo imagen (JPG, JPEG, PNG, etc)
      let image = new Image();

      image.src = URL.createObjectURL(file); //creamos una url al file subido y se lo ponemos al objeto image para cuando se dibuje

      this.image = image;
    }
  }

  drawImage() {
    this.image.onload = () => {//cuando se imagen al objeto
      this.ctx.drawImage(this.image, 0, 0, this.canvasWidth, this.canvasHeight);
    };
  }

  getImageData() {
    return this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
  }

  drawImageData(ImageData) {
    this.ctx.putImageData(ImageData, 0, 0);
  }

  filterOriginal() { //volvemos a nuestra imagen original (la ultima imagen que subimos)
    this.ctx.drawImage(this.image, 0, 0, this.canvasWidth, this.canvasHeight);
  }

  filterNegative() {
    let imageData = this.getImageData();

    //por cada pixel de la imagen le invertimos su RGB
    for (let i = 0; i < imageData.data.length; i += 4) {
      let r = imageData.data[i];
      let g = imageData.data[i + 1];
      let b = imageData.data[i + 2];

      //aca aplicamos la inversion
      imageData.data[i] = 255 - r;
      imageData.data[i + 1] = 255 - g;
      imageData.data[i + 2] = 255 - b;
    }

    this.drawImageData(imageData);
  }

  filterBrightness() {
    let imageData = this.getImageData();

    let brightness = 2;

    for (let i = 0; i < imageData.data.length; i += 4) {
      let r = imageData.data[i];
      let g = imageData.data[i + 1];
      let b = imageData.data[i + 2];

      //a cada color del pixel lo multiplicamos por 2 para subir su brilo, con un límite de 255
      imageData.data[i] = Math.min(r * brightness, 255);
      imageData.data[i + 1] = Math.min(g * brightness, 255);
      imageData.data[i + 2] = Math.min(b * brightness, 255);
    }

    this.drawImageData(imageData);
  }

  filterBinarization() {
    let imageData = this.getImageData();

    //valor del umbral ubica el punto medio donde en un lado se aplica blanco y en otro negro
    let umbral = 128;

    for (let i = 0; i < imageData.data.length; i += 4) {
      let r = imageData.data[i];
      let g = imageData.data[i + 1];
      let b = imageData.data[i + 2];

      //calculamos el valor gris del pixel
      let gray = (r + g + b) / 3;

      //si mi escala de gris queda de un lado u otro del umbral
      let binarizado;
      if (gray < umbral) {
        binarizado = 0; //aplico negro
      } else {//o
        binarizado = 255; //aplico blanco
      }

      imageData.data[i] = binarizado;
      imageData.data[i + 1] = binarizado;
      imageData.data[i + 2] = binarizado;
    }

    this.drawImageData(imageData);
  }

  filterSepia() {
    let imageData = this.getImageData();

    for (let i = 0; i < imageData.data.length; i += 4) {
      let r = imageData.data[i];
      let g = imageData.data[i + 1];
      let b = imageData.data[i + 2];

      let gray = (r + g + b) / 3;

      //calculo sobre los colores del pixel para tener un efecto sepia
      imageData.data[i] = Math.min(gray + 100, 255);
      imageData.data[i + 1] = Math.min(gray + 50, 255);
      imageData.data[i + 2] = gray;
    }

    this.drawImageData(imageData);
  }

  filterSaturation() {
    let imageData = this.getImageData();

    let saturation = 300; //saturación que se agrega a la imagen
    let intensity = (saturation + 100) / 100; //calculamos la intensidad

    //coeficientes
    let rw = 0.3086;
    let rg = 0.6084;
    let rb = 0.082;

    for (let i = 0; i < imageData.data.length; i += 4) {
      let r = imageData.data[i];
      let g = imageData.data[i + 1];
      let b = imageData.data[i + 2];

      let gray = rw * r + rg * g + rb * b; // Obtenemos la escala de grises
      imageData.data[i] = gray + intensity * (r - gray);
      imageData.data[i + 1] = gray + intensity * (g - gray);
      imageData.data[i + 2] = gray + intensity * (b - gray);
    }

    this.drawImageData(imageData);
  }

  filterBlur() {
    let imageData = this.getImageData();

    let data = imageData.data;
    let width = imageData.width;
    let height = imageData.height;

    //por cada pixel que recorremos
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let index = (y * width + x) * 4;

        let r = 0;
        let g = 0;
        let b = 0;

        //para pixel del kernel
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            // calculamos el índice del pixel en el kernel
            let pixelIndex = ((y + ky) * width + (x + kx)) * 4;

            // Si el índice está dentro del rango de la imagen, sumamos los valores RGB
            if (pixelIndex >= 0 && pixelIndex < data.length) {
              r += data[pixelIndex];
              g += data[pixelIndex + 1];
              b += data[pixelIndex + 2];
            }
          }
        }

        // Seteamos los valores RGB del pixel actual con el promedio de los valores RGB del kernel
        data[index] = r / 9;
        data[index + 1] = g / 9;
        data[index + 2] = b / 9;
      }
    }

    this.drawImageData(imageData);
  }
}
