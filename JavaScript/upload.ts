var originalRamp : string = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~i!lI;:,\"^`'.  ";
var ramp : string = originalRamp;
var AsciiArt : string = "";
var AsciiParagraph = document.getElementById("Ascii");

var imageSource : string = "";
var uploadedImage;

//Kept values for CreateImageDataAndDrawAscii
var cvs;
var ctx;
var img;
var sizeSlider : any = document.getElementById("widthSlider");
var sizeNumber : any = document.getElementById('widthNumber');
var speedSlider : any = document.getElementById("speedSlider");
var rampSlider : any = document.getElementById("rampSlider");
var scaleFont : any = document.getElementById("scaleFont");

var loop : boolean = false;
var gifSpeed : number = 100;
var pause = false;

window.addEventListener('load', AddImageChangeListener);
document.getElementById("widthSlider").addEventListener('input', PrepareImage, false);
document.getElementById("rampSlider").addEventListener('input', ChangeRamp, false);
document.getElementById("speedSlider").addEventListener('input', ChangeGifSpeed, false);
document.getElementById("widthNumber").addEventListener('change', WidthNumberChange);
document.getElementById("pausePlayButton").addEventListener('click', PausePlay);
document.getElementById("scaleFont").addEventListener('change', PrepareImage);

function AddImageChangeListener() {
    document.querySelector('input[type="file"]').addEventListener('change', PaintImage);
}

function PausePlay(){
    pause = !pause;
}

function ChangeRamp(){
    ramp = originalRamp;

    for (let i = 0; i < rampSlider.value; i++) {
        ramp = ramp.replace(ramp.charAt(Math.floor(Math.random()*(ramp.length-1))), "");
    }
    ramp = "$" + ramp;
    PrepareImage();
}

function ChangeGifSpeed(){
    gifSpeed = Math.pow(speedSlider.max- speedSlider.value, 2) / 10;
}

function PrepareImage(){

    if(scaleFont.checked) {
        var fontSize : number = (sizeSlider.max / sizeSlider.value) * 2;
        AsciiParagraph.style.fontSize = String(fontSize) + "px";
    } else {
        AsciiParagraph.style.fontSize = "1em";
    }

    if (!loop){
        sizeSlider.max = uploadedImage.width;
        sizeNumber.value = sizeSlider.value;
        CreateImageDataAndDrawAscii();
    }

}

function WidthNumberChange(){
    sizeSlider.value = sizeNumber.value;
    PrepareImage();
}

function PaintImage(){

    loop = false;
    cvs = null;
    ctx = null;

    if (!this.files || !this.files[0])
        return;

    imageSource = URL.createObjectURL(this.files[0]);

    //If the uploaded file is a gif: do its own thing
    if (this.files[0].name.split('.').pop() == "gif"){
        loop = true;
        document.getElementById("gifOnlyAdjustments").style.display = "block";
        LoopGif();
        return;
    }

    document.getElementById("gifOnlyAdjustments").style.display = "none";

    var imageCanvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("imageCanvas");

    var imageContext : CanvasRenderingContext2D = imageCanvas.getContext("2d");

    imageContext.clearRect(0,0,imageCanvas.width, imageCanvas.height);

    uploadedImage = new Image;

    uploadedImage.src = imageSource;

    uploadedImage.onload = function(){
        imageContext.drawImage(uploadedImage,0,0);
        PrepareImage();
    };
}

function CreateImageDataAndDrawAscii() {

    img = img ? img : new Image();
    img.src = imageSource;
    var w = sizeSlider.value;
    var h = (img.height * (sizeSlider.value/img.width))/ 2.2;


    cvs = cvs ? cvs : document.createElement('canvas');

    if (img.width > cvs.width || img.height/2.2 > cvs.height){
        ctx = null;
        cvs.width = img.width;
        cvs.height = img.height/2.2;
    }

    if (!ctx){
        ctx = cvs.getContext("2d");
    }

    ctx.clearRect(0,0,cvs.width, cvs.height);


    img.onload = function(){
        ctx.drawImage(img,0,0,w,h);
        var imageData : Uint8ClampedArray = ctx.getImageData(0,0, w, h).data;
        CreateAscii(imageData, w);
    };

}

function CreateAscii(imageDataArray : Uint8ClampedArray, imageWidth : number, writeToHTML = true){

    if (writeToHTML)
        AsciiParagraph.innerHTML = "";

    AsciiArt = "";

    for (let i = 0; i < imageDataArray.length; i+=4) {
        let red : number = imageDataArray[i];
        let green : number = imageDataArray[i+1];
        let blue : number = imageDataArray[i+2];

        let totalRGB : number = red + green + blue;
        let rampAdjustedTotalRGB : number = Math.floor((totalRGB*(ramp.length)-1) / (255*3));

        let symbol : string = ramp[Math.floor(Math.max(rampAdjustedTotalRGB , 0))];

        symbol = symbol == ' ' ? '&nbsp' : symbol;

        AsciiArt += symbol;

        if(((i+4) / 4) % imageWidth == 0){
            AsciiArt += '<br/>';
        }
    }

    if (writeToHTML){
        AsciiParagraph.innerHTML = AsciiArt;
    }
}

function LoopGif() {
    var img : any = document.getElementById("gifimg");
        img.src = imageSource;
        $(document).ready(function () {
            $('#gifimg').each(function (idx, img_tag) {
                // @ts-ignore
                var rub = new SuperGif({gif: img_tag, progressbar_height: 0});
                // @ts-ignore
                rub.load(async function () {
                    while (loop) {
                        var i = 0;
                        for (i = 0; i < rub.get_length(); i++) {

                            if(pause){
                                i--;
                                await sleep(50);
                                continue;
                            }

                            rub.move_to(i);
                            var canvas = await cloneCanvas(rub.get_canvas());
                            $("#frames").append(canvas);
                        }
                    }
                });
            });
        });
}

function sleep(ms) {
    // @ts-ignore
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function cloneCanvas(oldCanvas) {

    var t0 : number = performance.now();

    var oldWidth = oldCanvas.width;
    var oldHeight = oldCanvas.height;

    if (sizeSlider.max != oldWidth){
        sizeSlider.max = oldWidth;
    }

    var w = sizeSlider.value;
    var h = (oldHeight * (sizeSlider.value/oldWidth))/ 2.2;

    w = Math.max(w,1);
    h = Math.max(h,1);

    //create a new canvas
    cvs = cvs ? cvs : document.createElement('canvas');

    if (cvs.width != oldWidth){
        ctx = null;
        cvs.width = oldWidth;
        cvs.height = oldHeight/2.2;
    }

    if (!ctx){
        ctx = cvs.getContext("2d");
    }

    ctx.drawImage(oldCanvas,0,0,w,h);
    var imageData : Uint8ClampedArray = ctx.getImageData(0,0, w, h).data;
    CreateAscii(imageData, w, false);

    var newCanvas : any = document.getElementById('imageCanvas');
    var context = newCanvas.getContext('2d');

    var t1 : number = performance.now();


    await sleep(Math.max(gifSpeed - (t1-t0)));

    if (!loop)
        return;

    //set dimensions
    newCanvas.width = oldWidth;
    newCanvas.height = oldHeight;

    AsciiParagraph.innerHTML = AsciiArt;
    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}


