var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var originalRamp = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~i!lI;:,\"^`'.  ";
var ramp = originalRamp;
var AsciiArt = "";
var AsciiParagraph = document.getElementById("Ascii");
var imageSource = "";
var uploadedImage;
//Kept values for CreateImageDataAndDrawAscii
var cvs;
var ctx;
var img;
var sizeSlider = document.getElementById("widthSlider");
var sizeNumber = document.getElementById('widthNumber');
var speedSlider = document.getElementById("speedSlider");
var rampSlider = document.getElementById("rampSlider");
var loop = false;
var gifSpeed = 100;
window.addEventListener('load', AddImageChangeListener);
document.getElementById("widthSlider").addEventListener('input', PrepareImage, false);
document.getElementById("rampSlider").addEventListener('input', ChangeRamp, false);
document.getElementById("speedSlider").addEventListener('input', ChangeGifSpeed, false);
document.getElementById("widthNumber").addEventListener('change', WidthNumberChange);
function AddImageChangeListener() {
    document.querySelector('input[type="file"]').addEventListener('change', PaintImage);
}
function ChangeRamp() {
    ramp = originalRamp;
    for (var i = 0; i < rampSlider.value; i++) {
        ramp = ramp.replace(ramp.charAt(Math.floor(Math.random() * (ramp.length - 1))), "");
    }
    ramp = "$" + ramp;
    console.log(ramp);
    PrepareImage();
}
function ChangeGifSpeed() {
    gifSpeed = Math.pow(speedSlider.max - speedSlider.value, 2) / 10;
}
function PrepareImage() {
    if (!uploadedImage)
        return;
    sizeSlider.max = uploadedImage.width;
    sizeNumber.value = sizeSlider.value;
    if (!loop)
        CreateImageDataAndDrawAscii();
}
function WidthNumberChange() {
    sizeSlider.value = sizeNumber.value;
    PrepareImage();
}
function PaintImage() {
    loop = false;
    cvs = null;
    ctx = null;
    if (!this.files || !this.files[0])
        return;
    imageSource = URL.createObjectURL(this.files[0]);
    //If the uploaded file is a gif: do its own thing
    if (this.files[0].name.split('.').pop() == "gif") {
        loop = true;
        LoopGif();
        return;
    }
    var imageCanvas = document.getElementById("imageCanvas");
    var imageContext = imageCanvas.getContext("2d");
    imageContext.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    uploadedImage = new Image;
    uploadedImage.src = imageSource;
    uploadedImage.onload = function () {
        imageContext.drawImage(uploadedImage, 0, 0);
        PrepareImage();
    };
}
function CreateImageDataAndDrawAscii() {
    img = img ? img : new Image();
    img.src = imageSource;
    var w = sizeSlider.value;
    var h = (img.height * (sizeSlider.value / img.width)) / 2.2;
    cvs = cvs ? cvs : document.createElement('canvas');
    if (img.width > cvs.width || img.height / 2.2 > cvs.height) {
        ctx = null;
        cvs.width = img.width;
        cvs.height = img.height / 2.2;
    }
    if (!ctx) {
        ctx = cvs.getContext("2d");
    }
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    img.onload = function () {
        ctx.drawImage(img, 0, 0, w, h);
        var imageData = ctx.getImageData(0, 0, w, h).data;
        CreateAscii(imageData, w);
    };
}
function CreateAscii(imageDataArray, imageWidth) {
    AsciiParagraph.innerHTML = "";
    AsciiArt = "";
    for (var i = 0; i < imageDataArray.length; i += 4) {
        var red = imageDataArray[i];
        var green = imageDataArray[i + 1];
        var blue = imageDataArray[i + 2];
        var totalRGB = red + green + blue;
        var rampAdjustedTotalRGB = Math.floor((totalRGB * (ramp.length) - 1) / (255 * 3));
        var symbol = ramp[Math.floor(Math.max(rampAdjustedTotalRGB, 0))];
        symbol = symbol == ' ' ? '&nbsp' : symbol;
        AsciiArt += symbol;
        if (((i + 4) / 4) % imageWidth == 0) {
            AsciiArt += '<br/>';
        }
    }
    AsciiParagraph.innerHTML = AsciiArt;
}
function LoopGif() {
    var img = document.getElementById("gifimg");
    img.src = imageSource;
    $(document).ready(function () {
        $('#gifimg').each(function (idx, img_tag) {
            // @ts-ignore
            var rub = new SuperGif({ gif: img_tag, progressbar_height: 0 });
            // @ts-ignore
            rub.load(function () {
                return __awaiter(this, void 0, void 0, function () {
                    var i, canvas;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!loop) return [3 /*break*/, 5];
                                i = 0;
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < rub.get_length())) return [3 /*break*/, 4];
                                rub.move_to(i);
                                canvas = cloneCanvas(rub.get_canvas());
                                $("#frames").append(canvas);
                                return [4 /*yield*/, sleep(gifSpeed)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                i++;
                                return [3 /*break*/, 1];
                            case 4: return [3 /*break*/, 0];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            });
        });
    });
}
function sleep(ms) {
    // @ts-ignore
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function cloneCanvas(oldCanvas) {
    var oldWidth = oldCanvas.width;
    var oldHeight = oldCanvas.height;
    if (sizeSlider.max != oldWidth) {
        sizeSlider.max = oldWidth;
    }
    var w = sizeSlider.value;
    var h = (oldHeight * (sizeSlider.value / oldWidth)) / 2.2;
    //create a new canvas
    cvs = cvs ? cvs : document.createElement('canvas');
    var newCanvas = document.getElementById('imageCanvas');
    var context = newCanvas.getContext('2d');
    //set dimensions
    newCanvas.width = oldWidth;
    newCanvas.height = oldHeight;
    if (cvs.width != oldWidth) {
        ctx = null;
        cvs.width = oldWidth;
        cvs.height = oldHeight / 2.2;
    }
    if (!ctx) {
        ctx = cvs.getContext("2d");
    }
    ctx.drawImage(oldCanvas, 0, 0, w, h);
    var imageData = ctx.getImageData(0, 0, w, h).data;
    CreateAscii(imageData, w);
    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);
    //return the new canvas
    return newCanvas;
}
