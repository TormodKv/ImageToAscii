<html>
<img src="<?php echo showImage(); ?>">
</html>

<?php
//Error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

$target_file = "uploads/" . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

// Check if image file is a actual image
if(isset($_POST["submit"])) {
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    if($check !== false) {
        $uploadOk = 1;
    } else {
        echo "File is not an image.";
        $uploadOk = 0;
    }
}

// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
    echo "Only JPG, JPEG and PNG.";
    $uploadOk = 0;
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "File was not uploaded.";
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {

        //create GdImage from image path.
        $image = match ($imageFileType) {
            "jpg", "jpeg" => imagecreatefromjpeg($target_file),
            "png" => imagecreatefrompng($target_file),
            default => null
        };

        //make it ascii ish
        convertToAscii($image, $_POST["desired_width"], $_POST["font"], $_POST["ramp"]);

    }
}

//Shows the original image
function showImage(): string
{
    $target_dir = "uploads/";
    return $target_dir . basename($_FILES["fileToUpload"]["name"]);
}

/**Draws an Ascii image of the image
 * @param $image
 * @param $desired_width
 */
function convertToAscii($image, $desired_width, $font, $ramp){

    if (strtoupper($font) == $font)
        $font = "Consolas";

    //Correct for font differences in height and width
    $image = fontCorrectScaleImage($image, $font);

    //Make the width the desired width
    $image = rescaleImage($image, $desired_width);

    //How the intensity ramps up
    if (!$ramp || $ramp == "")
        $ramp = "\$\$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?+~i!lI;:,\"^`'.  ";

    //The size of the image
    $width = imagesx($image);
    $height = imagesy($image);

    echo"<br>";

    //Loop through each pixel
    for ($y = 0; $y < $height; $y++) {

        //empty line before starting again
        $line = "";

        for ($x = 0; $x < $width; $x++) {

            //Find the specific color on the pixel
            $rgb = imagecolorat($image, $x, $y);
            $red = ($rgb >> 16) & 255;
            $green = ($rgb >> 8) & 255;
            $blue = $rgb & 255;

            //Add symbol with correct intenisty to line
            $whiteness = $red+$green+$blue;
            $ramp_length = strlen($ramp)-1;
            $adjusted_whiteness = ($whiteness * $ramp_length) / 765;
            $floored_adjusted_whiteness = floor($adjusted_whiteness);
            $symbol = $ramp[intval($floored_adjusted_whiteness)];
            if ($symbol == " ")
                $symbol = "&nbsp";
            $line .= $symbol;
        }

        //write the line and a space
        echo "<p style='font-family: $font; display: inline; white-space: nowrap;'>" . $line . "</p>";
        echo"<br>";
    }

}

/**
 * Takes an image and returns a resized version of the image, not bigger than the original
 * @param $image
 * @param $desired_width
 * @return object
 */
function rescaleImage($image, $desired_width) : GdImage{

    $image_width = imagesx($image);

    if (!$desired_width || $desired_width == 0)
        $desired_width = $image_width;

    $desired_width = min($image_width, $desired_width);
    return imagescale($image, $desired_width);
}

/**
 * Takes an GdImage and shrinks the height to correct for the specific font.
 * @param $image
 * @param $font
 * @return GdImage
 */
function fontCorrectScaleImage($image, $font) : GdImage{

    $height = match ($font){
        //Add more font here for more options
        "Consolas" => imagesy($image)/2.18,
        "Courier New" => imagesy($image)/1.87,
        "Lucida Console" => imagesy($image)/1.7,
        default => imagesy($image)
    };

    return imagescale($image, imagesx($image), $height);
}

?>
